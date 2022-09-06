//main file of an app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //FunctionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //AppObject
//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const FarmClassObject = require("./models/farm"); //FarmClassObject(ie Model) //self created module/file needs "./"
const methodOverride = require("method-override"); //functionObject //method-override module

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
  res.render("farms/index", { farms: foundFarms });
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
