import express from 'express';
const productsRouter=express.Router();
import {v4 as uuidv4} from 'uuid';
import {ProductManager} from '../products.js';
const productManager= new ProductManager("products.json");

productsRouter.get('/', async(req, res)=>{
    try{
        const products= await productManager.getProduct();
        const limit= req.query.limit;
        if(!limit){
            return res.status(200).json(products);
        }else{
            return res.status(200).json(products.slice(0, limit));
        }

    }catch(err){
        return res.status(400).json({message: "We are having an error"})
    }


})

productsRouter.get('/:pid', async(req, res)=>{
    try{
        const id= req.params.pid;
        const products= await productManager.getProductById(id);
        if(!products){
            return res.status(400).json("Product not found");
        } else {
            return res.status(200).json(products);
        }


    }catch(err){
        return res.status(400).json({message: "We have had issues with our server"})

    }
});

productsRouter.post('/', async(req, res)=>{
    try{
        const {title,description,  code, price, stock, category, thumbnail}=req.body;
        const add_Produts={id:uuidv4(), title, description, code, price, stock, category, thumbnail:thumbnail || []};
        const productCreated = await productManager.postProduct(add_Produts);
        return res.status(200).json(productCreated);

    }catch(err){
        return res.status(500).json({error:err.message})
    };
});

productsRouter.put('/:pid', async(req, res)=>{
    const productId= req.params.pid;
    const update= req.body;
    try{
        const updateP= await productManager.updateProduct(productId, update);
        return res.status(200).json(updateP);
        
    }catch(err){
        return res.status(400).json({error:err.message});
    }

}
)
productsRouter.delete('/:pid', async(req, res)=>{
    const productId=req.params.pid;
    try{
        if(!productId){
            return "The product selected was not found"
            

        }else{
            const deleteProduct= await productManager.deleteProduct(productId);
            return res.status(200).json(deleteProduct)
        }
    }catch(err){
        return res.status(400).json({error:err.message})
    }



});
module.exports=productsRouter



