import express from "express";
import {default as apiProductRoutes} from "./routes/apiProductRoutes.js"
import {default as apiCartRoutes} from "./routes/apiCartRoutes.js"
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 8080;
const app = express();

/* post url encode */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* routes main */
app.use("/api/productos", apiProductRoutes)
app.use("/api/carrito", apiCartRoutes)

/* not found */
app.use((req, res) => {
    res.status(404).json({error: -2, descripcion: `Ruta '${req.path}' Método '${req.method}' - No Implementada`});
})

// error handler
app.use(function (err, req, res, next) {
    res.status(500).json({
        error: err.message,
    });
});

/* start server */
app.listen(port, (err) => {
    if (!err) {
        console.log(`El servidor se inicio en el puerto ${port}`)
    } else {
        console.log(`Hubo un error al iniciar el servidor: `, err)
    }
})