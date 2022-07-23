//chatName
//isGroupChat
//user
//latest Message
//Grop Admin

/*
 Mongoose is going to be used to connect to our MongoDB Database and make Query to our Database
 We use mongoose to create our Schema
 With the Help of these Model,MongoDB will understand, how to structure our data in our Database
*/
const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
    {
        chatName:{
            type:String,
            trim:true
        },
        isGroupChat:{
            typr:Boolean,
            default:false
        },
        users:[
            {
                type:mongoose.Schema.Types.ObjectId,//means it contain _id to that particular user
                ref:"User"//refernce to userModel
            }
        ],
        latestMessage:
            {
                type:mongoose.Schema.Types.ObjectId,//reference to Object Id
                ref:"Message"//refering to that particular part of DB where Message is Stored(Message Model)
            },
        groupAdmin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        } ,  
    },
    //we are adding the field so that mongoose create time-stamp everytime we add a new Data
    {
        timestamps: true,
    }
    
);

const Chat = mongoose.model("Chat",chatModel);
module.exports = Chat;