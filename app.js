const ejs = require("ejs");
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _= require("lodash");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://admin-Rohit:Rohit@0406@cluster0.tufyfzv.mongodb.net/todolistdb", {useNewUriParser :true} ,{useUrifieldTopology:true});

const itemschema = new mongoose.Schema({
  name: String,
});

const item = mongoose.model("item", itemschema);

const sleep = new item({
  name: "sleep 8 hours",
});

const eat = new item({
  name: "eat good food",
});

const exercise = new item({
  name: "exercise",
});

const defaultitems = [sleep, eat, exercise];

const listshcema = new mongoose.Schema({
  name: String,
  listitmes: [itemschema],
});

const list = mongoose.model("list", listshcema);

const app = express();

app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

//home page get funtion
app.get("/", function (req, res) {
  item.find(function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        run();
        async function run() {
          await sleep.save();
          console.log("saved sleep");
          await eat.save();
          console.log("saved eat");
          await exercise.save();
          console.log("saved exercise");
        }
      } else {
        res.render("list", { kindofday: "Today", newitems: result });
      }
    }
  });
});

//custom page get funtion
app.get("/:customname", function (req, res) {
  const customlist = _.capitalize(req.params.customname);

  list.findOne({ name: customlist }, function (err, foundlist) {
    if (err) {
      console.log("does not exist");
    } else {
      if (!foundlist) {
        const List = new list({
          name: customlist,
          listitmes: defaultitems,
        });
        addlist();
        async function addlist() {
          await List.save();
        }
        res.redirect("/"+customlist);
      } else {
        res.render("list", {
          kindofday: foundlist.name,
          newitems: foundlist.listitmes,
        });
      }
    }
  });
});

//home page post function
app.post("/", function (req, res) {

  const listname=req.body.submit;
  const title=req.body.entry;

  let text = new item({
    name:title
  });

  if(listname==="Today"){

  additem();

  async function additem() {
    await text.save();
    console.log("item saved");
  }
  
  res.redirect("/");
 
  }
  else{
    list.findOne({name:listname},function(err,foundlist){
      if(err){
        console.log(err);
      }
      else{

        if(!foundlist){
          console.log("list not found");
        }
        else{
          foundlist.listitmes.push(text);
        
          addinlist();
        async function addinlist(){
          await foundlist.save();
          console.log("added");
        }
        }

        res.redirect("/"+foundlist.name);
      
      }
    })
  }
 
});

//work page post funtion
app.post("/work", function (req, res) {
  let workitem = req.body.entry;
  work.push(workitem);
  res.redirect("/work");
});

//about page
app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("server running on port 3000");
});

//post of /delete
app.post("/delete", function (req, res) {
  const todelete = req.body.checkBox;
  const listname=req.body.listname;

  if(listname==="Today"){
    item.deleteOne({ _id: todelete }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("item deleted");
      }
    });
  
    res.redirect("/");
  }
  else{
   list.findOne({name:listname},function(err,foundlist){
      if(!err){
        foundlist.listitmes.pull({_id : todelete });
       
       savelist(); 
        async function savelist(){
          await foundlist.save();
        }
        res.redirect("/"+listname);
      }
   });
  }
  
  
});
