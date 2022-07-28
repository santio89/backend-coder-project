/* contenedor principal de carritos */
import { contenedorProducts } from "./apiProductController.js"
import { CarritoDao as contenedorCarts } from "../daos/index.js";


/* add new cart */
const postCart = async (req, res) => {
    res.json(await contenedorCarts.save({ objType: "cart" }))
}

/* delete cart */
const deleteCartById = async (req, res) => {
    /* empty cart first */
    await contenedorCarts.emptyCartById(req.params.id);
    res.json(await contenedorCarts.deleteById(req.params.id));
}

/* get products from cart id */
const getAllProductsByCartId = async (req, res) => {
    res.json(await contenedorCarts.getAllByCartId(req.params.id))
}

/* add new product to cart */
const postProductByCartId = async (req, res) => {
    try {
        const producto = await contenedorProducts.getById(req.params.id_prod);
        if (producto.error) {
            res.json(producto)
        } else {
            res.json(await contenedorCarts.saveByCartId(req.params.id, producto, req.params.id_prod))
        }
    } catch (err) {
        console.log("Error guardando en carro: ", err)
    }
}

/* delete product from cart */
const deleteProductByCartId = async (req, res) => {
    res.json(await contenedorCarts.deleteByCartId(req.params.id, req.params.id_prod))
}


export { contenedorCarts, getAllProductsByCartId, postProductByCartId, postCart, deleteCartById, deleteProductByCartId }