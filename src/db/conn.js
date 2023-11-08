const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/collespace",{
    /*
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
    */
}).then(()=>{
    console.log("Connection Successfull");
}).catch((error)=>{
    console.log(error);
});
//ongoose.set("useCreateIndex",true);
