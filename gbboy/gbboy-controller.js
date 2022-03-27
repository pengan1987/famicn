/*
 * Keyboard
 */

var keyZones = {
    13: "start",
    16: "select",
    88: "a",
    90: "b",
    37: "left",
    38: "up",
    39: "right",
    40: "down"
}

$(document).
    bind('keydown', function (evt) {
        GameBoyKeyDown(keyZones[evt.keyCode]);
        evt.preventDefault();
    }).
    bind('keyup', function (evt) {
        GameBoyKeyUp(keyZones[evt.keyCode]);
        evt.preventDefault();
    });

$('#dpad').bind('touchstart', function (e) {
    handleDirection(e);
    e.preventDefault();
})
$('#dpad').bind('gesturestart', function (e) {
    handleDirection(e);
    e.preventDefault();
})
$('#dpad').bind('touchmove', function (e) {
    handleDirection(e);
})
function handleDirection(e) {
    var myLocation = e.originalEvent.changedTouches[0];
    var realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
    if ($(realTarget).hasClass('leftup')) {
        $('#dpad .left').addClass('active');
        $('#dpad .up').addClass('active');
        $('#dpad .down').removeClass('active');
        $('#dpad .right').removeClass('active');
        GameBoyKeyDown("left");
        GameBoyKeyDown("up");
        GameBoyKeyUp("right");
        GameBoyKeyUp("down");
    } else if ($(realTarget).hasClass('up')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').addClass('active');
        $('#dpad .down').removeClass('active');
        $('#dpad .right').removeClass('active');
        GameBoyKeyUp("left");
        GameBoyKeyDown("up");
        GameBoyKeyUp("right");
        GameBoyKeyUp("down");
    } else if ($(realTarget).hasClass('rightup')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').addClass('active');
        $('#dpad .down').removeClass('active');
        $('#dpad .right').addClass('active');
        GameBoyKeyUp("left");
        GameBoyKeyDown("up");
        GameBoyKeyDown("right");
        GameBoyKeyUp("down");
    } else if ($(realTarget).hasClass('left')) {
        $('#dpad .left').addClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').removeClass('active');
        $('#dpad .right').removeClass('active');
        GameBoyKeyDown("left");
        GameBoyKeyUp("up");
        GameBoyKeyUp("right");
        GameBoyKeyUp("down");
    } else if ($(realTarget).hasClass('center')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').removeClass('active');
        $('#dpad .right').removeClass('active');
        GameBoyKeyUp("left");
        GameBoyKeyUp("up");
        GameBoyKeyUp("right");
        GameBoyKeyUp("down");
    } else if ($(realTarget).hasClass('right')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').removeClass('active');
        $('#dpad .right').addClass('active');
        GameBoyKeyUp("left");
        GameBoyKeyUp("up");
        GameBoyKeyDown("right");
        GameBoyKeyUp("down");
    } else if ($(realTarget).hasClass('leftdown')) {
        $('#dpad .left').addClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').addClass('active');
        $('#dpad .right').removeClass('active');
        GameBoyKeyDown("left");
        GameBoyKeyUp("up");
        GameBoyKeyUp("right");
        GameBoyKeyDown("down");
    } else if ($(realTarget).hasClass('down')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').addClass('active');
        $('#dpad .right').removeClass('active');
        GameBoyKeyUp("left");
        GameBoyKeyUp("up");
        GameBoyKeyUp("right");
        GameBoyKeyDown("down");
    } else if ($(realTarget).hasClass('rightdown')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').addClass('active');
        $('#dpad .right').addClass('active');
        GameBoyKeyUp("left");
        GameBoyKeyUp("up");
        GameBoyKeyDown("right");
        GameBoyKeyDown("down");
    }

}
$('#dpad').bind('touchend', function (e) {
    $('#dpad .left').removeClass('active');
    $('#dpad .up').removeClass('active');
    $('#dpad .down').removeClass('active');
    $('#dpad .right').removeClass('active');
    GameBoyKeyUp("left");
    GameBoyKeyUp("up");
    GameBoyKeyUp("right");
    GameBoyKeyUp("down");
});


