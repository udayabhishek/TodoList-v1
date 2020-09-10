
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { compile } = require("ejs");
const _ = require("lodash")

const app = express();

let itemToAdd = "";
let items = [];
let workItems = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
console.log("PATH "+__dirname);
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-uday:test123@cluster0.19gzd.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = {
    name: String
}

const Item = new mongoose.model("Item", itemsSchema);

const work = new Item({
    name: "Work list for today"
});

const shopping = new Item({
    name: "Shopping list to buy"
});

const cooking = new Item({
    name: "Cooking list"
});

const dafaultItems = [work, shopping, cooking];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
    Item.find({}, function (err, foundItems) {
        if (err) {
            console.log(err);
        } else {
            if (foundItems.length === 0) {
                Item.insertMany(dafaultItems, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully saved to DB");
                    }
                });
                res.redirect('/');
            } else {
                res.render("list", { listTitle: "Today", newListItem: foundItems });
            }
        }
    });
});

//dynamic end points
app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
    //create model/ table

    //Find in Model if already exists
    List.findOne({ name: customListName}, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: dafaultItems
                });
                //to save into db
                list.save();
                res.redirect("/"+customListName);
            } else {
                res.render("list", { listTitle: customListName, newListItem: foundList.items });
            }
        } 
    });
});

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    
    const newItem = new Item({
        name: itemName
    });

    if (listName === "Today") {
        newItem.save();
        res.redirect('/')
    } else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete", function(req, res) {
    const itemID = req.body.checkbox; // _id will come here
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(itemID, function (err) {
            if (!err) {
                console.log("Removed Item");
                res.redirect("/")
            } 
        })
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: itemID }}}, function(err, foundList) {
            if (!err) {
                res.redirect("/"+listName);
            }
        });
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