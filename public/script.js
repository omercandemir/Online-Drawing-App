var socket = io();
var canvas = document.getElementById('whiteboard');
var context = canvas.getContext("2d");

// config
var drawing = false;
var current = {
    color: "black"
}

function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
        var time = new Date().getTime();
        if (time - previousCall >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    }
}

function drawLine(x0, y0, x1, y1, color, emit) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.stroke();
    context.closePath();

    if (!emit) {
        return;
    }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit("drawing", {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color
    });
}

function onMouseDown(e) {
    drawing = true;
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
}

function onMouseUp(e) {
    if (!drawing) {
        return;
    }
    drawing = false;
}

function onMouseMove(e) {
    if (!drawing) {
        return;
    }
    drawLine(
        currentX,
        currentY,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true
    );
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
}