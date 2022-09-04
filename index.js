//main file of this app that gets other npm package modules or user created modules
// ********************************************************************************
//RESTful webApi - using REST principles
// ********************************************************************************
const express = require("express"); //expressFunctionObject //express module
const app = express(); //appObject

//*********************************************************************************************************************************************************
//http cookies - adding statefullness to http structured requests/responses in tcp connection - cookie types - session management,personalization,tracking
//*********************************************************************************************************************************************************
//Note -
//after server sets cookie and sends it to the client
//we can see it in
//dev tools - application - cookies - %20 is enocoded space
//cookie is saved on client browser - only for localhost:3000 domain - (website/server/webApi)
//we send this cookie on every subsequent request to localhost:3000 - (can clear)
//we can update cookie by going to /setname again

// *****************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters)
// *****************************************************************************************

//route1
//httpMethod=GET,path/resource- /greet -(direct match/exact path)
//(READ) name-index,purpose-display all documents in collection from db
//router.method(pathString ,async handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /greet
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression

//server receives cookies preset by server in clients http strucuted request - inside request header (Cookie:key:value)
app.get("/greet", (req, res) => {
  res.send("Hey there");
});

//route2
//httpMethod=GET,path/resource- /setname -(direct match/exact path)
//(READ) name-index,purpose-display all documents in collection from db
//router.method(pathString ,async handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /setname
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression

//server receives cookies preset by server in clients http strucuted request - inside request header (Cookie:key:value)
//server updates the cookie and sets it in response header (Set-Cookie:key:value)
app.get("/setname", (req, res) => {
  //server sets cookie in response header (Set-Cookie:key:value)
  //sends http structured response back to client with cookie in response header
  //resObject.method(cookieName,cookieValue,optionsObject) //optionsObject to change expiry,domain,maxAge,secure etc
  //cookieValue can be string or jsObject converted to jsonString
  res.cookie("name", "henrietta");
  res.cookie("animal", "harlequin shrimp"); //setting 2 cookies in response header
  res.send("Sent you a cookie");
});

//full website address/domain - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen(3000, () => {
  console.log("Listning on port 3000:");
});

//other info-
//localhost:3000 - domain ie full website address
//localhost ie.domainName/hostName sends request to DNS servers to get IP - 127.0.0.1
//default port number for HTTP if non given is port 80 - //we use port 3000
//Browser uses the IP and portNumber to make a TCP connection to 127.0.0.1 port 3000
//Browser can now make HTTP structured request to server
