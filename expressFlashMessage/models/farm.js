//user created module file can contain functionObjects,variable,classObjects etc

const mongoose = require("mongoose"); //mongooseObject //mongoose module
//key to variable + rename variable - object destructuring
const { Schema: SchemaClassObject } = mongoose; //mongoose.Schema = SchemaClassObject
//dont need to connect nodejs runtime app to mongod server port since we are going to export model to where its already connected

//*********************************************************************************
//MODEL - FarmClassObject ie(Model) - represents the (farms) collection
//*********************************************************************************
//mongooseObject.schemaMethod = SchemaClassObject(object)
//schemaClassInstanceObject = new SchemaClassObject(object)
//setting validtaions/constraints in object - shorthand vs longhand - [string] vs [{properties}] , String vs {type:String,required:true}
//mongoose treats [{properties}] object as an another/embedded schemaInstanceObject - we can prevent id creation
const farmSchemaInstanceObject = new SchemaClassObject({
  name: { type: String, required: [true, "Farm must have name"] },
  city: String,
  email: { type: String, required: [true, "Email is required"] },
});

//creating farmClassObject ie(Model) - represents a collection (farms)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
const FarmClassObject = mongoose.model("Farm", farmSchemaInstanceObject);

//exportsObject = productsClassObject ie(Model)
module.exports = FarmClassObject;
