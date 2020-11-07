const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js"); //user defined node module
const {
    static
} = require('express');
const mongoose = require('mongoose');

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

        const Item = new mongoose.model("Item", itemsSchema);
        

        app.get("/", async (re, res) => {

            const itemList = await Item.find();         //adding items from database to items

            const day = date.getDay(); //user defined node module
            res.render('list', {
                kindOfDay: day,
                newItems: itemList //first parameter is the name of the ejs file, second parameter is a javascript object.
            });
        });

        

        app.post("/", async (req, res) => {
            const item = new Item({
                name : req.body.item
            });
            await item.save();              //saving new Item to database
            res.redirect("/");
        });

        app.post("/delete", async(req,res) => {
            //console.log(req.body.checkbox);
            await Item.deleteOne ({_id : req.body.checkbox});
            res.redirect("/");
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