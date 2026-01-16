const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const port = process.env.PORT || 8080

app.set('view engine','ejs')
app.use(express.urlencoded({extended: true}))
app.set('views',path.join(__dirname,'/views'))

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

app.listen(port,()=>{
    console.log(`Listening on port ${port}...`)
})

