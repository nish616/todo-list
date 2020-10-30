const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js"); //user defined node module
const { static } = require('express');

const app = express();

const items= [];

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs'); //sets the view engine to be ejs
app.use(express.static("public"));

app.get("/", (re, res) => {

    let day = date.getDay();   //user defined node module
    res.render('list', {
        kindOfDay: day, newItems: items //first parameter is the name of the ejs file, second parameter is a javascript object.
    });
});

app.post("/", (req,res) => {
    items.push(req.body.item);
    res.redirect("/");
});

app.get("/about", (req,res) =>{
    res.render("about");
});


app.listen("3000", () => console.log("Listening at port 3000"));