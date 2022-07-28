import { timeStamp } from "console";
import { default as fs } from "fs"

console.log("Usando File System")

class ContenedorProducts {
    constructor(productsFile, idsFile, deletedFile, type) {
        this.productsFile = productsFile;
        this.productIdsFile = idsFile;
        this.deleted = deletedFile;
        this.products = [];
        this.productIds = [];
        this.type = type;
    }

    /* guarda producto en contenedor productos, o guarda cart en contenedor carts */
    async save(objeto) {
        objeto.timestamp = Date.now();
        objeto.objType === "cart" ? objeto.cartList = [] : [];
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
            console.log("producto cargado");

            return objeto;
        } catch (err) {
            console.log("error guardando producto. Code: ", err);
        }
    }

    /* actualiza producto en contenedor productos */
    async saveById(id, objeto) {
        const index = this.products.findIndex(producto => producto.id == id)
        if (index != -1) {
            objeto.timestamp = Date.now();
            objeto.id = id;
            this.products[index] = objeto;

            try {
                await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products));
            } catch (err) {
                console.log("error guardando producto por id. Code: ", err)
            }

            return this.products[index];
        } else {
            return { error: `producto con id ${id} no encontrado` }
        }
    }

    /* retorna producto del contenedor productos, o retorna cart del contenedor carts */
    getById(id) {
        const objeto = this.products.find(producto => producto.id == id);
        return (objeto ? objeto : { error: `producto con id ${id} no encontrado` });
    }

    /* retorna todos los productos del contenedor productos */
    getAll() {
        return (this.products);
    }

    /* eliminar un producto del contenedor productos, elimina un cart del contenedor carts */
    async deleteById(id) {
        const index = this.products.findIndex(producto => producto.id == id)
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
                    console.log("error eliminando por id. Code: ", err)
                }
            }
            return { success: `${this.type} con id ${id} eliminado` }
        } else {
            return { error: `${this.type} con id ${id} no encontrado` }
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
                console.log("error eliminando por id. Code: ", err)
            }
        }
        return { success: `producto con id ${id} eliminado` }
    }

    /* retorna todos los productos del carro */
    getAllByCartId(cartId) {
        const index = this.products.findIndex(producto => producto.id == cartId)

        if (index != -1) {
            return (this.products[index]?.cartList)
        } else {
            return { error: `carrito de id ${cartId} no encontrado` }
        }
    }

    /* guarda producto en carro */
    async saveByCartId(cartId, product) {
        const index = this.products.findIndex(producto => producto.id == cartId)

        if (index != -1) {
            this.products[index].cartList.push(product);

            try {
                await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products));
                return product
            } catch (err) {
                console.log("error guardando producto en carrito: ", err)
            }
        } else {
            return { error: `carrito de id ${cartId} no encontrado` }
        }
    }

    /* elimina producto de carro */
    async deleteByCartId(cartId, prodId) {
        const cartIndex = this.products.findIndex(producto => producto.id == cartId)

        if (cartIndex != -1) {
            const index = this.products[cartIndex].cartList.findIndex(producto => producto.id == prodId);

            if (index != -1) {
                this.products[cartIndex].cartList.splice(index, 1);
                try {
                    await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
                    return { success: `producto de id ${prodId} eliminado del carrito de id ${cartId}` }
                } catch (err) {
                    console.log("error eliminando producto de carrito: ", err)
                }
            } else {
                return { error: `producto de id ${prodId} no encontrado en el carrito de id ${cartId}` }
            }
            try {
                await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products));
                return product
            } catch (err) {
                console.log("error guardando producto en carrito: ", err)
            }
        } else {
            return { error: `carrito de id ${cartId} no encontrado` }
        }


    }

    async emptyCartById(cartId) {
        /* aqui podria hacer un loop for del cartList para retornar el stock, antes de vaciar el array */
        const index = this.products.findIndex(producto => producto.id == cartId)

        if (index != -1) {
            this.products[index].cartList = []

            try {
                await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
    
                return { success: `carrito de id ${cartId} vaciado` }
            } catch (err) {
                console.log("error vaciando carrito, ", err)
            }
        } else {
            return { error: `carrito de id ${cartId} no encontrado` }
        }
    }

    /* init - carga productos del archivo */
    async init(items) {
        try {
            this.products = JSON.parse(await fs.promises.readFile(this.productsFile, "utf-8"));
            this.productIds = JSON.parse(await fs.promises.readFile(this.productIdsFile, "utf-8"));

            console.log(`${items} cargados`);
        } catch (err) {
            console.log(`error cargando ${items}. Code: `, err);
        }
    }
}

export default ContenedorProducts;