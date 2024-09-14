
// ============================================REQUIRING ALL MODULES========================================

const ejs = require('ejs');
const express =  require('express');
const app = express();
const path = require ('path');
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const signupRecord = require("./src/models/register")
const Host_Register = require("./src/models/hostadd");


//================================= REQUIRE PORT ========================================================
const PORT = 4200;

// ============================= CONNECTION ==========================================================
require("./src/db/connect")

// =================================REQUIRNG MIDDLEWARE==================================================



app.use(cookieParser())
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname,'public/css')));
app.use(express.urlencoded({ extended : true}));

// ==================================SETTING PATH  FOR TEMPLATE============================================

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './templates/views'));
const template_path = path.join(__dirname, "./templates/views");
app.set("views", template_path);


const { MongoClient, ObjectId } = require('mongodb');



// ======================================FUNCTION FOR PASSWORD  HASHPASS======================================

async function hashPass(password){
  const res = await bcryptjs.hash(password,10)
  return res
}



// ===========================================FUNTION TO GET FILES FROM DATABASE=======================================

async function FindData() {
// ===================================MOGODB URI CONNECTION===================================================

  const uri = "mongodb+srv://Anshuman1992:Anshuman1992@cluster0.t4indh7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  await client.connect();

  var result = await client.db("sample_airbnb").collection("listingsAndReviews").find().limit(50).toArray();


  return result
}

// ==========================================SECOND FUNCTION TO SEARCH FROM ID============================================

async function FindData1(id) {
  //-----------------------MONGODB URI CONNECTION----------------------------------------------**
  const uri = "mongodb+srv://Anshuman1992:Anshuman1992@cluster0.t4indh7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  await client.connect();
  var result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ _id: id });
  // console.log(result);
  return result
}


// ==========================GETTING EJS FILES===========================

// ---------------------------TO RENDER HOME PAGE----------------------------------------
app.get('/' , async (req, res) => {
 
  res.render('welcome')

});

// ----------------------------------RENDIERING REGISTER PAGE-------------------------------------------
app.get('/register',async (req, res) => {
  try{
  res.render('register')
}
catch(error){
  res.render('error',{error:error.message})
}
});





//------------------------------------- HANDLING USER REGISTRATION--------------------------------

app.post("/register", async (req, res) => {
  try {
    const check = await signupRecord.findOne({ email: req.body.email });// Check if the user exists by searching for the email in the database.


    if (check) {
      res.send("User already exists");// If the user exists, send a message indicating that the user already exists.
    } else {



// If the user doesn't exist, hash the password, generate a JWT token, set it as a cookie,
      const hashedPassword = await hashPass(req.body.password);
      const token = jwt.sign({ email: req.body.email }, "sadasdsadsadsadsadsadsadsadasdasdsaadsadsadsadasefef");

      res.cookie("jwt",token,{
        maxAge:600000,
        httpOnly:true
      })
      
// create a user object with email, username, hashed password, and token, and insert it into the database.
      const user = {
        email:req.body.email,
        username: req.body.username,
        password: hashedPassword,
        token: token,
      };

      await signupRecord.insertMany(user);
      res.redirect('/index');    
      // Redirect to '/index' upon successful registration.
    }
  } catch (error) {
    res.send("Error: " + error.message);// Handle errors by sending an error message.
   
    
  }
});









//==========================================ROUTE FOR RENDERING LOGIN PAGE=======================================

app.get('/login', (req, res) => {
  res.render('login');
});

// Handling user login:

app.post('/login',async(req,res)=>{
  try{
      const {  email, password } = req.body;// Retrieve email and password from the request body.
      console.log('details', email, password);
      
      const userDetails=await signupRecord.findOne({email:email},{password:password});// Search for user details in the database based on the provided email.
      const generateToken=(userData)=>{
          return jwt.sign(userData,"sadasdsadsadsadsadsadsadsadasdasdsaadsadsadsadasefef",{expiresIn:'1h'});
          }

          // Generate a JWT token using user data (email and password) if the user exists.
          console.log('userdetails',userDetails);
          const token=generateToken({password:userDetails.password,email:email});
          console.log('token is ',token);
          res.cookie('email',userDetails.email);// Set cookies for email, password, and the generated JWT token.
          res.cookie('password',userDetails.password);

          res.cookie('jwt',token,{httponly:true});

      if(userDetails){
          
          res.redirect('/index');// If user details are found, redirect to '/index'.
      }
  }
  catch(e){
      console.log(e);
  }
})




