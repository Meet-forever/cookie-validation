"use strict";
// Imports---------------------------------------------
import express, { urlencoded } from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url'
const app = express();
const PORT = process.env.PORT || 8000; 
// ---------------------------------------------------------



// ES6 configuration and variables setup----------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url))
const formurl = process.env.URL || `http://localhost:${PORT}`
app.locals.formurl = formurl
// --------------------------------------------------



// Basic App configuration --------------------------------
app.use(urlencoded({extended: true})) // To parse the body of the request
app.set('views', join(__dirname, 'views')) // Setting views folder path 
app.set('view engine', 'ejs')   // Using EJS as a template engine
app.use(express.static(__dirname + '/public'))
let data = []   
// ----------------------------------------------------



// Requests-----------------------------------------------
app.get('/', (req, res)=>{
    res.render('index');
})



// Sign In and Sign Up section
app.get('/signup', (req, res)=>{
    res.render('signup');
})
app.get('/signin', (req, res)=>{
    res.render('signin');
})
app.post('/signin', (req, res)=>{
    
})
app.post('/signup', (req, res)=>{

})


// Validation and Checking function
function validation(req, res, next){

}
function checkcookie(req, res, next){
    
}
// --------------------------------------------------------




// Listening -----------------------------------------------
app.listen(PORT, ()=>console.log(`Listening on PORT ${PORT}`))