const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = process.env.PORT || 8080;
const ExpressError =require('./ExpressError');

app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname, "public")));


main()
.then(()=>{
    console.log('Connected Succefully')
})
.catch((err)=> console.log(err))

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/TheDealDriven')
} 

app.get('/',(req,res)=>{
    res.send('Working')
})

app.use((err,req,res,next)=>{
    let {status=500 , message="Some error occured"} = err;
    res.status(status).send(message);
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}...`)
})

