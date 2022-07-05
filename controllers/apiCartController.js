/* contenedor principal de productos */
const Contenedor = require("../Contenedor");
const contenedorCarts = new Contenedor("./carts.txt", "./cartIds.txt", "./deletedCarts.txt");
const {contenedorProducts} = require("./apiProductController")
contenedorCarts.init("Carritos");

/* add new cart */
const postCart = async (req, res) => {
    res.json(await contenedorCarts.save({ objType: "cart" }))
}

/* delete cart */
const deleteCartById = async (req, res) => {
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
            res.json(product)
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

/* empty cart */
const emptyByCartId = async (req, res) => {
    const index = contenedorCarts.products.findIndex(producto => producto.id == req.params.id)

    if (index != -1) {
        res.json(await contenedorCarts.products[index].deleteAll())
    } else {
        res.json({ error: `No se encontró el cart con ID ${id}` })
    }
}


module.exports = { contenedorCarts, getAllProductsByCartId, postProductByCartId, postCart, deleteCartById, deleteProductByCartId }