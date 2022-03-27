var SCREEN_WIDTH = 256;
var SCREEN_HEIGHT = 240;
var FRAMEBUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT;

var canvas_ctx, image;
var framebuffer_u8, framebuffer_u32;

var AUDIO_BUFFERING = 512;
var SAMPLE_COUNT = 4 * 1024;
var SAMPLE_MASK = SAMPLE_COUNT - 1;
var audio_samples_L = new Float32Array(SAMPLE_COUNT);
var audio_samples_R = new Float32Array(SAMPLE_COUNT);
var audio_write_cursor = 0, audio_read_cursor = 0;

var running = false;

var audioSp = null;

var nes = new jsnes.NES({
    onFrame: function (framebuffer_24) {
        for (var i = 0; i < FRAMEBUFFER_SIZE; i++) framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
    },
    onAudioSample: function (l, r) {
        audio_samples_L[audio_write_cursor] = l;
        audio_samples_R[audio_write_cursor] = r;
        audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
    },
});

function onAnimationFrame() {
    window.requestAnimationFrame(onAnimationFrame);

    image.data.set(framebuffer_u8);
    canvas_ctx.putImageData(image, 0, 0);
}

function audio_remain() {
    return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
}

function audio_callback(event) {
    var dst = event.outputBuffer;
    var len = dst.length;

    // Attempt to avoid buffer underruns.
    if (audio_remain() < AUDIO_BUFFERING) {
        try {
            nes.frame();
        } catch (exception) {
            audioSp.disconnect();
            if (running) {
                handleCrash();
                alert('crashed');
            }
            running = false;
        }
    }

    var dst_l = dst.getChannelData(0);
    var dst_r = dst.getChannelData(1);
    for (var i = 0; i < len; i++) {
        var src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
        dst_l[i] = audio_samples_L[src_idx];
        dst_r[i] = audio_samples_R[src_idx];
    }

    audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
}

function keyboard(callback, event) {
    var player = 1;
    switch (event.keyCode) {
        case 38: // UP
            callback(player, jsnes.Controller.BUTTON_UP); break;
        case 40: // Down
            callback(player, jsnes.Controller.BUTTON_DOWN); break;
        case 37: // Left
            callback(player, jsnes.Controller.BUTTON_LEFT); break;
        case 39: // Right
            callback(player, jsnes.Controller.BUTTON_RIGHT); break;
        case 65: // 'a' - qwerty, dvorak
        case 81: // 'q' - azerty
            callback(player, jsnes.Controller.BUTTON_A); break;
        case 83: // 's' - qwerty, azerty
        case 79: // 'o' - dvorak
            callback(player, jsnes.Controller.BUTTON_B); break;
        case 9: // Tab
            callback(player, jsnes.Controller.BUTTON_SELECT); break;
        case 13: // Return
            callback(player, jsnes.Controller.BUTTON_START); break;
        default: break;
    }
}

function nes_init(canvas_id) {
    var canvas = document.getElementById(canvas_id);
    canvas_ctx = canvas.getContext("2d");
    image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    canvas_ctx.fillStyle = "black";
    canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Allocate framebuffer array.
    var buffer = new ArrayBuffer(image.data.length);
    framebuffer_u8 = new Uint8ClampedArray(buffer);
    framebuffer_u32 = new Uint32Array(buffer);

    // Setup audio.
    var audio_ctx = new window.AudioContext();
    var script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
    script_processor.onaudioprocess = audio_callback;
    script_processor.connect(audio_ctx.destination);
    audioSp = script_processor;
}

function nes_boot(rom_data) {

    nes.loadROM(rom_data);
    window.requestAnimationFrame(onAnimationFrame);

}

function nes_load_data(canvas_id, rom_data) {
    nes_init(canvas_id);
    nes_boot(rom_data);
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function loadFS(cartZipUrl) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', cartZipUrl, true);
    xhr.responseType = 'arraybuffer';
    xhr.onprogress = function (e) {
        var loaded = Math.round(e.loaded / 1024) + " KB";
        var total = Math.round(e.total / 1024) + " KB";
        var loadingState = loaded + " / " + total;

        $("#loading_status").text(loadingState);
    };
    xhr.onload = function (e) {
        if (xhr.status === 200) {
            $("#loading_status").text("加载完成 点击屏幕开始 Click to Start")
            prepareFs(xhr.response);
        }
    }
    xhr.send();
}

function prepareFs(zipData) {
    console.log("check point!")
    var Buffer = BrowserFS.BFSRequire('buffer').Buffer;

    BrowserFS.configure({
        fs: "MountableFileSystem",
        options: {
            "/zip": {
                fs: "ZipFS",
                options: {
                    // Wrap as Buffer object.
                    zipData: Buffer.from(zipData)
                }
            }
        }
    }, function (e) {
        if (e) {
            // An error occurred.
            throw e;
        }
        // Otherwise, BrowserFS is ready to use!
    });
}

function playGame() {
    var fs = BrowserFS.BFSRequire('fs');

    fs.readdir('/', function (e, contents) {
        var diskBuffer = fs.readFileSync("zip/game.nes", { encoding: 'binary' });

        if (!running) {
            running = true;
            console.log("check point 2");
            nes_load_data('display_canvas', diskBuffer);
        }
    });

}

function handleCrash() {
    var unsupportedGamesStr = localStorage.getItem('jsemu_unsupported');
    if (null == unsupportedGamesStr) {
        unsupportedGames = {}
    } else {
        unsupportedGames = JSON.parse(unsupportedGamesStr)
    }
    unsupportedGames[getUrlVars()["game"]] = 1;
    localStorage.setItem('jsemu_unsupported', JSON.stringify(unsupportedGames));
}

$(document).ready(function () {
    var device = getUrlVars()["device"];
    if (!device) {
        device = "nespal"
    }

    var gameBaseUrl = "https://dnbwg3.cdn.bcebos.com/roms-nes-zip/"
    if (device == "sb486") {
        gameBaseUrl = "https://dnbwg3.cdn.bcebos.com/roms-edu-zip/"
    }

    var game = getUrlVars()["game"];
    var cart = gameBaseUrl + game + ".zip"

    var mameLink = "famiclone.html?game=" + game + "&device=" + device;
    $("#mameLink").attr("href", mameLink);

    loadFS(cart);
    document.getElementById("status-display").addEventListener('click', function () {
        $("#status-display").hide();
        $("#display_canvas").show();

        playGame();
    })
});
