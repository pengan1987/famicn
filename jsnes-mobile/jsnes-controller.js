/*
 * Keyboard
 */
$(document).
    bind('keydown', function (evt) {
        keyboard(nes.buttonDown, evt);
        evt.preventDefault();
    }).
    bind('keyup', function (evt) {
        keyboard(nes.buttonUp, evt);
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
        nes.buttonDown(1, jsnes.Controller.BUTTON_LEFT);
        nes.buttonDown(1, jsnes.Controller.BUTTON_UP);
        nes.buttonUp(1, jsnes.Controller.BUTTON_RIGHT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_DOWN);
    } else if ($(realTarget).hasClass('up')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').addClass('active');
        $('#dpad .down').removeClass('active');
        $('#dpad .right').removeClass('active');
        nes.buttonUp(1, jsnes.Controller.BUTTON_LEFT);
        nes.buttonDown(1, jsnes.Controller.BUTTON_UP);
        nes.buttonUp(1, jsnes.Controller.BUTTON_RIGHT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_DOWN);
    } else if ($(realTarget).hasClass('rightup')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').addClass('active');
        $('#dpad .down').removeClass('active');
        $('#dpad .right').addClass('active');
        nes.buttonUp(1, jsnes.Controller.BUTTON_LEFT);
        nes.buttonDown(1, jsnes.Controller.BUTTON_UP);
        nes.buttonDown(1, jsnes.Controller.BUTTON_RIGHT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_DOWN);
    } else if ($(realTarget).hasClass('left')) {
        $('#dpad .left').addClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').removeClass('active');
        $('#dpad .right').removeClass('active');
        nes.buttonDown(1, jsnes.Controller.BUTTON_LEFT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_UP);
        nes.buttonUp(1, jsnes.Controller.BUTTON_RIGHT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_DOWN);
    } else if ($(realTarget).hasClass('center')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').removeClass('active');
        $('#dpad .right').removeClass('active');
        nes.buttonUp(1, jsnes.Controller.BUTTON_LEFT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_UP);
        nes.buttonUp(1, jsnes.Controller.BUTTON_RIGHT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_DOWN);
    } else if ($(realTarget).hasClass('right')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').removeClass('active');
        $('#dpad .right').addClass('active');
        nes.buttonUp(1, jsnes.Controller.BUTTON_LEFT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_UP);
        nes.buttonDown(1, jsnes.Controller.BUTTON_RIGHT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_DOWN);
    } else if ($(realTarget).hasClass('leftdown')) {
        $('#dpad .left').addClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').addClass('active');
        $('#dpad .right').removeClass('active');
        nes.buttonDown(1, jsnes.Controller.BUTTON_LEFT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_UP);
        nes.buttonUp(1, jsnes.Controller.BUTTON_RIGHT);
        nes.buttonDown(1, jsnes.Controller.BUTTON_DOWN);
    } else if ($(realTarget).hasClass('down')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').addClass('active');
        $('#dpad .right').removeClass('active');
        nes.buttonUp(1, jsnes.Controller.BUTTON_LEFT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_UP);
        nes.buttonUp(1, jsnes.Controller.BUTTON_RIGHT);
        nes.buttonDown(1, jsnes.Controller.BUTTON_DOWN);
    } else if ($(realTarget).hasClass('rightdown')) {
        $('#dpad .left').removeClass('active');
        $('#dpad .up').removeClass('active');
        $('#dpad .down').addClass('active');
        $('#dpad .right').addClass('active');
        nes.buttonUp(1, jsnes.Controller.BUTTON_LEFT);
        nes.buttonUp(1, jsnes.Controller.BUTTON_UP);
        nes.buttonDown(1, jsnes.Controller.BUTTON_RIGHT);
        nes.buttonDown(1, jsnes.Controller.BUTTON_DOWN);
    }

}
$('#dpad').bind('touchend', function (e) {
    $('#dpad .left').removeClass('active');
    $('#dpad .up').removeClass('active');
    $('#dpad .down').removeClass('active');
    $('#dpad .right').removeClass('active');
    nes.buttonUp(1, jsnes.Controller.BUTTON_LEFT);
    nes.buttonUp(1, jsnes.Controller.BUTTON_UP);
    nes.buttonUp(1, jsnes.Controller.BUTTON_RIGHT);
    nes.buttonUp(1, jsnes.Controller.BUTTON_DOWN);
});


