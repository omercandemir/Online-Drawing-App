const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
    res.json("Server was successfully started.");
});

app.listen(port, () => {
    console.log("Server started in port: " + port);
});