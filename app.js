const ejs = require("ejs");
const express = require("express");
const bodyparser = require("body-parser");

const app = express();

let texts=[];
let work=[];

app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));


//home page get funtion
app.get("/", function (req, res) {
  let today = new Date();

let options={
    weekday:"long",
    day:"numeric",
    month:"long"
};

let day=today.toLocaleDateString("en-US",options);

  res.render("list", { kindofday: day ,newitems : texts});
});


//work page get funtion
app.get("/work",function(req,res){
  
  res.render("list",{kindofday:"work",newitems:work});
});


//home page post function
app.post("/",function(req,res){
    let  text=req.body.entry;

    if(req.body.submit==="work"){
      work.push(text);
      res.redirect("/work");
    }
    else{
      texts.push(text);
      res.redirect("/");
    }

})


//work page post funtion
app.post("/work",function(req,res){
  let workitem = req.body.entry;
  work.push(workitem);
  res.redirect("/work");
});


//about page
app.get("/about",function(req,res){
  res.render("about");
})



app.listen(3000, function () {
  console.log("server running on port 3000");
});
