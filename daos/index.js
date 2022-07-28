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
}

export { ProductoDao, CarritoDao };