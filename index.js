//main file of this app that gets other npm package modules or user created modules
// ********************************************************************************
//RESTful webApi - using REST principles
// ********************************************************************************
const { signedCookie } = require("cookie-parser");
const express = require("express"); //expressFunctionObject //express module
const app = express(); //appObject
const session = require("express-session"); //functionObject //express-session module

//session managment with signed cookie
//session uses a server-side temporary data store that helps make http statefull
//on receving first (http strucutred) request
//server creates a session which uses a temporary data store and sends the unqiue browser a unqiue signed cookie - value being sessionID converted to HMACValue
//subsequent (http structured) requests from unqiue client to server will contain unique signed cookie with HMACValue in the header
//server recreates the same session which uses a temporay data store
//server unsigns the unique cookies HMACValue to get unique sessionID and uses this unique sessionID to find this specific clients stored data in the temporary data store
//example temporary data stores -
//default MemoryStore(dev env) (issues - leaks memory/does not scale - ment for debugging) - clears data on server restart
//RedisDB(prod env), MongoDB(prod env) - persists data for a while even when server restart
//data store is also called session store
//Diffrent browsers(client) and postmans(Client) can access the same temporary data store with thier given specific signed cookies containing their specific sessionID
//when signed cookie of client expries then the temporary data store removes the data associated with that sessionID
//if client looses signed cookie, client cannot access the data in temporary data store associated to the sessionID - eg.login verification

// ************************************s*************************************************************************************************
//(Third party)middleware(hook) function expressions - Order matters for next() execution
// *************************************************************************************************************************************
//(Application-level middleware) - bind middlewareCallback to appObject with app.use() or app.method()
//app.use(middlewareCallback) - argument is middlewareCallback

//(Third party)
//middlewareCreationFunctionObject(Argument- sessionOptionsObject) -
//middlewareCreationFunctionObject execution creates middlewareCallback
//middlewareCallback - During creation has "secretString" as sessionOptionObject's required argument
//Purpose:
//case1-
//On first (http strucuted) request, express-sessions middlewareCallback auto creates session(jsObject) property on reqObject (associated to new created temporary data store)
//it creates and pupulates sessionID property in reqObject with a unique sessionID
//it creates signed cookie with HMACValue (HMACValue is created from (req.sessionID + "secretString" + sha256HashFunction))
//it sets this signed cookie in the resObjects header (Set-Cookie:key:value)
//case2-
//Subsequent (http strucutred) requests from same client contain signed cookie in its header (Cookie:key:value)
//express-sessions middlewareCallback recreates the same session(jsObject) property on reqObject (assoicated with the pre existing temporary data store)
//it unsigns the cookies HMACValue to get the unique sessionID associate to that client
//it creates and pupulates sessionID property in reqObject with the unique sessionID of client
//it looks up the specfic clients stored data in the req.session jsObject (associated to temporary data store) using the unqiue sessionID
//sidenode - (http structure) request could be from browserClients or postmanClients - each unique client gets its own unique signed cookie containig its own unique sessionID
const sessionOptionsObject = {
  secret: "thisismysecret",
  resave: false,
  saveUninitialized: false,
};
//resave - save a session to data store even if session was not modified
//saveUninitialized - save a newly created session to data store even if session was not modified
app.use(session(sessionOptionsObject));

//code
//express-sessions middlewareCallback creates these properties on reqObject
//req.sessionID - stores currently received sessionID from the signed cookie in (http structured) reqest header OR newly created sessionID
//req.session.id - same
//req.session - current session jsObejct of current sessionID - assosicated to newly created/pre existing temporary data store
//req.session is used to add/retrive data to/from the newly created/pre exisintg temporary data store,
//specifically to add/retrive data where id is current sessionID  - (req.session.property )
//req.sessionStore - stores the newly created/pre existing temporary data store

// *****************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters)
// *****************************************************************************************

//route1
//app.method("pathString",handlerMiddlewareCallback)
app.get("/pageviewcount", (req, res) => {
  //adding data to newly created/pre exisiting temporary data store using unique sessionID of specifc client
  //sessionID is newly created or found through signed cookie in header sent by specifc client
  //ie creating a property in sessionObject assosicated to current sessionID
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  //send signed cookie in (http strucutred) response header - contains sessionID for client to store to retrive data from data store
  res.send(`You have viewd this page ${req.session.count} times.`);
});

//route2 - accepts ?querystring
//app.method("pathString",handlerMiddlewareCallback)
app.get("/register", (req, res) => {
  //key to value + default - Object destructuring
  const { username = "Anonymous" } = req.query;
  //adding data to newly created/pre exisiting temporary data store using unique sessionID of specifc client
  //unique sessionID is newly created or found through signed cookie in header sent by specifc client
  //ie creating a property in sessionObject assosicated to current sessionID
  req.session.username = username;
  //send signed cookie in (http strucutred) response header - contains unique sessionID for client to store to then use to retrive data from data store
  res.redirect("/greet"); //client sends (http structured) request to /greet with signed cookie in header - contains unique sessionID  used to retrive data from data store
});

//route3
//app.method("pathString",handlerMiddlewareCallback)
app.get("/greet", (req, res) => {
  //retriveing the data from pre existing temporary data store using unique sessionID of specifc client
  //unique sessionID is found through signed cookie in header sent by specific client
  //ie retrive property value in sessionObject associated to current sessionID
  const { username } = req.session;
  res.send(`Welcome back, ${username}`);
});

//full website address/domain - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen("3000", () => {
  console.log("Listning on port 3000");
});
