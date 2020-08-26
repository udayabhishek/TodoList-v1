
const express = require("express");
const bodyParser = require("body-parser");

const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function(req, res) {
    var date = new Date();
    // var currentDay = date.getDay();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = date.toLocaleDateString("en-US", options)
    // Sunday - Saturday : 0 - 6
    // if (today.getDay() === 6 || today.getDay() === 0) {
    //     day = "weekend " + today.getDay();
    // } else {
    //     day = "weekday " + today.getDay();
    // }

    // switch (currentDay) {
    //     case 0:
    //         day = "Sunday"
    //         break;
    //     case 1:
    //         day = "Monday"
    //         break;
    //     case 2:
    //         day = "Tuesday"
    //         break;
    //     case 3:
    //         day = "Wednesday"
    //         break;
    //     case 4:
    //         day = "Thurusday"
    //         break;
    //     case 5:
    //         day = "Friday"
    //         break;
    //     case 6:
    //         day = "Saturday"
    //         break;
    //     default:
    //         console.log("Error: current day" + currentDay);
    // }
    res.render("list", { kindOfDay: day });

});

app.post("/", function(req, res) {
    const itemToAdd = req.body.todoItem;
    res.render("list", { newListItem: itemToAdd });
});

app.listen(3000, function() {
    console.log("Server is running at 3000");
});