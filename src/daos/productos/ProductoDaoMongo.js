import ContenedorMongo from "../../contenedores/ContenedorMongo.js";

class ProductoDaoMongo extends ContenedorMongo {
  constructor() {
    super("productos", {
      nombre: { type: String, required: true },
      precio: { type: Number, required: true },
      thumbnail: { type: String, required: true },
      timestamp: { type: Number, required: true }
    });
  }
}

export default ProductoDaoMongo;