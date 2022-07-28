import admin from "firebase-admin";
import dbConfig from "../dbConfig.js";

admin.initializeApp({
    credential: admin.credential.cert(dbConfig.firebase),
});

const db = admin.firestore();
console.log("Conexión establecida con Firebase")

class ContenedorFirebase {
    constructor(collectionName) {
        this.collection = db.collection(collectionName)
    }

    /* guarda producto en contenedor productos, o guarda cart en contenedor carts */
    async save(objeto) {
        objeto.timestamp = Date.now();

        try {
            await this.collection.doc().create(objeto)

            return { success: `Cargado correctamente` };
        } catch (err) {
            console.log("error guardando. Code: ", err);
        }
    }

    /* actualiza producto en contenedor productos */
    async saveById(id, objeto) {
        try {
            await this.collection.doc(id).update(objeto)
            return { success: `Producto con id ${id} actualizado` }
        } catch (err) {
            if (err.code === 5) {
                return { error: `Producto de id ${id} no encontrado` }
            } else {
                console.log("error actualizando producto por id. Code: ", err)
            }
        }
    }

    /* retorna producto del contenedor productos, o retorna cart del contenedor carts */
    async getById(id) {
        try {
            const object = await this.collection.doc(id).get()
            return (object && object.data() ? object.data() : { error: `Producto de id ${id} no encontrado` });

        } catch (err) {
            console.log("error buscando producto por id: ", err)
        }
    }

    /* retorna todos los productos del contenedor productos, o retorna todos los carts del contenedor carts */
    async getAll() {
        try {
            const objetos = await this.collection.get()

            const arrayEncontrado = objetos.docs.map(objeto => ({
                _id: objeto.id,
                ...objeto.data()
            }))

            return arrayEncontrado;
        } catch (err) {
            console.log("error buscando en coleccion: ", err)
            return { error: "error buscando en coleccion" };
        }
    }

    /* elimina un producto del contenedor productos, o elimina un cart del contenedor carts */
    async deleteById(id) {
        try {
            await this.collection.doc(id).delete({ exists: true })
            return { success: `Producto de id ${id} eliminado` }

        } catch (err) {
            if (err.code === 5) {
                return { error: `Producto de id ${id} no encontrado` }
            }
            console.log("error buscando producto por id: ", err)
        }
    }

    /* elimina productos del contenedor productos*/
    async deleteAll() {
        try {
            const productos = await this.getAll()
            productos.forEach(async producto=>{
                await this.collection.doc(producto._id).delete()
            })

            return { success: "collecion vaciada" }

        } catch (err) {
            console.log("error vaciando coleccion: ", err)
        }
    }

    /* retorna todos los productos del carro */
    async getAllByCartId(id) {
        const cart = await this.collection.doc(id).get()
        return (cart?.productos?.length > 0 ? cart.productos : [])
    }

    /* guarda producto en carro */
    async saveByCartId(cartId, producto, prodId) {
        try {
            const objetoCart = await this.getById(cartId);
            if (objetoCart.error) {
                return { error: `Carrito de id ${cartId} no encontrado` }
            } else {
                producto._id = prodId;
                objetoCart.productos?objetoCart.productos.push(producto):objetoCart.productos=[];
                
                try {
                    await this.collection.doc(cartId).update(objetoCart)
                    return { success: `Producto de id ${prodId} agregado al cart de id ${cartId}` }
                } catch (err) {
                    console.log("error guardando producto en carrito: ", err)
                }
            }
        } catch (err) {
            console.log("error guardando en carrito: ", err)
        }
    }

    /* elimina producto de carro */
    async deleteByCartId(cartId, prodId) {
        try {
            const cart = await this.getById(cartId)

            if (cart.error) {
                return { error: `Carrito de id ${cartId} no encontrado` }
            } else {
                cart.productos = [] && cart.productos
                const index = cart.productos.findIndex(producto => producto._id == prodId);
                
                if (index != -1) {
                    cart.productos.splice(index, 1)

                    try {
                        await this.collection.doc(cartId).update({productos: cart.productos})
                        return { success: `Producto de ID ${prodId} eliminado del carrito de ID ${cartId}` }
                    } catch (err) {
                        console.log("error eliminando producto del carrito: ", err)
                    }
                } else {
                    return { error: `Producto de ID ${prodId} no encontrado en el carrito de ID ${cartId}` }
                }
            }
        } catch (err) {
            console.log("error eliminando producto del carrito: ", err)
        }
    }

    /* vacia carro */
    async emptyCartById(id) {
        try {
            const objetoCart = await this.getById(id);
            if (objetoCart.error) {
                return { error: `Carrito de id ${cartId} no encontrado` }
            } else {
                objetoCart.productos=[];
                
                try {
                    await this.collection.doc(id).update(objetoCart)
                    return { success: `Carrito de id ${id} vaciado` }
                } catch (err) {
                    console.log("error vaciando carrito: ", err)
                }
            }
        } catch (err) {
            console.log("error vaciando carrito: ", err)
        }
    }
}

export default ContenedorFirebase;