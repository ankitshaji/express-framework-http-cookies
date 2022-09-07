//main file of this app that gets other npm package modules or user created modules
// ********************************************************************************
//RESTful webApi - using REST principles
// ********************************************************************************
const express = require("express"); //expressFunctionObject //express module
const app = express(); //appObject
const cookieParser = require("cookie-parser"); //functionObject //cookie-parser module

//*********************************************************************************************************************************************************
//http cookies - adding statefullness to (http structured) requests/responses in tcp connection - cookie types - session management,personalization,tracking
//*********************************************************************************************************************************************************

//Case1 - normal cookie
//client(browser) sends (http structured) request to server/webApi/website
//if route path is /setcookiename -
//server sets normal cookie in resObject header - res.cookie("name", "henrietta");
//then converts/sends resObject as (http structured) response to the client , containing header (Set-Cookie:key:value)
//we can see the normal cookie in
//dev tools - application - cookies - %20 is enocoded space eg. name:bobby%20wheeler
//normal cookie is saved on client browser - only for localhost:3000 domain - (website/server/webApi)
//browser saves these normal cookies in a file - normal cookies still exist if we reopen specific browser
//we can directly write our own normal cookies in here
//normal cookies are not used to store important info(unreliable) - only for some statefullness in (http structured) requests/responses
//we send this normal cookie on every subsequent request to localhost:3000 - (can clear)
//we update normal cookie in our client by going to /setcookiename again
//if route path is /greet and normal cookies already saved on client browser
//we send normal coookie in this (http strcutured) request inside its header (Cookie:key:value)
//cookie-parser middleware is needed to parse cookie in the header of the (http structured) request into reqObject.cookies jsObject

//Case2 - signed cookie -
//client(browser) sends (http structured) request to server/webApi/website
//if route path is /setsignedfruit -
//if cookie-parsers middlewareCreationFunction contains optionalArgument "secretString" and res.cookie() contained optionaArguemntObject {signed:true}
//cookie-parsers middlewareCallback signs the value of the normal cookie using the "secretString" + sha56HashFunction - creating the signed cookie with HMACValue
//server sets signed cookie in resObject header  - res.cookie("name","hnrietta",{signed:true})
//then converts/sends resObject as (http structured) response to the client , containing header (Set-Cookie:key:value)
//we can see the signed cookie in
//dev tools - application - cookies - fruit:s%3Agrape.LMNZojp%2FiR9Tsj50P0ysA22deJjrP0awUK0S8R3lTUk ie HMACValue
//signed cookie is saved on client browser - only for localhost:3000 domain - (website/server/webApi)
//browser saves these signed cookies in a file - signed cookies still exist if we reopen specific browser
//we do not directly write our own signed cookies nor alter a saved one
//signed cookies are not used to store important info(unreliable) - only for some statefullness in (http structured) requests/responses
//+ since its signed cookie we now have itegrity check
//we send this signed cookie on every subsequent request to localhost:3000 - (can clear)
//we update signed cookie in our client by going to /setsignedfruit again
//if route path is /verify and signed cookies already saved on client browser
//we send signed cookie in this (http strcutured) request inside its header (Cookie:key:value)
//cookie-parsers middlewareCallback is needed to parse signed cookies in the header of the (http strucutred) request into unsigned cookies in reqObject.signedCookies jsObject
//itegrity verification is done by unsigning the signed cookie
//unsigning process -
//since the signed cookie HMACvalue was signed at the start using the same "secreString" + sha256HashFunction
//we take apart the new received signed cookie HMACValue and get its normal value
//"grape" .LMNZojp%2FiR9Tsj50P0ysA22deJjrP0awUK0S8R3lTUk
//and sign this normal value  using the same "secretString" + sha256HashFunction
//if the new signed cookie HMACValue is the same as the received singned cookie HMACValue then it is unaltered/maintains integrity
//if signed cookie was altered - the reqObject.signedCookie would have {empty object} or {cookieName:false}
//else if unalterd the HMACValue becomes normal value and reqObject.signedCookie contains {key:value}

//Note -
//"secretString" should be hidden in env variable as altering it leaves all currently signed cookies HMACValues unable to be unsigned and be normal value ie.readable

