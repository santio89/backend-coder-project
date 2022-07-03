/* contenedor principal de productos */
const Contenedor = require("../ContenedorProducts");
const contenedorProducts = new Contenedor("./productos.txt");
contenedorProducts.init();


const getAllProducts = (req, res)=>{
    res.json(contenedorProducts.getAll());
}

const getProductById = (req, res)=>{
    res.json(contenedorProducts.getById(Number(req.params.id)));
}

const postProduct = (req, res)=>{
    res.json(contenedorProducts.save(req.body))
}

const putProduct = (req, res)=>{
    res.json(contenedorProducts.saveById(Number(req.params.id), req.body));
}

const deleteProductById = (req, res)=>{
    res.json(contenedorProducts.deleteById(Number(req.params.id)));
}

module.exports = {contenedorProducts, getAllProducts, getProductById, postProduct, putProduct, deleteProductById}