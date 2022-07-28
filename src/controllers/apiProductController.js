/* contenedor principal de productos */
import { ProductoDao as contenedorProducts } from "../daos/index.js";


const getAllProducts = async (req, res) => {
    res.json(await contenedorProducts.getAll());
}

const getProductById = async (req, res) => {
    if (req.params.id) {
        res.json(await contenedorProducts.getById(req.params.id));
    } else {
        getAllProducts(req, res);
    }

}

const postProduct = async (req, res) => {
    res.json(await contenedorProducts.save(req.body))
}

const putProduct = async (req, res) => {
    res.json(await contenedorProducts.saveById(req.params.id, req.body));
}

const deleteProductById = async (req, res) => {
    res.json(await contenedorProducts.deleteById(req.params.id));
}


export { contenedorProducts, getAllProducts, getProductById, postProduct, putProduct, deleteProductById }