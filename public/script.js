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

    socket.emit("drawing", { // kullanıcıza çizimimi gönderme
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color
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
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true
    );
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
}

// desktop
canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener("mouseup", onMouseUp, false);
canvas.addEventListener("mouseout", onMouseUp, false);
canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

canvas.addEventListener("touchstart", onMouseDown, false);
canvas.addEventListener("touchend", onMouseUp, false);
canvas.addEventListener("touchcancel", onMouseUp, false);
canvas.addEventListener("touchmove", throttle(onMouseMove, 10), false);

function onResize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", onResize, false);
onResize();

function onDrawingEvent(data) { // karşıdan gelen çizim
    var w = canvas.width;
    var h = canvas.height;

    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
};

socket.on("drawing", onDrawingEvent); // karşıdan gelen çizimi alma