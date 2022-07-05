const fs = require("fs");

class ContenedorProducts {
    constructor(productsFile, idsFile, deletedFile) {
        this.productsFile = productsFile;
        this.productIdsFile = idsFile;
        this.deleted = deletedFile;
        this.products = [];
        this.productIds = [];
    }

    /* guarda producto en contenedor productos, o guarda cart en contenedor carts */
    async save(objeto) {
        objeto.timestamp = Date.now();
        objeto.objType?objeto.cartList=[]:[];
        try {
            /* busco id en archivo */
            if (this.productIds.length === 0) {
                this.productIds.push(1);
                objeto.id = 1;
            } else {
                this.productIds.push(this.productIds[this.productIds.length - 1] + 1);
                objeto.id = this.productIds[this.productIds.length - 1];
            }

            await fs.promises.writeFile(this.productIdsFile, JSON.stringify(this.productIds));
            this.products.push(objeto)
            await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
            console.log("Producto cargado");
           
            return objeto;
        } catch (err) {
            console.log("Error guardando objeto en el fs. Code: ", err);
        }
    }

    /* actualiza producto en contenedor productos */
    async saveById(id, objeto) {
        const index = this.products.findIndex(producto => producto.id === id)
        if (index != -1) {
            objeto.timestamp = Date.now();
            objeto.id = id;
            this.products[index] = objeto;

            try {
                await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products));
            } catch (err) {
                console.log("Error guardando producto por ID. Code: ", err)
            }

            return this.products[index];
        } else {
            return { error: `No se encontró el producto con ID ${id}` }
        }
    }

    /* retorna producto del contenedor productos, o retorna cart del contenedor carts */
    getById(id) {
        const objeto = this.products.find(producto => producto.id === id);
        return (objeto ? objeto : { error: `No se encontró el producto con ID ${id}` });
    }

    /* retorna todos los productos del contenedor productos */
    getAll() {
        return (this.products);
    }

    /* eliminar un producto del contenedor productos, elimina un cart del contenedor carts */
    async deleteById(id) {
        const index = this.products.findIndex(producto => producto.id === id)
        if (index != -1) {
            const removedItem = this.products.splice(index, 1)[0];
            let removedItems = []

            try {
                removedItems = JSON.parse(await fs.promises.readFile(this.deleted, "utf-8"))
                removedItems.push(removedItem);
                await fs.promises.writeFile(this.deleted, JSON.stringify(removedItems));
                await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
            } catch (err) {
                if (err.code === 'ENOENT') {
                    await fs.promises.writeFile(this.deletedFile, JSON.stringify([removedItem]));
                } else {
                    console.log("Error eliminando por ID. Code: ", err)
                }
            }
            return { success: `Producto con ID ${id} eliminado` }
        } else {
            return { error: `No se encontró el producto con ID ${id}` }
        }
    }

    /* eliminar productos del contenedor productos*/
    async deleteAll() {
        const removedItem = this.products;
        const removedItems = [];
        this.products = [];

        try {
            removedItems = JSON.parse(await fs.promises.readFile(this.deleted, "utf-8"))
            removedItems.push(removedItem);
            await fs.promises.writeFile(this.deleted, JSON.stringify([removedItems]));
            await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
        } catch (err) {
            if (err.code === 'ENOENT') {
                await fs.promises.writeFile(this.deletedFile, JSON.stringify([removedItem]));
            } else {
                console.log("Error eliminando por ID. Code: ", err)
            }
        }
        return { success: `Producto con ID ${id} eliminado` }
    }

    /* retorna todos los productos del carro */
    getAllByCartId(index){
        return(this.products[index].cartList)
    }

    /* guarda producto en carro */
    async saveByCartId(index, product){
        this.products[index].cartList.push(product);
        
        try{
            await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products));
            return product
        } catch(err){
            console.log("Error guardando producto en carrito: ", err)
        }
        
    }

    /* elimina producto de carro */
    async deleteByCartId(indexCart, id, cartId){
        const index = this.products[indexCart].cartList.findIndex(producto=>producto.id == id);
        
        if (index != -1){
            this.products[indexCart].cartList.splice(index, 1);
            try{
                await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
                return {success: `Producto de ID ${id} eliminado del carrito de ID ${cartId}` }
            } catch(err){
                console.log("Error eliminando producto de carrito: ",err)
            }
        } else{
            return {error: `Producto de ID ${id} no encontrado en el carrito de ID ${cartId}`}
        }
        try{
            await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products));
            return product
        } catch(err){
            console.log("Error guardando producto en carrito: ", err)
        }
        
    }

    async emptyCartById(index, id){
        /* aqui podria hacer un loop for del cartList para retornar el stock, antes de vaciar el array */
        this.products[index].cartList = []

        try{
            await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
            
            return {success: `Carrito de id ${id} vaciado` }
        } catch(err){
            console.log("Error vaciando carrito, ", err)
        }
    }

    /* init - carga productos del archivo */
    async init(items) {
        try {
            this.products = JSON.parse(await fs.promises.readFile(this.productsFile, "utf-8"));
            this.productIds = JSON.parse(await fs.promises.readFile(this.productIdsFile, "utf-8"));

            console.log(`${items} cargados`);
        } catch (err) {
            console.log("Error cargando productos. Code: ", err);
        }
    }
}

module.exports = ContenedorProducts;