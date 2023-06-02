import fs from 'fs';

class ProductManager{
    
    static #id=0;

    constructor(path){
        this.path=path;
        this.products=[];
    }
    

    async loadData(){
        if(!fs.existsSync(this.path)){

            await fs.promises.writeFile(this.path, JSON.stringify(this.products));
        }else{
            this.products=JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            ProductManager.#id=this.products[this.products.length-1]?.id||0;
        }
    }


    async postProduct(product){
        await this.loadData();
        const verify = this.products.find((cod)=>cod.code===product.code);
        if(verify!=undefined){
            return 'The product code already exist'
        }
        if(!product.title||
            !product.description||
            !product.price||
            !product.thumbnail||
            !product.code||
            !product.stock
        ){
            return 'You must add the complete imformation about the product'
        };
        this.products.push({id: ProductManager.#id+1, ...product});
        ProductManager.#id++
        await fs.promises.writeFile(this.path, JSON.stringify(this.products,null,2))
        return product;
    }
    async getProduct(){
        await this.loadData();
        return this.products.length > 0 ? this.products : "No products loaded in the database"
    }
    async getProductById(id) {
        await this.loadData();
        const product = this.products.find((p) => p.id == id);
        if (!product) {
          return 'The product was not found with the id: ' + id;
        }
        return product;
      }
    async updateProduct(id, changes){

        try{
            const products= await this.getProduct();
            const findProducts= products.findIndex((product)=>product.id===id);
            
            if(findProducts === -1) {
                throw new Error ( 'The product was not found');
            }
            const productFound=products[findProducts];
            const productUpdated={...productFound, ...changes};
            products[findProducts]=productUpdated;
            
            await fs.promises.writeFile(this.path, JSON.stringify(products,null,2));

        }catch(err){
            throw new Error ('The update product did not go through')
        }; 

    }
    async deleteProduct(id){
        try{
            const products = await this.getProduct();
            const findProducts=products.some((product)=>product.id===id);

            if(!findProducts){
                return 'The id selected was not found'
            }
            const newProduct=products.filter((product)=>product.id!==id);
            await fs.promises.writeFile(this.path, JSON.stringify(newProduct, null, 2))
        }catch(err){
            throw new Error('The delete method did not go through');

        };
       


    };

};

module.exports={ProductManager};