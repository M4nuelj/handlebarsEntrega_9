const express=require("express");
const app=express();
const port=8080;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const viewsRouter= require( './routes/views-router.js');
const { __dirname, __filename } = require('./utils.js') ;
const handlebars = require('express-handlebars') ;
const http = require('http') ;
const { Server: SocketServer } = require('socket.io');
const io = new SocketServer(httpServer);

const productRoute=require('./routes/products.route');
app.use('/api/products', productRoute);

const cartsRoute=require('./routes/carts.route');
app.use('/api/carts', cartsRoute);

app.listen(port,()=>{
    console.log(`Server runing in the PORT http://localhost:${port}`)
});

const serverConnected = httpServer.listen(port, ()=> console.log(`Server listening on port: ${port}`));

serverConnected.on('error', error => console.log(`Server error: ${error}`))

io.on('connection', (socket)=> {
    console.log(`New Client Connection with ID: ${socket.id}`);
    
    socket.on('msg_from_client_to_server', async (newProduct)=>{
        try{
            await productManager.addProduct(newProduct);
            const productList = await productManager.getProducts();
           
            io.emit("updatedProducts", {productList})
        }
        catch (error) {
            console.log(error);
        }
    })
    socket.on('deleteProduct', async (id) => {
        try {
        const parsedId = parseInt(id, 10);
        await productManager.deleteProduct(parsedId);
        socket.emit('productDeleted', { message: 'Producto eliminado exitosamente' });
        const productList = await productManager.getProducts();
        io.emit('updatedProducts', { productList });
        } catch (error) {
        console.error('Error al eliminar el producto:', error);
        socket.emit('productDeleteError', { error: 'Ocurrió un error al eliminar el producto' });
        }
    });
});


app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');


app.use(express.static(__dirname+'/public'));
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', prodsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); 
app.use('/realTimeProducts', viewsRouter); 
app.get('*',(req, res)=>{
    return res.status(404).json({
        status: 'error',
        msg: 'Route not found'
    });
});