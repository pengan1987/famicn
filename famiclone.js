
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function runMAME(cart) {
    var emulator = new Emulator(document.querySelector("#emularity-canvas"),
        postRun,
        new JSMESSLoader(JSMESSLoader.driver("iq501"),
            JSMESSLoader.nativeResolution(640, 480),
            JSMESSLoader.emulatorJS("mamenes.js"),
            JSMESSLoader.emulatorWASM("mamenes.wasm"),
            JSMESSLoader.mountFile(cart,
                JSMESSLoader.fetchFile("Game File",
                    cart)),

            JSMESSLoader.peripheral("cart", cart)))
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

    var cart = getUrlVars()["cart"];


    runMAME(cart);
});