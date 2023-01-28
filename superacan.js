var game = "";
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function runMAME(cart, device) {
    var wasmjs_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamesupracan.js";
    var wasm_filename = "https://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamesupracan.wasm"
    var emulator = new Emulator(document.querySelector("#canvas"),
        postRun,
        new JSMESSLoader(JSMESSLoader.driver(device),
            JSMESSLoader.nativeResolution(640, 480),
            JSMESSLoader.emulatorJS(wasmjs_filename),
            JSMESSLoader.emulatorWASM(wasm_filename),
            JSMESSLoader.mountZip("rom",
                JSMESSLoader.fetchFile("Game File",
                    cart)),
            JSMESSLoader.extraArgs(["-cart", "/emulator/rom/" + game + ".bin"])));
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
    var gameBaseUrl = "https://famicn-1255835060.file.myqcloud.com/superacan-roms/"
    game = getUrlVars()["game"];
    var cart = gameBaseUrl + game + ".zip"
    var device = getUrlVars()["device"];
    if (!device) {
        device = "genesis"
    }
    if (screen.width < 600) {
        sessionStorage.setItem('fallback_page', 'console_list.html?menu=superacan.json');
    } else {
        runMAME(cart, device);
    }
});