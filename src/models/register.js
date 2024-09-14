
// ======================================= REQUIRING MMONGOOSE AND CREATING SCHEMA FOR TEPLATE AND STRUCTURE=================================

const mongoose = require('mongoose');


const Schema = new mongoose.Schema({
    username: {
        type:String,
        required:true
    },
     password:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true
     },
     token:{
        type:String,
        required:true
     }
   

})


// ====================================== CREATING COLLECTION =======================================================

const signupRecord = new mongoose.model("AuthCollection", Schema)

// ==================================EXPORTING MODULE =======================================================================

module.exports = signupRecord;