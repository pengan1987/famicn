var machineList;
var newMachineList = [];
var pages = [];
var loadedPage = 0;
var platform = "svision.html";

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function processJson(data) {
    machineList = data;
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
        var title = machine.name + " (" + machine.year + ")";
        if (machine.chinese_name) {
            var title = machine.chinese_name + " (" + machine.year + ")";
        }
        if (machine.vendor.length > 0) {
            title = title + " - " + machine.vendor;
        }
        var playerlink = platform + "?game=" + encodeURI(machine.id);

        var imagePathNew = "https://famicn-1255835060.file.myqcloud.com/svision-images";
        var imageLink = "cart.gif";
        if (machine.image) {
            imageLink = machine.image;
            imageLink = imageLink.replace("{{image-path-new}}", imagePathNew);
        }

        if (machine.device) {
            playerlink = playerlink + "&device=" + machine.device;
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
    $.getJSON("svision.json", processJson);
});

$(window).scroll(function () {
    if ($(document).height() - $(window).height() - $(window).scrollTop() < 50 && loadedPage < pages.length) {
        showMachines(pages[loadedPage]);
    }
});
