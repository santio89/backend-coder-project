import express from "express";
import { getProductById, postProduct, putProduct, deleteProductById } from "../controllers/apiProductController.js"
import { default as checkAdminUtil } from "../utils/checkAdmin.js"

const ADMIN = true;
const checkAdmin = checkAdminUtil(ADMIN);
const router = express.Router();

/* ruteo */
router.get("/:id?", getProductById)
router.post("/", checkAdmin, postProduct)
router.put("/:id", checkAdmin, putProduct)
router.delete("/:id", checkAdmin, deleteProductById)

export default router;