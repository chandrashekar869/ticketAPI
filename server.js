var express=require('express');
var bodyparser=require('body-parser');
var cors=require('cors');
var mongoose=require('mongoose');
var app=express();
var model = require('./models/userModel');
var ticketmodel = require('./models/ticketModel');
app.use(bodyparser.urlencoded({
    extended:true
}));
app.use(bodyparser.json());
var port=3200;
var router=express.Router();
app.use(cors());
mongoose.connect("mongodb://localhost:27017/ticketingApp");
app.use("/restAPI",router);
router.use(function(req,res,next){
    next();
});
router.route("/login")
.post(function(req,res){
    if(req.body.emailId && req.body.password){
    model.find({$and:[{"emailId":req.body.emailId},{"password":req.body.password}]},function(err,user){
        if(err)
        res.status(500).send(err);
        else{
        if(user==null || user.length==0){
            res.status(201).send({authenticated:false});            
        }
        else{
        res.json({authenticated:true,userDetails:user});
        }
        }
    });
    }
    else
    res.status(500).send({authenticated:false});
});

router.route("/user/getAdmins")
.get(function(req,res){
    model.find({"role.type":"Admin"},{"_id":1,"emailId":1,"role.company":1},function(err,users){
        if(err)
        res.status(500).send(err);
        else{
        if(users==null || users.length==0){
            res.status(201).send("No users in db");            
        }
        else{
        console.log();
        res.send(users);}
    }
    });
})

router.route("/user/getAdminTickets")
.get(function(req,res){
    ticketmodel.find({"assignedTo":req.query["id"]},function(err,users){
        if(err)
        res.status(500).send(err);
        else{
        if(users==null || users.length==0){
            res.status(201).send("No tickets in db");            
        }
        else{
        console.log();
        res.send(users);}
    }
    });
})



router.route("/user")
.get(function(req,res){
    model.findById(req.query["id"],function(err,users){
        if(err)
        res.status(500).send(err);
        else{
        if(users==null || users.length==0){
            res.status(201).send("No users in db");            
        }
        else{
        console.log();
        res.send(users);}
    }
    });
})
.post(function(req,res){  
    model.collection.insert(req.body.data,function(err,users){
        if(err)
        res.status(500).send(err);
        else{
        console.log();
        res.send(users.result);}
    });
})
.put(function(req,res){  
    model.findOne({_id:req.body.id},function(err,user){
        if(err)
        res.status(500).send(err);
        else{
            if(user==null){
                res.status(201).send("Invalid user");            
            }
            else{
            var reqData=req.body.data;
            user['name']=reqData['name'];
            user['emailId']=reqData['emailId'];
            user['phone']=reqData['phone'];
            user['password']=reqData['password'];
            user['forceLogOut']=reqData['forceLogOut'];
            user['role']=reqData['role'];
            user.save(function(err){
                if(err)
                res.status(500).send(err);
                else
                res.status(200).send(user);
 
            })
        }
        }
    });
})
.delete(function(req,res){  
    model.remove({_id:req.query["id"]},function(err,user){
        if(err)
        res.status(500).send(err);
        else{
        console.log();
        res.send(user);}
    });
});












router.route("/ticket")
.get(function(req,res){
    console.log(req.query["id"]);
    ticketmodel.find(req.query["id"]!=undefined?{"_id":req.query["id"]}:{},function(err,tickets){
        if(err)
        res.status(500).send(err);
        else{
        if(tickets==null || tickets.length==0){
            res.status(201).send("No tickets in db");            
        }
        else{
        console.log();
        res.send(tickets);}
    }
    });
})
.post(function(req,res){  

    ticketmodel.collection.insert(req.body.data,function(err,tickets){
        if(err)
        res.status(500).send(err);
        else{
        console.log();
        res.send(tickets.result);}
    });
})
.put(function(req,res){  
    ticketmodel.findOne({_id:req.body.id},function(err,ticket){
        if(err)
        res.status(500).send(err);
        else{
            if(ticket==null){
                res.status(201).send("Invalid ticket");            
            }
            else if(ticket['Accepted']==true){
                res.status(500).send("Cannot update approved tickets");                 
            }
            else{
            var reqData=req.body.data;
            ticket['title']=reqData['title'];
            ticket['description']=reqData['description'];
            ticket['createdBy']=reqData['createdBy'];
            ticket['assignedTo']=reqData['assignedTo'];
            ticket['creationDate']=reqData['creationDate'];
            ticket['Accepted']=reqData['Accepted'];
            ticket['Rejected']=reqData['Rejected'];
            ticket['creationDate']=reqData['ResolutionDate'];
            ticket.save(function(err){
                if(err)
                res.status(500).send(err);
                else
                res.status(200).send(ticket);
            })
        }
        }
    });
})
.delete(function(req,res){  
    ticketmodel.remove({_id:req.query["id"]},function(err,ticket){
        if(err)
        res.status(500).send(err);
        else{
        res.send(ticket);}
    });
})

app.listen(port);
