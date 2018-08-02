var mongoose=require('mongoose');
var Schema=mongoose.Schema({
    "title" : String,
	"description" : String,
	"createdBy" : String,
	"assignedTo" : String,
	"creationDate" : String,
    "Accepted" : Boolean,
    "Rejected" : Boolean,
    "ResolutionDate":String
},{
    collection:'ticketCollection'
});
module.exports=mongoose.model("ticketCollection",Schema);