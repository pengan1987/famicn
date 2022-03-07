
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function runMAME(cart, game) {

    var wasmjs_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamesvision_wasm.js";
    var wasm_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamesvision_wasm.wasm"

    var emulator = new Emulator(document.querySelector(".emucanvas"),
        postRun,
        new JSMESSLoader(JSMESSLoader.driver("svision"),
            JSMESSLoader.nativeResolution(480, 450),
            JSMESSLoader.emulatorJS(wasmjs_filename),
            JSMESSLoader.emulatorWASM(wasm_filename),
            JSMESSLoader.mountFile(game + ".zip",
                JSMESSLoader.fetchFile("Game File",
                    cart)),
            JSMAMELoader.peripheral("cart", game + ".zip")
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
    var gameBaseUrl = "https://famicn-1255835060.file.myqcloud.com/svision-roms/"
    var game = getUrlVars()["game"];
    var cart = gameBaseUrl + game + ".zip"
    if (screen.width < 600) {
        sessionStorage.setItem('fallback_page', 'svision_list.html');
    } else {
        runMAME(cart, game);
    }
});