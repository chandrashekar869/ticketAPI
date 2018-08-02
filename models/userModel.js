var mongoose=require('mongoose');
var Schema=mongoose.Schema({
    "name" : String,
	"emailId" : String,
	"phone" : String,
	"password" : String,
	"forceLogOut" : false,
	"role" : Object
},{
    collection:'userCollection'
});
module.exports=mongoose.model("userCollection",Schema);