$('#joystick_btn_select').bind('touchstart', function (e) {
    nes.buttonDown(1, jsnes.Controller.BUTTON_SELECT);
    $('#joystick_btn_select').addClass('active');
    e.preventDefault();
});
$('#joystick_btn_select').bind('touchend', function (e) {
    nes.buttonUp(1, jsnes.Controller.BUTTON_SELECT);
    $('#joystick_btn_select').removeClass('active');
    e.preventDefault();
});
$('#joystick_btn_start').bind('touchstart', function (e) {
    nes.buttonDown(1, jsnes.Controller.BUTTON_START);
    $('#joystick_btn_start').addClass('active');
    e.preventDefault();
});
$('#joystick_btn_start').bind('touchend', function (e) {
    nes.buttonUp(1, jsnes.Controller.BUTTON_START);
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
    nes.buttonUp(1, jsnes.Controller.BUTTON_A);
    nes.buttonUp(1, jsnes.Controller.BUTTON_B);
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
    nes.buttonUp(1, jsnes.Controller.BUTTON_A);
    nes.buttonUp(1, jsnes.Controller.BUTTON_B);
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
            nes.buttonDown(1, jsnes.Controller.BUTTON_A);
            nes.buttonUp(1, jsnes.Controller.BUTTON_B);
            self.interval = setInterval(function () {
                intervalButton(jsnes.Controller.BUTTON_A);
            }, 50);
        } else {
            nes.buttonDown(1, jsnes.Controller.BUTTON_A);
            nes.buttonUp(1, jsnes.Controller.BUTTON_B);
        }
    } else if ($(realTarget).hasClass('b')) {
        $('.a', parent).removeClass('active');
        $('.b', parent).addClass('active');
        clearInterval(self.interval);
        if (turbo) {
            nes.buttonUp(1, jsnes.Controller.BUTTON_A);
            nes.buttonDown(1, jsnes.Controller.BUTTON_B);
            self.interval = setInterval(function () {
                intervalButton(jsnes.Controller.BUTTON_B);
            }, 50);
        } else {
            nes.buttonUp(1, jsnes.Controller.BUTTON_A);
            nes.buttonDown(1, jsnes.Controller.BUTTON_B);
        }
    } else if ($(realTarget).hasClass('c')) {
        $('.a', parent).addClass('active');
        $('.b', parent).addClass('active');
        clearInterval(self.interval);
        if (turbo) {
            nes.buttonDown(1, jsnes.Controller.BUTTON_A);
            nes.buttonDown(1, jsnes.Controller.BUTTON_B);
            self.interval = setInterval(function () {
                intervalButton(jsnes.Controller.BUTTON_A);
                intervalButton(jsnes.Controller.BUTTON_B);
            }, 50);
        } else {
            nes.buttonDown(1, jsnes.Controller.BUTTON_A);
            nes.buttonDown(1, jsnes.Controller.BUTTON_B);
        }
    } else {
        clearInterval(self.interval);
        $('.a', parent).removeClass('active');
        $('.b', parent).removeClass('active');
        nes.buttonUp(1, jsnes.Controller.BUTTON_A);
        nes.buttonUp(1, jsnes.Controller.BUTTON_A);
    }
}
AutoFireAPressed = true;
AutoFireBPressed = true;
function intervalButton(button) {
    if (button == jsnes.Controller.BUTTON_A) {
        if (AutoFireAPressed) {
            nes.buttonUp(1, jsnes.Controller.BUTTON_A);
        } else {
            nes.buttonDown(1, jsnes.Controller.BUTTON_A);
        }
        AutoFireAPressed = !AutoFireAPressed;
    } else {
        if (AutoFireBPressed) {
            nes.buttonUp(1, jsnes.Controller.BUTTON_B);
        } else {
            nes.buttonDown(1, jsnes.Controller.BUTTON_B);
        }
        AutoFireBPressed = !AutoFireBPressed
    }
}