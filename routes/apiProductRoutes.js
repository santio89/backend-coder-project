const express = require("express");
const router = express.Router();
const {getAllProducts, getProductById, postProduct, putProduct, deleteProductById} = require("../controllers/apiProductController");
const ADMIN = true;

const checkAdmin = (req,res,next)=>{
    if (ADMIN === true){
        next();
    } else{
        res.json({error: -1, descripcion: `Ruta '${req.route.path}' Método '${req.route.stack[0].method}' - No Autorizada`})
    }
}

/* ruteo */
router.get("/", getAllProducts)
router.get("/:id", getProductById)
router.post("/", checkAdmin, postProduct)
router.put("/:id", checkAdmin, putProduct)
router.delete("/:id", checkAdmin, deleteProductById)

module.exports = router;