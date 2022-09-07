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
//server creates a session which uses a temporary data store and sends browser a signed cookie - value being sessionID converted to HMACValue
//subsequent (http structured) requests to server will contain signed cookie with HMACValue in the header
//server remember the same session that uses the temporary data store
//server unsigns the cookies HMACValue ie sessionID and uses the sessionID to find this specific clients stored data in the temporary data store
//example temporary data stores -
//default MemoryStore(dev env) (issues - leaks memory/does not scale - ment for debugging) - resets when server restart
//RedisDB(prod env), MongoDB(prod env) - persists for a while even when server restart
//data store also called session store
//Diffrent browsers(client) and postmans(Client) can access the same temporary data store with thier given signed cookies containing their specific sessionID
//when signed cookie of client expries then the temporary data store removes the data associated with that sessionID from itself
//if client looses signed cookie, client cannot access the data associated to the sessionID in the temporary data store - eg logged in

//code
//req.session - session(jsObject) property on reqObject
//req.sessionStore - sessionStore(jsObject) property on reqObject
//req.sessionID - sessionID(jsObject) property on reqObect

// *************************************************************************************************************************************
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
//On first (http strucuted) request, express-session middleware auto creates session(jsObject) property on reqObject (associated to new created temporary data store) and auto creates signed cookie with HMACValue - created from (req.session.id + "secretString" + sha256HashFunction)
//it also auto sets this signed cookie in the resObjects header (Set-Cookie:key:value)
//case2-
//Subsequent (http strucutred) requests from same client contain signed cookie in its header (Cookie:key:value)
//express-session middleware auto recreates the same session(jsObject) property on reqObject (assoicated with the pre existing temporary data store)
//express-session middleware unsigns the cookies HMACValue to get the specifc sessionID and uses it to look up the specfic clients stored data in the req.session jsObject (associated to temporary data store)
//sidenode - (http structure) request could be from browserClients or postmanClients - each gets its own signed cookie containig its own sessionID
const sessionOptionsObject = {
  secret: "thisismysecret",
  resave: false,
  saveUninitialized: false,
};
//resave - save session to data store even if nothing was changed
//saveUninitialized - save a new session to data store when nothing is created
app.use(session(sessionOptionsObject));

// *****************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters)
// *****************************************************************************************

//route1
//app.method("pathString",handlerMiddlewareCallback)
app.get("/pageviewcount", (req, res) => {
  console.log(req.sessionID);
  //console.log(req.session.id);
  //console.log(req.sessionID);

  //adding data to temporary data store using unique sessionID of specifc client - ie creating a property in sessionObject
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  //send signed cookie in (http strucutred) response header
  res.send(`You have viewd this page ${req.session.count} times.`);
});

//route2 - accepts ?querystring
//app.method("pathString",handlerMiddlewareCallback)
app.get("/register", (req, res) => {
  //key to value + default - Object destructuring
  const { username = "Anonymous" } = req.query;
  //adding data to temporary data store using unique sessionID of specifc client - ie creating a property in sessionObject
  req.session.username = username;
  res.redirect("/greet"); //client sends (http structured) request to /greet with signed cookie in header
});

//route3
//app.method("pathString",handlerMiddlewareCallback)
app.get("/greet", (req, res) => {
  //retriveing the data from the temporary data store using unique sessionID of specifc client - ie retrive property value in sessionObject
  const { username } = req.session;
  res.send(`Welcome back, ${username}`);
});

//full website address/domain - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen("3000", () => {
  console.log("Listning on port 3000");
});
