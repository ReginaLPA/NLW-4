import "reflect-metadata";
import express from 'express';
import "./database";

const app = express();



app.get("/", (req, res)=>{
    return res.json({message:'Hello world - NLW4'});
});

app.post("/", (req,res)=>{
    return res.json({message:"Os dados foram salvos com sucesso!"});

});

app.listen(3333, ()=>console.log('Server is running! porta 3333'))