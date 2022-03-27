var machineList;
var newMachineList = [];
var pages = [];
var loadedPage = 0;
var device = "gameking";

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function processJson(data) {
    machineList = [];
    for (i = 0; i < data.length; i++) {
        currentData = data[i];
        var addToList = true;
        if (device == "gamekin3") {
            //Remove Gameking default games for gameking3
            if (currentData.filename.length == 0 && !currentData.gameking3)
                addToList = false;
        } else {
            //Remove Gameking3 only games for Gameking
            if (currentData.gameking3) addToList = false;
        }
        if (addToList)
            machineList.push(currentData);
    }
    reorderedList = splitArrayByTime(machineList);

    var i, j, temparray, chunk = 32;
    for (i = 0, j = reorderedList.length; i < j; i += chunk) {
        temparray = reorderedList.slice(i, i + chunk);
        pages.push(temparray);
    }
    showMachines(pages[loadedPage]);
}

function loadmore() {
    showMachines(pages[loadedPage]);
}

function showMachines(machines) {
    var base = $("#base-cell");
    var machineListContainer = $("#machine-list");
    for (i = 0; i < machines.length; i++) {
        var machine = machines[i];
        var clone = base.clone();
        var title = machine.name + " - " + machine.vendor;

        if (machine.id) {
            var playerlink = "gameking.html?game=" + encodeURI(machine.id) + "&device=" + device;
        } else {
            var playerlink = "gameking.html?device=" + device;
        }

        var imagePathNew = "https://famicn-1255835060.file.myqcloud.com/gameking-images";
        if (device == 'gamekin3') {
            imagePathNew = "https://famicn-1255835060.file.myqcloud.com/gameking-images/gamekin3";
        }

        var imageLink = "gamate_card_blank.jpg";

        if (machine.image) {
            imageLink = machine.image;
            imageLink = imageLink.replace("{{image-path-new}}", imagePathNew);
        }
        if (machine.device) {
            playerlink = playerlink + "&device=" + machine.device;
        }

        if (machine.gameking3) {
            playerlink = playerlink + "&gamekin3only=1"
        }

        clone.show();
        clone.attr("id", machine.id);
        clone.find("a").attr("href", playerlink);
        clone.find("figcaption").text(title);
        clone.find(".figure-img").attr("src", imageLink);
        clone.addClass("show-data");
        machineListContainer.append(clone);
    }
    loadedPage++;
    if (loadedPage >= pages.length) {
        $("#loadmore").hide();
    }
}

function search() {

    var keyword = $("#search-text").val();
    if (!keyword || keyword.length == 0) {
        $(".show-data").remove();
        loadedPage = 0;
        processJson(machineList);
        return;
    }
    var searchResult = [];
    for (i = 0; i < machineList.length; i++) {
        var text = machineList[i].name + machineList[i].vendor;
        text = text.toLowerCase();
        keyword = keyword.toLowerCase();
        if (text.includes(keyword)) {
            searchResult.push(machineList[i]);
        }
    }
    pages = [];
    loadedPage = 0;
    $(".show-data").remove();
    showMachines(searchResult);
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

    if (menu && menu.includes("gamekin3")) {
        device = "gamekin3";
    }
    $.getJSON("gameking.json", processJson);
});

$(window).scroll(function () {
    if ($(document).height() - $(window).height() - $(window).scrollTop() < 50 && loadedPage < pages.length) {
        showMachines(pages[loadedPage]);
    }
});
