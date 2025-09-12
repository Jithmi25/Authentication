import mongoose from "mongoose";

const userSchema= mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true,
    },
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
const user = mongoose.model("user", userSchema);

export default user;