/* contenedor principal de productos */
const Contenedor = require("../Contenedor");
const contenedorCarts = new Contenedor("./carts.txt", "./cartIds.txt", "./deletedCarts.txt");
const contenedorProducts = require("./apiProductController")
contenedorCarts.init();

/* add new cart */
const postCart = (req, res)=>{
    res.json(contenedorCarts.save({objType: "cart"}).id)
}

/* delete cart */
const deleteCartById = (req, res)=>{
    res.json(contenedorCarts.deleteById(Number(req.params.id)));
}

/* get products from cart id */
const getAllProductsByCartId = (req, res)=>{
    const index = contenedorCarts.products.findIndex(producto => producto.id === req.params.id)
    
    if (index != -1) {
        res.json(contenedorCarts.products[index].getAll())
    } else {
        res.json({error: `No se encontró el cart con ID ${id}`})
    }
}

/* add new product to cart */
const postProductByCartId = (req, res)=>{
    const index = contenedorCarts.products.findIndex(producto => producto.id === req.params.id)

    if (index != -1) {
        const product = contenedorProducts.getById(req.body);
        res.json(contenedorCarts.products[index].save(product))
    } else {
        res.json({error: `No se encontró el cart con ID ${id}`})
    }
}

/* delete product from cart */
const deleteProductByCartId = (req, res)=>{
    const index = contenedorCarts.products.findIndex(producto => producto.id === req.params.id)

    if (index != -1) {
        res.json(contenedorCarts.products[index].deleteById(req.params.id_prod))
    } else {
        res.json({error: `No se encontró el cart con ID ${id}`})
    }
}

/* empty cart */
const emptyByCartId = (req, res)=>{
    const index = contenedorCarts.products.findIndex(producto => producto.id === req.params.id)

    if (index != -1) {
        res.json(contenedorCarts.products[index].deleteAll())
    } else {
        res.json({error: `No se encontró el cart con ID ${id}`})
    }
}


module.exports = {contenedorCarts, getAllProductsByCartId, postProductByCartId, postCart, deleteCartById, deleteProductByCartId}