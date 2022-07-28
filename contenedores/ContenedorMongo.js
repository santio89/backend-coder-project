import mongoose from "mongoose";
import dbConfig from "../dbConfig.js";

await mongoose.connect(dbConfig.mongodb.connectionString);
console.log("Conexión establecida con Mongo")

class ContenedorMongo {
    constructor(collectionName, schema) {
        this.collection = mongoose.model(collectionName, new mongoose.Schema(schema));
    }

    /* guarda producto en contenedor productos, o guarda cart en contenedor carts  */
    async save(objeto) {
        objeto.timestamp = Date.now();
        const objetoModel = new this.collection(objeto)

        try {
            const obj = await objetoModel.save()
            return { success: `Cargado con id ${obj._id}` };
        } catch (err) {
            console.log("error guardando. Code: ", err);
        }
    }

    /* actualiza producto en contenedor productos */
    async saveById(id, objeto) {
        objeto._id = id;
        objeto.timestamp = Date.now();
        const objetoModel = new this.collection(objeto)
        objetoModel.isNew = false;

        try {
            await objetoModel.save();
            return { success: `Producto con id ${id} actualizado` }
        } catch (err) {
            return {error: "Producto no encontrado o Schema invalido. Ingresar ID correctamente y seguir Schema (nombre, precio, thumbnail)"}

          /*   console.log(err["errors"])
            switch(err["errors"]){
                case 'required':
                    return {error: "Seguir Schema: 'nombre, precio, thumbnail'"}
                case 'ObjectId':
                    return {error: `Producto de id ${id} no encontrado`}
                default: 
                    console.log("error actualizando producto por id. Code: ", err)
            } */
        }
    }

    /* retorna producto del contenedor productos, o retorna cart del contenedor carts */
    async getById(id) {
        try {
            const validId = mongoose.isValidObjectId(id);
            if (validId) {
                const object = await this.collection.findOne({ _id: id }, { __v: 0 });
                return (object ? object : { error: `id ${id} no encontrado` });
            } else {
                return { error: `id ${id} no encontrado` }
            }

        } catch (err) {
            console.log("error buscando por id: ", err)
        }

    }

    /* retorna todos los productos del contenedor productos, o retorna todos los carts del contenedor carts */
    async getAll() {
        try{
            const objetos = await this.collection.find({}, { __v: 0 })
            return objetos;
        } catch(err){
            return {error: "error buscando en coleccion"};
        }
    }

    /* elimina un producto del contenedor productos, o elimina un cart del contenedor carts */
    async deleteById(id) {
        try {
            const validUserId = mongoose.isValidObjectId(id);
            if (validUserId) {
                const del = await this.collection.deleteOne({ _id: id })
                return (del.deletedCount > 0 ? { success: `id ${id} eliminado` } : { error: `id ${id} no encontrado` })
            } else {
                return { error: `id ${id} no encontrado` }
            }
        } catch (err) {
            console.log("error borrando por id: ", err)
        }
    }

    /* elimina productos del contenedor productos*/
    async deleteAll() {
        try {
            await this.collection.deleteMany({})
            return { success: "collecion vaciada" }
        } catch (err) {
            console.log("error vaciando coleccion: ", err)
        }
    }

    /* retorna todos los productos del carro */
    async getAllByCartId(id) {
        const cart = await this.collection.findOne({ _id: id }, { __v: 0 })
        if (cart === null){
            return {error: `carrito de id ${id} no encontrado`}
        } 
        return (cart?.productos?.length > 0 ? cart.productos : [])
    }

    /* guarda producto en carro */
    async saveByCartId(cartId, producto) {
        try {
            const objetoCart = await this.getById(cartId);
            if (objetoCart.error) {
                return { error: `Carrito de id ${cartId} no encontrado` }
            } else {
                objetoCart.productos.push(producto);
                const objetoModel = new this.collection(objetoCart)
                try {
                    await objetoModel.save();
                    return { success: `Producto de id ${producto._id} agregado al cart de id ${cartId}` }
                } catch (err) {
                    console.log("error guardando producto en carrito: ", err)
                }
            }
        } catch (err) {
            console.log("eror guardando en carrito: ", err)
        }
    }

    /* elimina producto de carro */
    async deleteByCartId(cartId, prodId) {
        try {
            const cart = await this.getById(cartId)

            if (cart.error) {
                return { error: `Carrito de id ${cartId} no encontrado` }
            } else {
                const productos = [] && cart.productos;
                const index = productos.findIndex(producto => producto._id == prodId);

                if (index != -1) {
                    productos.splice(index, 1)
                    cart.productos = productos;
                    const objetoModel = new this.collection(cart);
                    objetoModel.isNew = false;

                    try {
                        await objetoModel.save()
                        return { success: `Producto de ID ${prodId} eliminado del carrito de ID ${cartId}` }
                    } catch (err) {
                        console.log("error eliminando producto del carrito: ", err)
                    }
                } else {
                    return { error: `Producto de ID ${prodId} no encontrado en el carrito de ID ${cartId}` }
                }
            }
        } catch(err){
            console.log("error eliminando producto del carrito: ",err)
        }
    }

    /* vacia carro */
    async emptyCartById(id) {
        try {
            const cart = await this.getById(id);
            if (cart.error) {
                return { error: `Carrito de id ${id} no encontrado` }
            } else {
                cart.productos = [];
                const objetoModel = new this.collection(cart)
                try {
                    await objetoModel.save();
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

export default ContenedorMongo;