// Route to render the 'index' page:
app.get('/index' , async (req, res) => {
  let data = await FindData();// Retrieve data asynchronously from 'FindData()' and 'FindData2()' functions.
  let data1 = await FindData2();

  res.render('index', {
    data: data,
    data1:data1,
    // Render the 'index' view/template and pass the retrieved data as objects to the view.
    
  });

});





// Route for displaying details of a specific item:
app.get('/details/:id', async (req, res) => {
  // Extract the 'id' parameter from the request URL using req.params.id.
  try {
    let data = await FindData1(req.params.id);
    // Use the 'FindData1()' function asynchronously to fetch specific data based on the provided 'id'.
    res.render('details', {
      data: data,
      // Render the 'details' view/template and pass the retrieved data as an object to the view.
    });
  } catch (error) {
    res.render('error', { error: error.message });
  }
});



// ===================route to login page===============================

app.get('/login', (req, res) => {
    res.render('login');
});

//============================== route to logoout page=============================
app.get("/logout", async (req, res) => {
  try {
 
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error);
  }
})


// ==============================route to help page

app.get('/help', (req, res) => {
    res.render('help');
});


// =======================FUNCTION TO FIND DATA FROM USER DATABASE=============================================

async function FindData2(){
  //-----------------------mongodb uri connection-----------------------**
  const uri = "mongodb+srv://Anshuman1992:Anshuman1992@cluster0.t4indh7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  
  var result1 = await client.db("userdetail").collection("host_datas").find().toArray();
  // console.log(result1);
  return result1
};


async function FindData3(HomeName) {
  const uri = "mongodb+srv://atulnew:topology@cluster0.yylrcsq.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();

  var result2 = await client.db("userdetail").collection("host_datas").findOne({HomeName});
  return result2
}
 

// ========================================RENDERING TO HOST PAGE================================================

// ==========================================DATA BY USING CRUD OPERATION===========================================

app.get('/host_page', async (req, res) => {
  let data2 = await FindData2();
  // console.log(data1);
  res.render('host_page', {
    data2:data2,
  });
  
});

// =========================================GETTING ADD USER PAGE========================================

app.get('/adduser',(req,res)=>{
  res.render('adduser')
})


//  ======================================GETTING TO HOST INFORMATION=========================================

app.post('/hostinform', async (req, res) => {

  const HostSchema = new Host_Register({
    HomeName: req.body.hname,
    Location: req.body.location,
    PropertyType: req.body.ptype,
    Homeurl: req.body.Imageurl,
    minimum_nights: req.body.mnights,
    neighbourhood_overview: req.body.overview,
    cancellation_policy:req.body.policy,
    Price: req.body.price,
    
  });
  const registered = await HostSchema.save();
   if(registered){
    
    res.redirect('/host_page');
  }else{
    res.redirect('/');
  }
 
});



// ==========================EDITING USING MONGODB FUNCTION=============================================

app.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data2 = await Host_Register.findById(id);

    if (!data2) {
      return res.redirect("/host_page");
    }

    res.render("edituser", {
      title: 'Edit User',
      data2: data2,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/host_page");
  }
});


// =================================================DELETING USING MONGODB FUNCTION=========================

app.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await Host_Register.findOneAndDelete({ _id: id });

    if (!deletedItem) {
      return res.status(404).send('Item not found');
    }

    res.redirect('/host_page');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});





// =============================================UPDATING TO HOST DATA-====================================================

app.post('/hostinform/:id',async(req,res) =>{
  let id = req.params.id;
 await Host_Register.findOneAndUpdate({_id:id},{
    HomeName: req.body.hname,
    Location: req.body.location,
    PropertyType: req.body.ptype,
    Homeurl: req.body.Imageurl,
    minimum_nights: req.body.mnights,
     cancellation_policy:req.body.policy,
    Price: req.body.price,
  })
  if (id != id) {
    console.log(err);
} else {
  
    res.redirect('/host_page');
}
       
  }); 










// ====================================CONNECTION TO PORT=====================================================

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });



  