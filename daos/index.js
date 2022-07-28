import dotenv from "dotenv";
dotenv.config();

let ProductoDao;
let CarritoDao;

switch (process.env.DATABASE) {

  case "FIREBASE":
    const { default: ProductoDaoFirebase } = await import(
      "./productos/productoDaoFirebase.js"
    );
    const { default: CarritoDaoFirebase } = await import(
      "./carritos/carritoDaoFirebase.js"
    );

    ProductoDao = new ProductoDaoFirebase();
    CarritoDao = new CarritoDaoFirebase();

    break;

  case "MONGO":
    const { default: ProductoDaoMongo } = await import(
      "./productos/productoDaoMongo.js"
    );
    const { default: CarritoDaoMongo } = await import(
      "./carritos/carritoDaoMongo.js"
    );

    ProductoDao = new ProductoDaoMongo();
    CarritoDao = new CarritoDaoMongo();

    break;

  case 'FS':
    const { default: ContenedorFS } = await import("../contenedores/ContenedorFS.js")
    ProductoDao = new ContenedorFS("./fs-db/products.json", "./fs-db/productIds.json", "./fs-db/deletedProducts.json", "producto");
    CarritoDao = new ContenedorFS("./fs-db/carts.json", "./fs-db/cartIds.json", "./fs-db/deletedCarts.json", "carrito");
    ProductoDao.init("Productos")
    CarritoDao.init("Carritos")

    break;
}

export { ProductoDao, CarritoDao };