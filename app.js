
const express = require("express");
const bodyParser = require("body-parser");
const { compile } = require("ejs");

const app = express();
const datejs = require(__dirname+"/date.js");

let itemToAdd = "";
let items = [];
let workItems = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
console.log("PATH "+__dirname);
app.use(express.static("public"));

app.get("/", function(req, res) {
    let day = datejs.getDay();
    res.render("list", { listTitle: day, newListItem: items });
});

app.post("/", function(req, res) {
    let item = req.body.todoItem;
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});


app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItem: workItems});
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("Server is running at 3000");
});