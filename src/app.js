const express = require('express');

const app = express();

app.use('/test',(req,res)=>{
    res.send("Testing page")
})


app.use('/',(req,res)=>{
    res.send("Home page")
})


app.listen(7777,()=>{
    console.log("server listening")
})