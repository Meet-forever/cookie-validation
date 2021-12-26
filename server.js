"use strict";
// Imports---------------------------------------------
import express, { urlencoded, json } from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'
import cookieParser from 'cookie-parser'
const app = express();
const PORT = process.env.PORT || 8000; 
// ---------------------------------------------------------



// ES6 configuration and variables setup----------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url))
const formurl = process.env.FORMURL || `http://localhost:${PORT}`
app.locals.formurl = formurl
// --------------------------------------------------



// Basic App configuration --------------------------------
app.use(json())
app.use(urlencoded({extended: true})) // To parse the body of the request
app.set('views', join(__dirname, 'views')) // Setting views folder path 
app.set('view engine', 'ejs')   // Using EJS as a template engine
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
let data = []   
// ----------------------------------------------------


// Requests-----------------------------------------------
app.get('/', (req, res)=>{
    res.render('index');
})



// Sign In, Sign Up and Sign Out section
app.get('/signup', authenticated, (req, res)=>{
    res.render('signup');
})
app.get('/signin', authenticated, (req, res)=>{
    res.render('signin');
})
app.get('/signout', (req, res)=>{
    res.clearCookie("remember_me");
    res.redirect('/');
})
app.post('/signin', validate,(req, res)=>{
    if(data.find(x => x.username === req.body.username && x.password === req.body.password)){
        data = data.map(x =>{
            if(x.username === req.body.username && x.password === req.body.password){
                const uuid = randomUUID();                
                res.cookie('remember_me',uuid, {
                    maxAge: 1000 * 60  
                });
                return (
                    {
                        ...x,
                        cookie: uuid 
                    }   
                )
            }
            else return x;
        })
        res.redirect('home')
    }
    else res.status(400).send("User Does Not Exist!");  
})

app.post('/signup', validate, (req, res)=>{
    const obj = {
        username: req.body.username,
        password: req.body.password,
        cookie: "" 
    }
    data.push(obj)
    setTimeout(()=>{
        data.pop(obj);
    }, 60000)
    res.redirect('/signin');
})




// Authenticated pages------------------------
app.get('/home', checkcookie, (req, res) => {
    res.render('home')
})
app.get('/secretpage1', checkcookie, (req, res) => {
    res.render('secretpage1')
})
app.get('/secretpage2', checkcookie, (req, res) => {
    res.render('secretpage2')
})
//---------------------------------------------





// Validation and Checking function---------------------------------
//Form validation function
function validate(req, res, next){
    const user_pattern = /^[a-zA-Z0-9_]*$/g;
    const password_pattern = /^[a-zA-Z0-9@%!]*$/g;
    if(req.body.username && req.body.password
        && req.body.username.length < 10 && req.body.password.length < 15 
        && user_pattern.test(req.body.username) && password_pattern.test(req.body.password)) next();
    else res.status(415).send("Invalid Format");
}
//Cookie Validation function
function checkcookie(req, res, next){
    const {cookies} = req
    if("remember_me" in cookies){
        if(data.find(x => cookies.remember_me === x.cookie)) next();
        else res.status(401).send("Unauthorized");
    }
    else res.status(403).send("Session expired");
}
//If user is authenticated
function authenticated(req, res, next){
    const {cookies}  = req
    if("remember_me" in cookies){
        if(data.find(x => cookies.remember_me === x.cookie)) res.redirect('/home');
        else next();
    }
    else next()
}
// --------------------------------------------------------




// Listening -----------------------------------------------
app.listen(PORT, ()=>console.log(`Listening on PORT ${PORT}`))