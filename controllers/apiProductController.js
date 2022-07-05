/* contenedor principal de productos */
const Contenedor = require("../Contenedor");
const contenedorProducts = new Contenedor("./products.txt", "./productIds.txt", "./deletedProducts.txt");
contenedorProducts.init("Productos");


const getAllProducts = (req, res)=>{
    res.json(contenedorProducts.getAll());
}

const getProductById = (req, res)=>{
    res.json(contenedorProducts.getById(Number(req.params.id)));
}

const postProduct = async (req, res)=>{
    res.json(await contenedorProducts.save(req.body))
}

const putProduct = async (req, res)=>{
    res.json(await contenedorProducts.saveById(Number(req.params.id), req.body));
}

const deleteProductById = async (req, res)=>{
    res.json(await contenedorProducts.deleteById(Number(req.params.id)));
}


module.exports = {contenedorProducts, getAllProducts, getProductById, postProduct, putProduct, deleteProductById}