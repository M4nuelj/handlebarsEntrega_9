const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    async loadCart() {
        if (!fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
        } else {
            this.carts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        }

    }
    async addCart(pid, quantity) {
        await this.loadCart();
        const products = [];
        products.push({ pid, quantity })
        const postCart = { id: uuidv4(), products: products };
       

        this.carts.push(postCart);
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        return postCart;


    }
    async getCart(Cid) {
        try {
            const cartId = await this.carts.find((cart) => cart.id === Cid);
            return cartId;

        } catch (err) {
            throw new Error("The cart id was not found")
        }

    }

    async addProducts(Cid, productId, quantity) {

        const getCarts = await this.getCart(Cid);
        const productsId = getCarts.products.findIndex(p => p.product === productId);
        if (productsId === -1) {
            getCarts.products.push({ product: productId, quantity: 1 })
        } else {
            getCarts.products[productsId].quantity += quantity;
        }
        await this.loadCart();
        return getCarts;


    }

}

module.exports = CartManager;