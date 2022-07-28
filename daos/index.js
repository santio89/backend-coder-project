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
    ProductoDao = new ContenedorFS("./other-dbs/fs-db/products.json", "./other-dbs/fs-db/productIds.json", "./other-dbs/fs-db/deletedProducts.json", "producto");
    CarritoDao = new ContenedorFS("./other-dbs/fs-db/carts.json", "./other-dbs/fs-db/cartIds.json", "./other-dbs/fs-db/deletedCarts.json", "carrito");
    ProductoDao.init("Productos")
    CarritoDao.init("Carritos")

    break;
}

export { ProductoDao, CarritoDao };