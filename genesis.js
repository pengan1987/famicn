
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function runMAME(cart, device) {
    var wantsWASM = 'WebAssembly' in window;
    var wasmjs_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamemegadriv_wasm.js";
    var wasm_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamemegadriv_wasm.wasm"
    var js_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamemegadriv.js"

    var emulator = new Emulator(document.querySelector("#canvas"),
        postRun,
        new JSMESSLoader(JSMESSLoader.driver(device),
            JSMESSLoader.nativeResolution(640, 448),
            JSMESSLoader.emulatorJS(wantsWASM ? wasmjs_filename : js_filename),
            JSMESSLoader.emulatorWASM(wantsWASM && wasm_filename),
            JSMESSLoader.mountZip("rom",
                JSMESSLoader.fetchFile("Game File",
                    cart)),
            JSMESSLoader.extraArgs(["-cart", "/emulator/rom/rom.md"])));
    emulator.setScale(3).start({ waitAfterDownloading: true });
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
    var canvasWidth = $("#emularity-canvas").width();
    var canvasHeight = $("#emularity-canvas").height();
    if (bodyWidth < canvasWidth) {
        //Resize canvas for mobile device
        var newHeight = Math.round(canvasHeight * bodyWidth / canvasWidth);
        $("#emularity-canvas").width(bodyWidth);
        $("#emularity-canvas").height(newHeight);
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
    var gameBaseUrl = "https://dnbwg3.cdn.bcebos.com/roms-genesis-zip/"
    var game = getUrlVars()["game"];
    var cart = gameBaseUrl + game + ".zip"
    var device = getUrlVars()["device"];
    if (!device) {
        device = "genesis"
    }
    if (screen.width < 600) {
        sessionStorage.setItem('fallback_page', 'console_list.html?menu=genesis.json');
    } else {
        runMAME(cart, device);
    }
});