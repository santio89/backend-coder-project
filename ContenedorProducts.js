const fs = require("fs");

class ContenedorProducts {
    constructor(archivo) {
        this.archivo = archivo
        this.productos = [];
        this.ids = [];
    }

    async save(objeto) {
        try {
            /* busco id en archivo */
            if (this.ids.length === 0) {
                this.ids.push(1);
                objeto.id = 1;
            } else {
                this.ids.push(this.ids[this.ids.length - 1] + 1);
                objeto.id = this.ids[this.ids.length - 1];
            }

            await fs.promises.writeFile("./productIds.txt", JSON.stringify(this.ids));
            this.productos.push(objeto)
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos))
            console.log("Producto cargado");

            return objeto;
        } catch (err) {
            console.log("Error guardando objeto en el fs. Code: ", err);
        }
    }

    async saveById(id, objeto) {
        const index = this.productos.findIndex(producto => producto.id === id)
        if (index != -1) {
            objeto.id = id;
            this.productos[index] = objeto;

            try {
                await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos));
            } catch (err) {
                console.log("Error guardando producto por ID. Code: ", err)
            }

            return this.productos[index];
        } else {
            return { error: `No se encontró el producto con ID ${id}` }
        }
    }

    getById(id) {
        const objeto = this.productos.find(producto => producto.id === id);
        return (objeto ? objeto : { error: `No se encontró el producto con ID ${id}` });
    }

    getAll() {
        return (this.productos);
    }

    async deleteById(id) {
        const index = this.productos.findIndex(producto => producto.id === id)
        if (index != -1) {
            const removedItem = this.productos.splice(index, 1);
            const removedItems = []

            try {
                removedItems = JSON.parse(await fs.promises.readFile("./deletedProducts.txt", "utf-8"))
                removedItems.push(removedItem);
                await fs.promises.writeFile("./deletedProducts.txt", JSON.stringify([removedItems]));
                await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos))
            } catch (err) {
                if (err.code === 'ENOENT') {
                    await fs.promises.writeFile("./deletedProducts.txt.txt", JSON.stringify([removedItem]));
                } else {
                    console.log("Error eliminando por ID. Code: ", err)
                }
            }
            return { success: `Producto con ID ${id} eliminado` }
        } else {
            return { error: `No se encontró el producto con ID ${id}` }
        }
    }

    /* init - carga productos del archivo */
    async init() {
        try {
            this.productos = JSON.parse(await fs.promises.readFile(this.archivo, "utf-8"));
            this.ids = JSON.parse(await fs.promises.readFile("./productIds.txt", "utf-8"));

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