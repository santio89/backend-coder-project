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
            const removedItem = this.products.splice(index, 1);
            const removedItems = []

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

    /* init - carga productos del archivo */
    async init() {
        try {
            this.products = JSON.parse(await fs.promises.readFile(this.productsFile, "utf-8"));
            this.productIds = JSON.parse(await fs.promises.readFile(this.productIdsFile, "utf-8"));

            /*  CARGO ALGUNOS PRODUCTOS MANUAL, UNICA VEZ        
                    await this.save({ title: "Trainspotting", price: 20, thumbnail: "https://www.ocimagazine.es/wp-content/uploads/2021/06/trainspotting-cartel.jpg" })
                    await this.save({ title: "2001: A Space Odyssey", price: 15, thumbnail: "https://upload.wikimedia.org/wikipedia/en/thumb/1/11/2001_A_Space_Odyssey_%281968%29.png/220px-2001_A_Space_Odyssey_%281968%29.png" })
                    await this.save({ title: "Friday de 13th I", price: 12, thumbnail: "https://horrornews.net/wp-content/uploads/2018/11/friday-the-13th-movie-poster-1980.jpg" }) */

            console.log("Productos cargados");
        } catch (err) {
            console.log("Error cargando productos. Code: ", err);
        }
    }
}

module.exports = ContenedorProducts;