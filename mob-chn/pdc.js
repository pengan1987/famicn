
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function runMAME(cart) {

    var wasmjs_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamepdc.js";
    var wasm_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamepdc.wasm"

    var emulator = new Emulator(document.querySelector(".emucanvas"),
        postRun,
        new JSMESSLoader(JSMESSLoader.driver("pdc100"),
            JSMESSLoader.nativeResolution(640, 480),
            JSMESSLoader.emulatorJS(wasmjs_filename),
            JSMESSLoader.emulatorWASM(wasm_filename),
            JSMESSLoader.mountFile("pdc100.zip",
                JSMESSLoader.fetchFile("System Image", cart))
        ));
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
    var gameBaseUrl = "https://famicn-1255835060.file.myqcloud.com/pdc-roms/"
    var game = getUrlVars()["game"];
    var cart = gameBaseUrl + game + ".zip"
    if (screen.width < 600) {
        sessionStorage.setItem('fallback_page', 'index.html');
    } else {
        runMAME(cart, game);
    }
});