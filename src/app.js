const express = require('express');

const app = express();


app.get('/user/:userId/:userName/:city',(req,res)=>{
    // http://localhost:7777/user?userName=komal&city=pune
    // const params=req.query;
    const params= req.params;
    res.send(params)
})
app.post('/user',(req,res)=>{
    res.send("post res")
})
app.delete('/user',(req,res)=>{
    res.send("delete res")
})
app.patch('/user',(req,res)=>{
    res.send("patch res")
})

app.get(/.*fig$/,(req,res)=>{
    res.send("profile res")
})

app.listen(7777,()=>{
    console.log("server listening")
})