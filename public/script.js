var socket = io();
var canvas = document.getElementById('whiteboard');
var context = canvas.getContext("2d");

// config
var drawing = false;
var current = {
    color: "black"
}