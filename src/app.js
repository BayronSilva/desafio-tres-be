import express from "express";
const app = express();
const PUERTO = 8080;

import ProductManager from "./product-manager.js";
const productManager = new ProductManager("./src/products.json");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas 
app.get("/", (req, res) => {
    res.send("Desafío 3 BackEnd")
})

app.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

app.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await productManager.getProductById(parseInt(id));
        if (!product) {
            return res.json({
                error: "Producto no encontrado"
            });
        }
        res.json(product);
    }
    catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`);
});