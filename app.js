//jshint esversion:6

//Importing Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var prompt= require("prompt");

//Calling Dependencies
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
prompt.start();
mongoose.set('useFindAndModify', false);

//SettingUp Database
mongoose.connect(
  "mongodb://localhost:27017/todo",
  { useNewUrlParser: true },
  { useUnifiedTopology: true },
  (err) => {
    if (!err) {
      console.log("Database SetUp!!");
    } else {
      console.log("DataBase error" + err);
    }
  }
);
var todoSchema = new mongoose.Schema({
  name: String,
});
var Todo = mongoose.model("Todo", todoSchema);

//SettingUp Views
app.set("view engine", "ejs");
app.use("/public", express.static("public"));

//GET Request
app.get("/", function (req, res) {
  Todo.find({}, function (err, todolist) {
    if (err) {
      console.log(err);
    } else {
      res.render("list", { todolist: todolist });
    }
  });
});

//ADD Request
app.post("/add", function (req, res) {
  if(req.body.itemname!=""){
  var newItem = new Todo({
    name: req.body.itemname,
  });
  newItem.save();}
  res.redirect("/");
});

//Delete All Request
app.post("/deleteall", function (req, res) {
  Todo.collection.deleteMany();
  console.log(Todo);
  res.redirect("/");
});

//Delete Request
app.post("/delete/:id", function (req, res) {
  Todo.deleteOne({ _id: req.params.id }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted");
    }
  });
  res.redirect("/");
});

//Edit Request
app.post("/edit/:id", function (req, res) {
      Todo.findByIdAndUpdate(
        { _id: req.params.id },
        { name: req.body.editval },
        function(err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        }
      );
  res.redirect("/");
  });

//Port Working
app.listen(3000, function () {
  console.log("This port is working!");
});
