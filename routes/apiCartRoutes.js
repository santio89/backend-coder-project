const express = require("express");
const router = express.Router();
const {getAllProductsByCartId, postProductByCartId, postCart, deleteCartById, deleteProductByCartId} = require("../controllers/apiCartController");

/* ruteo */
router.post("/", postCart)
router.delete("/:id", deleteCartById)
router.get("/:id/productos", getAllProductsByCartId)
router.post("/:id/productos", postProductByCartId)
router.delete("/:id/productos/:id_prod", deleteProductByCartId)


module.exports = router;