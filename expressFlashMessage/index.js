//main file of an app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //FunctionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //AppObject
//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const FarmClassObject = require("./models/farm"); //FarmClassObject(ie Model) //self created module/file needs "./"
const methodOverride = require("method-override"); //functionObject //method-override module
const session = require("express-session"); //functionObject //express-session module
const flash = require("connect-flash"); //functionObject //connect-flash module

// ********************************************************************************
// CONNECT - nodeJS runtime app connects to default mogod server port + creates db
// ********************************************************************************
//mongooseObject.method(url/defaultPortNo/databaseToUse,optionsObject-notNeeded) //returns promiseObject pending
mongoose
  .connect("mongodb://localhost:27017/farmStanddb4", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //promisObject resolved
    console.log("Mongo Connection Open");
  })
  .catch((err) => {
    //promisObject rejected
    console.log("Mongo connection error has occured");
    console.log(err);
  });
//Dont need to nest code inside callback - Operation Buffering
//mongoose lets us use models immediately,without wainting
//for mongoose to eastablish a connection to MongoDB

// *************************************************************************************************************************************
//(Third party)middleware(hook) function expressions and (express built-in) middleware(hook)methods - Order matters for next() execution
// *************************************************************************************************************************************
//(Application-level middleware) - bind middlewareCallback to appObject with app.use() or app.method()
//app.use(middlewareCallback) - argument is middlewareCallback

const sessionOptionsObject = {
  secret: "thisismysecret",
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionOptionsObject)); //adds session property to reqObject
app.use(flash()); //adds flash() method to reqObjects
//flash message - (connect-flash module - show a temporary message - erased on page refresh
//flash-message middleware creates a flash() method on reqObject
//we use this method to create a message after an action(create,delete,login,logout) and before a redirect
//req.flash("categoryKey","messageValue") - message gets stored in flash area of session ie arrayObject
//subsequent requests can retrive the stored message from the flash area of session with req.flash("categoryKey") ie arrayObject
//if no message was stored in flash area of session req.flash("unusedCategoryKey") gives us empty arrayObject
//this makes the req.flash("categoryKey") ie message arrayObject available to be passed in as a variable in the next ejs template file render method
//clears messages stored in flash area of session req.flash("categoryKey") (ie arrayObject) after viewing

//alternative way to pass variable into every ejs template file - //properties of localObject
// app.use((req, res, next) => {
//   //retrive the stored messages in the flash area of session with req.flash("categoryKey") ie arrayObject
//   res.locals.messages = req.flash("success"); //localsObject.property, property = variable passed into every ejs template file
//   res.locals.errors = req.flash("errors") //localsObject.property, property = variable passed into every ejs template file
//   next(); //pass to next middlewareCallback
// });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

// *********************************************************************************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//*************
//FARMS ROUTES
//*************

//route 1
//httpMethod=GET,path/resource-/farms + can contain ?queryString  -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (products)collection from (farmStanddb3)d
//appObject.method(pathString,async middlewareCallback)
app.get("/farms", async (req, res) => {
  // *****************************************************
  //READ - querying a collection for a document/documents
  // *****************************************************
  //FarmClassObject.method(queryObject) ie modelClassObject.method() - same as - db.farms.find({})
  const foundFarms = await FarmClassObject.find({}); //products = dataObject ie array of all jsObjects(documents)
  res.render("farms/index", {
    farms: foundFarms,
    //retrive the stored messages in the flash area of session with req.flash("categoryKey") ie arrayObject + pass arrayObject of messages to messages variable
    messages: req.flash("success"),
  });
});

//route 2
//httpMethod=GET,path/resource-/farms/new  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (farms)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

//route 3
//httpMethod=POST,path/resource-/farms  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (farms)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.post("/farms", async (req, res) => {
  //form data ie req.body is jsObject {key/name:inputValue,key/name:inputValue,key/name:inputValue}
  // ***************************************************************************************
  //CREATE - creating a single new document in the (farms) collection of (farmStanddb3)db
  // ***************************************************************************************
  //create modelInstanceObject(ie document) from FarmClassObject(object) //object has validations/contraints
  const newFarm = new FarmClassObject(req.body); //form data/req.body
  //creates (farms)collection in (farmStanddb3)db and adds (newFarm)document into the (farms)collection
  const savedFarm = await newFarm.save(); //savedFarm = dataObject ie created jsObject(document)
  //reqObject.method("categoryKey","messageValue")
  //creating a message and storing it in the flash area of the session ie an arrayObject of messages (req.flash("categoryKey"))
  req.flash("success", "Successfully made a farm");
  res.redirect(`/farms`);
});

//route 4
//httpMethod=GET,path/resource-/farms/:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (farms)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.get("/farms/:id", async (req, res) => {
  const { id } = req.params;
  // *************************************************
  //READ - querying a collection for a document by id
  // *************************************************
  //FarmClassObject.method(idString) ie modelClassObject.method() - same as - db.farms.findOne({_id:"12345"})
  //find modelInstanceObject(ie document) that matches id -> thenableObject(resolved,foundFarm)
  const foundFarm = await FarmClassObject.findById(id); //foundFarm = dataObject ie single first matching jsObject(document)
  res.render("farms/show", { farm: foundFarm });
});

//route 7
//httpMethod=DELETE,path/resource-/farms/:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (farms)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.delete("/farms/:id", async (req, res) => {
  const { id } = req.params;
  // ******************************************************************************
  //DELETE - querying a collection(products) for a document by id then deleting it
  // ******************************************************************************
  //FarmClassObject.method(idString) ie modelClassObject.method() - same as - db.farms.findOneAndDelete(({_id:"12345"})
  //queries (farms)collection of (farmStanddb3)db for single document by idString and deletes the document
  const deletedFarm = await FarmClassObject.findByIdAndDelete(id); //deletedFarm = dataObject ie single first matching jsObject(document) that was deleted
  res.redirect("/farms");
});

//adddress - localhost:3000
//app is listening for (HTTPstructured) requests
//executes callback
app.listen(3000, () => {
  console.log("listning on port 3000;");
});
