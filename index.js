const express = require('express')
const fs = require('fs')
const PORT = 3000;

const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}));

const routing = require('./Routes/index.route');

app.use('/', routing);


app.listen(PORT, (err)=>{
    if(err){
        console.log("Error in starting the serever")
    }else{
        console.log(`Server is runnong in ${PORT}`)
    }
})

