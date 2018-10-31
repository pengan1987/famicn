
function processJson(data) {
    var machineList = data;
    machineList = splitArrayByTime(machineList);
    var base = $("#base-cell");
    var machineListContainer = $("#machine-list");
    for (i = 0; i < machineList.length; i++) {
        var machine = machineList[i];
        var clone = base.clone();
        var title = machine.name + " - " + machine.vendor;
        var playerlink = "famiclone.html?game=" + encodeURI(machine.filename);
        clone.show();
        clone.attr("id", machine.id);
        clone.find("a").attr("href", playerlink);
        clone.find("figcaption").text(title)
        if (!machine.image) {
            machine.image = "cart.gif"
        }
        clone.find(".figure-img").attr("src", machine.image)
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
    var second = someArray.slice(position + 1);
    return second.concat(first);
}

$(document).ready(function () {
    $.getJSON("games.json", processJson);
});
