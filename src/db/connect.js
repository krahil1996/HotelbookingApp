


// =================================CODE FOR TO CONNECT MONGODB ATLAS===================================================

const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/batch10testbook')
 mongoose.connect('mongodb+srv://Anshuman1992:Anshuman1992@cluster0.t4indh7.mongodb.net/userdetail?retryWrites=true&w=majority')

    .then(() =>{
        console.log('connection is successful')
    })

      .catch((e) => {
        console.log(e,'connection failed')})

    
// ==================================================================================================================





