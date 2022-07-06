/* contenedor principal de productos */
const Contenedor = require("../Contenedor");
const contenedorCarts = new Contenedor("./db/carts.txt", "./db/cartIds.txt", "./db/deletedCarts.txt", "Carrito");
const {contenedorProducts} = require("./apiProductController")
contenedorCarts.init("Carritos");

/* add new cart */
const postCart = async (req, res) => {
    res.json(await contenedorCarts.save({ objType: "cart" }))
}

/* empty cart */
const emptyByCartId = async (req, res) => {
    const index = contenedorCarts.products.findIndex(producto => producto.id == req.params.id)
    if (index != -1) {
        await contenedorCarts.emptyCartById(index, req.params.id);
    } else {
        res.json({ error: `No se encontró el cart con ID ${req.params.id}` })
    }
}

/* delete cart */
const deleteCartById = async (req, res) => {
    await emptyByCartId(req, res);
    res.json(await contenedorCarts.deleteById(Number(req.params.id)));
}

/* get products from cart id */
const getAllProductsByCartId = (req, res) => {
    const index = contenedorCarts.products.findIndex(producto => producto.id == req.params.id)
    if (index != -1) {
        res.json(contenedorCarts.getAllByCartId(index))
    } else {
        res.json({ error: `No se encontró el cart con ID ${req.params.id}` })
    }
}

/* add new product to cart */
const postProductByCartId = async (req, res) => {
    const index = contenedorCarts.products.findIndex(producto => producto.id == req.params.id)

    if (index != -1) {
        const product = contenedorProducts.getById(req.body.productId);
        if (product.error){
            res.status(400).json(product)
        } else{
            res.json(await contenedorCarts.saveByCartId(index, product))
        }
    } else {
        res.json({ error: `No se encontró el cart con ID ${req.params.id}` })
    }
}

/* delete product from cart */
const deleteProductByCartId = async (req, res) => {
    const index = contenedorCarts.products.findIndex(producto => producto.id == req.params.id)

    if (index != -1) {
        res.json(await contenedorCarts.deleteByCartId(index, req.params.id_prod, req.params.id))
    } else {
        res.json({ error: `No se encontró el cart con ID ${id}` })
    }
}


module.exports = { contenedorCarts, getAllProductsByCartId, postProductByCartId, postCart, deleteCartById, deleteProductByCartId }