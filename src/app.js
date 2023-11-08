require('dotenv').config();
const express = require("express");
require("./db/conn");
const hbs  = require("hbs");
const path = require("path");
const pdfjsLib = require('pdfjs-dist');
const app = express();
const port = process.env.PORT || 3000;
const User = require("./models/usremessage");
const staticpath = path.join(__dirname,"../docs");
const templatepath = path.join(__dirname,"../templates/views");
const partialpath = path.join(__dirname,"../templates/partials");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const { request } = require('http');
const fs = require('fs');
const PDFDocument = require('pdfkit');

//const passportLocalMongoose = require("passport-local-mongoose");
/*
const {
    checkAuthenticated,
    checkNotAuthenticated,
} = require("./db/middleware");
*/
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))

app.use('/css',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/css")));
app.use('/js',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/js")));
app.use('/jq',express.static(path.join(__dirname,"../node_modules/jquery/dist")));
app.use(express.urlencoded({extended:false}));
app.use(express.static(staticpath));
app.set("view engine","hbs");
app.set("views",templatepath);
hbs.registerPartials(partialpath);
//const { URLSearchParams } = require("url");

app.use(session({
    secret: "littlesecret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/*
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECERT,
    callbackURL: "http://localhost:3000/auth/google/collespace",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/collespace",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/serect");
});

*/

app.post("/login", function(req,res) {
    /*
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    */
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    
    req.login(user, function(err){
        if (err) {
          console.log(err);
        } else {
          passport.authenticate("local")(req, res, function(){
            res.redirect("/serect");
          });
        }
    });
    
});

app.get("/logout", (req, res) => {
    /*
    req.logOut();
    console.log('Log out done');
    res.redirect("/login");
    */
    req.logout(req.user, err => {
        if(err) return next(err);
        res.redirect("serect");
      });
})

app.get("/",function(_req,res){
    res.render("index");
});
app.get("/serect" ,function(req ,res){
    
    if(req.isAuthenticated()){
        res.render("serect");
    }else{
        res.redirect("/login");
    }
    
    //res.render("serect");
});
app.post("/Register", function(req, res) {
  //console.log(req.body);
    const newUser = new User({
    
      name: req.body.name,
      email: req.body.email,
      username:req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      message: req.body.message
    });
    //console.log(newUser);
    User.register(newUser, req.body.password, function(err, _user) {
      if (err) {
        console.log("Yes");
        console.log(err);
        res.redirect("/Register");
      } else {
        console.log("No");
        /*
        passport.authenticate("local")(req, res, function() {
          res.redirect("/serect");
        });
        */
        res.redirect("/login");
      }

    });
 });
  

app.get("/SEM1",function(_req,res){
    res.render("SEM1");
});
app.get("/SEM5",function(_req,res){
  res.render("SEM5");
});
app.get("/SEM2",function(_req,res){
    res.render("SEM2");
})

app.get("/Register",function(_req,res){
    res.render("Register");
})

app.get("/login", (_req, res)=>{
    res.render("login");
});

app.get("/contact",(_req,res)=>{
    res.render("contact");
});
app.get("/Notes",function(req,res){
    if(req.isAuthenticated()){
      res.render("Notes");
    }else{
        res.redirect("/login");
      
    } 
});
    
app.listen(port,function(){
    console.log(`Server is running at port no ${port}`);
});
/*
const express = require("express");
require("./db/conn");
const hbs  = require("hbs");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const User = require("./models/usremessage");
const staticpath = path.join(__dirname,"../public");
const templatepath = path.join(__dirname,"../templates/views");
const partialpath = path.join(__dirname,"../templates/partials");
//const { registerPartials } = require("hbs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const {
    checkAuthenticated,
    checkNotAuthenticated,
} = require("./db/middleware");
//const { URLSearchParams } = require("url");
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))

app.use('/css',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/css")));
app.use('/js',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/js")));
app.use('/jq',express.static(path.join(__dirname,"../node_modules/jquery/dist")));
app.use(express.urlencoded({extended:false}));
app.use(express.static(staticpath));
app.set("view engine","hbs");
app.set("views",templatepath);
hbs.registerPartials(partialpath);



User.plugin(passportLocalMongoose);


/*
const initializePassport = require("./db/passportConfig");
initializePassport(passport, email => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM `userdetail` WHERE `email` = '" + email + "'";
        connection.query(sql, (err, rows) => {
            resolve(rows[0]);
        })
    })
}, id => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM `userdetail` WHERE `id` = " + id + "";
        connection.query(sql, (err, rows) => {
            resolve(rows[0]);
        })
    })
});

*/
/*
app.get('/pdf/:option', (req, res) => {
  const option = req.params.option;

  // Create a new PDF document
  const doc = new PDFDocument();

  // Generate PDF based on the option
  if (option === 'option1') {
    doc.text('This is PDF Option 1');
  } else if (option === 'option2') {
    doc.text('This is PDF Option 2');
  } else {
    doc.text('Invalid option');
  }

  // Generate a unique filename for the PDF
  const fileName = `pdf_${option}.pdf`;

  // Pipe the PDF document to a writable stream
  const stream = fs.createWriteStream(fileName);
  doc.pipe(stream);

  // End the PDF document
  doc.end();

  stream.on('finish', () => {
    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // Stream the file to the response
    const fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);
  });
});
app.get('/pdf/Asp/asp.pdf',function(_req,res){
  res.render('asp.pdf');
});
app.get('/view/:option',(req, res) => {
  const option = req.params.option;

  // Create a new PDF document
  const doc = new PDFDocument();

  // Generate PDF based on the option
  if (option === 'option1') {
    res.redirect("/pdf/Asp/asp.pdf");
  } else if (option === 'option2') {
    doc.text('This is PDF Option 2');
  } else {
    doc.text('Invalid option');
  }

  // Set response headers for displaying PDF in the browser
  res.setHeader('Content-Type', 'application/pdf');

  // Pipe the PDF document to the response
  doc.pipe(res);

  // End the PDF document
  doc.end();
});

app.use(express.static('public'));
*/

app.get("/ASP",function(_req,res){
  res.render("ASP");
});
app.get("/GPA",function(req,res){
  //res.render("GPA");
  if(req.isAuthenticated()){
    res.render("GPA");
  }else{
      res.redirect("/login");
    
  } 
});
app.get("/GPAgrade",function(req,res){
  //res.render("GPAgrade");
  if(req.isAuthenticated()){
    res.render("GPAgrade");
  }else{
      res.redirect("/login");
  
  } 
});
async function run() {
  await mongoose.connect('mongodb://localhost:27017');
  mongoose.model('User', schema);

  await mongoose.model('User').findOne(); // Works!
}
