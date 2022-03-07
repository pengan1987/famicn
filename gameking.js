
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function runMAME(cart, game, device) {
    var wantsWASM = 'WebAssembly' in window;

    var wasmjs_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamegameking_wasm.js";
    var wasm_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamegameking_wasm.wasm"
    var js_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamegameking.js";
    var biosPath = "https://dnbwg.cdn.bcebos.com/emularity-common/bios/"

    var biosFileName = device + ".zip";

    var myJSLoader = new JSMESSLoader(JSMESSLoader.driver(device),
        JSMESSLoader.nativeResolution(480, 320),
        JSMESSLoader.emulatorJS(wantsWASM ? wasmjs_filename : js_filename),
        JSMESSLoader.emulatorWASM(wantsWASM && wasm_filename),
        JSMESSLoader.mountFile(biosFileName,
            JSMESSLoader.fetchFile("BIOS",
                biosPath + biosFileName)),
        JSMESSLoader.mountFile(game + ".zip",
            JSMESSLoader.fetchFile("Game File",
                cart)),
        JSMAMELoader.peripheral("cart", game + ".zip")
    )

    if (!game) {
        myJSLoader = new JSMESSLoader(JSMESSLoader.driver(device),
            JSMESSLoader.nativeResolution(480, 320),
            JSMESSLoader.emulatorJS(wantsWASM ? wasmjs_filename : js_filename),
            JSMESSLoader.emulatorWASM(wantsWASM && wasm_filename),
            JSMESSLoader.mountFile(biosFileName,
                JSMESSLoader.fetchFile("BIOS",
                    biosPath + biosFileName))
        )
    }

    var emulator = new Emulator(document.querySelector(".emucanvas"), postRun, myJSLoader);
    emulator.start({ waitAfterDownloading: true });
}

function postRun() {
    console.log("Emulator started");
    var bodyWidth = $("body").width();
    if (bodyWidth < 600) {
        $("#mobile-tools").show();
        resizeCanvas();
    }
}

function resizeCanvas() {
    var bodyWidth = $("body").width();
    var canvasWidth = $("#canvas").width();
    var canvasHeight = $("#canvas").height();
    if (bodyWidth < canvasWidth) {
        //Resize canvas for mobile device
        var newHeight = Math.round(canvasHeight * bodyWidth / canvasWidth);
        $("#canvas").width(bodyWidth);
        $("#canvas").height(newHeight);
    }
}

//IE 11 string includes ployfill
if (!String.prototype.includes) {
    Object.defineProperty(String.prototype, 'includes', {
        value: function (search, start) {
            if (typeof start !== 'number') {
                start = 0
            }

            if (start + search.length > this.length) {
                return false
            } else {
                return this.indexOf(search, start) !== -1
            }
        }
    })
}

$(document).ready(function () {
    console.log("ready!");
    var gameBaseUrl = "https://famicn-1255835060.file.myqcloud.com/gameking-roms/";
    var gamekin3BaseUrl = "https://famicn-1255835060.file.myqcloud.com/gameking-roms/gamekin3/";
    var game = getUrlVars()["game"];
    var gamekin3only = getUrlVars()["gamekin3only"];
    var cart = gameBaseUrl + game + ".zip";

    if (gamekin3only) {
        cart = gamekin3BaseUrl + game + ".zip";
    }
    var device = getUrlVars()["device"];
    if (!device) {
        device = "gameking";
    }
    if (screen.width < 600) {
        sessionStorage.setItem('fallback_page', 'gameking_list.html');
    } else {
        runMAME(cart, game, device);
    }
});