// *************************************************************************************************************************************
//(Third party)middleware(hook) function expressions - Order matters for next() execution
// *************************************************************************************************************************************
//(Application-level middleware) - bind middlewareCallback to appObject with app.use() or app.method()
//app.use(middlewareCallback) - argument is middlewareCallback

//(Third party) - was part of express framework
//middlewareCreationFunctionObject(optionalArgument- "secretString") -
//middlewareCreationFunctionObject execution creates middlewareCallback
//cookie-parsers middelwareCallback - (creates cookies/secrets/signedCookies property on reqObject - jsObject)
//Purpose:when recieving request - normal cookie in (http structured) request header (Cookie:key:value) is parsed to reqObject.cookies - {key:value,key:value}
//cookie-parsers middlewareCallback - had "secretString" optionalArgument during middlwareCallback creation + res.cookies() optionsObject- {signed:true}
//(creates cookies/secrets/signedCookies property on reqObject - jsObject)
//Purpose:when creating response - cookie-parsers middlwareCallback signs the normal cookie with the "secretString" creating the signed cookie - res.cookie("name","hnrietta",{signed:true})
//Purpose:when recieving request - signed cookie in (http structured) request header (Cookie:key:value) is unsigned with "secretString" and parsed to reqObject.signedCookies - {key:value,key:value} jsObect
//sidenode - (http structure) request could be from browser or postman
app.use(cookieParser("thisismysecret")); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//code -
//cookie() method already exists on resObject returns resObject
//cookie-parser middleware creates these properties on reqObject-
//req.cookies - stores received cookies jsObject
//req.secrets  - stores secret string if in argument of middlwareCreationFunction
//req.signedCookies - stores received signed cookies jsObejct

// *****************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters)
// *****************************************************************************************

//route1
//httpMethod=GET,path/resource- /greet -(direct match/exact path)
//(READ) name-index,purpose-display all documents in collection from db
//router.method(pathString ,async handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /greet
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - (http structured) request header contained (Cookie:key:value) ,previous middlewareCallback parsed it to req.cookies
//-if not already created create res jsObject
//-nextCallback
app.get("/greet", (req, res) => {
  //key to variable + default value - object destructure
  const { name = "DefaultNameValue" } = req.cookies; //req.cookies - jsObject {cookieName:cookieValue} - retrive normal cookies
  res.send(`Hey there, ${name}`);
});

//route2
//httpMethod=GET,path/resource- /setcookiename -(direct match/exact path)
//(READ) name-index,purpose-display all documents in collection from db
//router.method(pathString ,async handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /setcookiename
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
app.get("/setcookiename", (req, res) => {
  //resObject.method(cookieName,cookieValue,optionsObject) //optionsObject to change signed,expiry,domain,maxAge,secure etc
  //cookieValue can be string or jsObject converted to jsonString
  res.cookie("name", "henrietta"); //normal cookie creation
  res.cookie("animal", "harlequin shrimp"); //setting 2 cookies in resObject header
  res.send("Sent you a cookie");
});

//route3
//httpMethod=GET,path/resource- /setsignedfruit -(direct match/exact path)
//(READ) name-index,purpose-display all documents in collection from db
//router.method(pathString ,async handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /setsignedfruit
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
app.get("/setsignedfruit", (req, res) => {
  //resObject.method(cookieName,cookieValue,optionsObject) //optionsObject - {signed:true}
  res.cookie("fruit", "grape", { signed: true }); //signed cookie creation - setting signed cookie in resObject header
  res.send("Sent you a signed cookie");
});

//route4
//httpMethod=GET,path/resource- /verify -(direct match/exact path)
//(READ) name-index,purpose-display all documents in collection from db
//router.method(pathString ,async handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /verify
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - (http structured) request header contained signed cookies (Cookie:key:value) ,previous middlewareCallback unigned it and parsed it to req.signedCookies
//-if not already created create res jsObject
//-nextCallback
app.get("/verify", (req, res) => {
  //req.cookies; //does not contain signed cookie
  console.log(req.signedCookies); //unsigned/readable cookie value - {key:value} OR if altered - {key:false} OR {}
  console.log(req.secret); //contains the "secretString"
  res.send("verifying signed cookie");
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