$('#joystick_btn_select').bind('touchstart', function (e) {
    GameBoyKeyDown("select");
    $('#joystick_btn_select').addClass('active');
    e.preventDefault();
});
$('#joystick_btn_select').bind('touchend', function (e) {
    GameBoyKeyUp("select");
    $('#joystick_btn_select').removeClass('active');
    e.preventDefault();
});
$('#joystick_btn_start').bind('touchstart', function (e) {
    GameBoyKeyDown("start");
    $('#joystick_btn_start').addClass('active');
    e.preventDefault();
});
$('#joystick_btn_start').bind('touchend', function (e) {
    GameBoyKeyUp("start");
    $('#joystick_btn_start').removeClass('active');
    e.preventDefault();
});

$('#controls-fire').bind('touchstart', function (e) {
    handleFire(e);
    e.preventDefault();
});
$('#controls-fire').bind('gesturestart', function (e) {
    handleFire(e, true);
    e.preventDefault();
});
$('#controls-fire').bind('touchmove', function (e) {
    handleFire(e);
    e.preventDefault();
});
$('#controls-fire').bind('touchend', function (e) {
    clearInterval(self.interval);
    $('#controls-fire .a').removeClass('active');
    $('#controls-fire .b').removeClass('active');
    GameBoyKeyUp("a");
    GameBoyKeyUp("b");
    e.preventDefault();
});
$('#controls-turbofire').bind('touchstart', function (e) {
    handleFire(e, true);
    e.preventDefault();
});
$('#controls-turbofire').bind('gesturestart', function (e) {
    handleFire(e, true);
    e.preventDefault();
});
$('#controls-turbofire').bind('touchmove', function (e) {
    handleFire(e, true);
    e.preventDefault();
});
$('#controls-turbofire').bind('touchend', function (e) {
    clearInterval(self.interval);
    $('#controls-turbofire .a').removeClass('active');
    $('#controls-turbofire .b').removeClass('active');
    GameBoyKeyUp("a");
    GameBoyKeyUp("b");
    e.preventDefault();
});
function handleFire(e, turbo) {
    var parent = $('#controls-fire');
    if (turbo) {
        parent = $('#controls-turbofire');
    }
    var myLocation = e.originalEvent.changedTouches[0];
    var realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
    if ($(realTarget).hasClass('a')) {
        $('.a', parent).addClass('active');
        $('.b', parent).removeClass('active');
        clearInterval(self.interval);
        if (turbo) {
            GameBoyKeyDown("a");
            GameBoyKeyUp("b");
            self.interval = setInterval(function () {
                intervalButton("a");
            }, 50);
        } else {
            GameBoyKeyDown("a");
            GameBoyKeyUp("b");
        }
    } else if ($(realTarget).hasClass('b')) {
        $('.a', parent).removeClass('active');
        $('.b', parent).addClass('active');
        clearInterval(self.interval);
        if (turbo) {
            GameBoyKeyUp("a");
            GameBoyKeyDown("b");
            self.interval = setInterval(function () {
                intervalButton("b");
            }, 50);
        } else {
            GameBoyKeyUp("a");
            GameBoyKeyDown("b");
        }
    } else if ($(realTarget).hasClass('c')) {
        $('.a', parent).addClass('active');
        $('.b', parent).addClass('active');
        clearInterval(self.interval);
        if (turbo) {
            GameBoyKeyDown("a");
            GameBoyKeyDown("b");
            self.interval = setInterval(function () {
                intervalButton("a");
                intervalButton("b");
            }, 50);
        } else {
            GameBoyKeyDown("a");
            GameBoyKeyDown("b");
        }
    } else {
        clearInterval(self.interval);
        $('.a', parent).removeClass('active');
        $('.b', parent).removeClass('active');
        GameBoyKeyUp("a");
        GameBoyKeyUp("a");
    }
}
AutoFireAPressed = true;
AutoFireBPressed = true;
function intervalButton(button) {
    if (button == "a") {
        if (AutoFireAPressed) {
            GameBoyKeyUp("a");
        } else {
            GameBoyKeyDown("a");
        }
        AutoFireAPressed = !AutoFireAPressed;
    } else {
        if (AutoFireBPressed) {
            GameBoyKeyUp("b");
        } else {
            GameBoyKeyDown("b");
        }
        AutoFireBPressed = !AutoFireBPressed
    }
}