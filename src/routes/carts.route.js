import express from'express';
const cartsRoute= express.Router();
import CartManager from "../carts";
const cartManager= new CartManager("data/carts.json");

cartsRoute.post('/', async (req, res)=>{
    try{
        const {pid, quantity}=req.body;
        const addCart= await cartManager.addCart(pid, quantity);
        
        res.status(200).json(addCart)
    }catch(err){
        res.status(500).json({message: "Theres an error in the server"});
    }
});
cartsRoute.get('/:cid', async (req, res)=>{
    try{
        const getsCart= await cartManager.getCart(req.params.cid);
        res.status(200).json(getsCart)

    }catch(err){
        res.status(500).json({message:"Theres an error in the server"})

    }
})
cartsRoute.post('/:cid/product/:pid', async (req, res)=>{
    try{
        const cartsAndProduct= await cartManager.addProducts(req.params.cid, req.params.pid, req.body.quantity);
        res.status(200).json(cartsAndProduct);

    }catch(err){
        res.status(500).json({error: err.message})

    }
})

module.exports = cartsRoute;
