const express = require("express");
const router = express.Router();
const {getAllProducts, getProductById, postProduct, putProduct, deleteProductById} = require("../controllers/apiProductController");
const checkAdminUtil = require("../utils/checkAdmin")

const ADMIN = true;
const checkAdmin = checkAdminUtil(ADMIN);

/* ruteo */
/* id? -> si existe id, busca id. si no existe id, busca todos */
router.get("/:id?", getProductById) 
router.post("/", checkAdmin, postProduct)
router.put("/:id", checkAdmin, putProduct)
router.delete("/:id", checkAdmin, deleteProductById)

module.exports = router;