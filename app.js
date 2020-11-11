const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js"); //user defined node module
const {
    static
} = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs'); //sets the view engine to be ejs
app.use(express.static("public"));

async function run() {

    try {
        mongoose.connect('mongodb://localhost:27017/todolistDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });



        const itemsSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true
            }
        });

        const customListSchema = new mongoose.Schema({
            name: String,
            items: [itemsSchema]
        });

        const Item = new mongoose.model("Item", itemsSchema);

        const List = new mongoose.model("List", customListSchema);


        app.get("/", async (re, res) => {
            const items = await Item.find();
            const day = date.getDay(); //user defined node module
            res.render('list',{
                kindOfDay : day,
                newItems : items,
                route : ""
            });//fSirst parameter is the name of the ejs file, second parameter is a javascript object.
        
        });



        app.post("/", async (req, res) => {
            const item = new Item({
                name: req.body.item
            });
            await item.save(); //saving new Item to database
            res.redirect("/");
        });

        app.post("/delete", async (req, res) => {
            //console.log(req.body.checkbox);

            await Item.deleteOne({
                _id: req.body.checkbox
            });
            res.redirect("/");
        });


        app.get("/:customList", async (req, res) => {
            const customListName = _.lowerCase(req.params.customList);

            const listName = await List.findOne({
                name: customListName
            });

            if (listName === null) {

                const list = new List({
                    name: customListName,
                    items: []
                });

                list.save();
            } else{
                const itemList = await List.findOne({name : customListName}).select({"items" : 1, "_id" : 0});
                
                //console.log(itemList.items);
                const day = date.getDay();
                res.render('list', {
                    kindOfDay: day,
                    newItems: itemList.items,
                    route :  customListName
                });
            }


        });

        app.post("/:customList", async (req,res) => {
            const customListName = _.lowerCase(req.params.customList);
            await List.updateOne({ name : customListName}, {$addToSet : {items : {name : req.body.item}}});
            res.redirect("/"+customListName);
        });


        app.get("/about", (req, res) => {
            res.render("about");
        });


    } catch (err) {
        console.log(`Failed!!! ${err}`);
        await mongoose.connection.close();
    } finally {
        app.listen("3000", () => console.log("Listening at port 3000"));

    }

}

run();