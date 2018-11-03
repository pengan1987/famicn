var machineList;
var newMachineList = [];

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function processJson(data) {
    machineList = data;
    machineList = splitArrayByTime(machineList);
    var base = $("#base-cell");
    var machineListContainer = $("#machine-list");
    for (i = 0; i < machineList.length; i++) {
        var machine = machineList[i];
        var clone = base.clone();
        var title = machine.name + " - " + machine.vendor;
        var playerlink = "famiclone.html?game=" + encodeURI(machine.filename);

        var imageServer = "http://famicn-1255835060.file.myqcloud.com/game-images";
        var imageLink = "cart.gif";
        if (machine.image) {
            imageLink = machine.image.replace("{{image-path}}", imageServer);
        }
        if (machine.device) {
            playerlink = playerlink + "&device=" + machine.device;
        }

        clone.show();
        clone.attr("id", machine.id);
        clone.find("a").attr("href", playerlink);
        clone.find("figcaption").text(title)
        clone.find(".figure-img").attr("src", imageLink)
        machineListContainer.append(clone);
    }

}

function splitArrayByTime(someArray) {
    var date = new Date();
    var timestamp = date.getTime();
    var timetoken = Math.round(timestamp / (600 * 1000));
    var position = timetoken % someArray.length;
    console.log(position);
    var first = someArray.slice(0, position);
    var second = someArray.slice(position);
    return second.concat(first);
}

$(document).ready(function () {
    var menu = getUrlVars()["menu"];
    if (!menu) {
        menu = "games.json"
    }
    $.getJSON(menu, processJson);
});

function testImage() {
    for (var i = 0; i < machineList.length; i++) {
        var machine = machineList[i];
        $.ajax({
            url: 'images/' + machine.filename + ".gif",
            type: 'HEAD',
            async: false,

            error: function () {
                //do something depressing
                newMachineList.push(machine);
            },
            success: function () {
                machine.image = 'images/' + machine.filename + ".gif";
                newMachineList.push(machine);
            }
        });
    }
}