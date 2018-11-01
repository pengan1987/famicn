
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function runMAME(cart, device) {
    var emulator = new Emulator(document.querySelector("#emularity-canvas"),
        postRun,
        new JSMESSLoader(JSMESSLoader.driver(device),
            JSMESSLoader.nativeResolution(640, 480),
            JSMESSLoader.emulatorJS("http://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamenes_wasm.js"),
            JSMESSLoader.emulatorWASM("http://dnbwg.cdn.bcebos.com/emularity-common/emulators/jsmess/mamenes_wasm.wasm"),
            JSMESSLoader.mountFile("game.nes",
                JSMESSLoader.fetchFile("Game File",
                    cart)),
            JSMESSLoader.peripheral("cart", "game.nes")))
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

$(document).ready(function () {
    console.log("ready!");
    var gameBaseUrl = "http://dnbwg3.cdn.bcebos.com/NES-China/"
    var game = getUrlVars()["game"];
    var cart = gameBaseUrl + game + ".nes"
    var device = getUrlVars()["device"];
    if (!device) {
        device = "nespal"
    }
    runMAME(cart, device);
});