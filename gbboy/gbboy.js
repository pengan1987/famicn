var DEBUG_MESSAGES = false;
var DEBUG_WINDOWING = false;

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function playGame() {
    var fs = BrowserFS.BFSRequire('fs');
    var filename = "zip/" + getUrlVars()["game"] + ".gbc"
    var isGBC = fs.existsSync(filename)
    if (!isGBC) {
        filename = "zip/" + getUrlVars()["game"] + ".gb"
    }
    var diskBuffer = fs.readFileSync(filename, { encoding: 'binary' });
    var canvas = document.getElementById('display_canvas');
    settings[0] = true;
    start(canvas, diskBuffer);



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

$(document).ready(function () {
    console.log("ready!");
    var gameBaseUrl = "https://famicn-1255835060.file.myqcloud.com/gbboy-roms/"
    var game = getUrlVars()["game"];
    var cart = gameBaseUrl + game + ".zip"
    loadFS(cart);
    document.getElementById("status-display").addEventListener('click', function () {
        $("#status-display").hide();
        $("#display_canvas").show();

        playGame();
    })
});