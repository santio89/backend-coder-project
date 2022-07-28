import express from "express";
const router = express.Router();
import { getAllProductsByCartId, postProductByCartId, postCart, deleteCartById, deleteProductByCartId } from "../controllers/apiCartController.js"

/* ruteo */
router.post("/", postCart)
router.delete("/:id", deleteCartById)
router.get("/:id/productos", getAllProductsByCartId)
router.post("/:id/productos/:id_prod", postProductByCartId)
router.delete("/:id/productos/:id_prod", deleteProductByCartId)


export default router;