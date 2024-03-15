import { promises as fs } from 'fs';

class ProductManager {
    static ultId = 0
    constructor(fileProducts) {
        this.products = [];
        this.path = fileProducts;
    }

    // Métodos:
    async addProduct(newObject) {
        let {
            title,
            description,
            price,
            img,
            code,
            stock
        } = newObject;

        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son obligatorios, completalo o moriras en 24 hs");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("El codigo debe ser unico");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }

        this.products.push(newProduct);

        // Guardamos el array en el archivo:
        await this.guardarArchivo(this.products);
    }

    async getProducts() {
        try {
            const arrayProducts = await this.leerArchivo();
            return arrayProducts;
        } catch (error) {
            console.log("Error al leer el archivo", error);
        }
    }

    async getProductById(id) {
        try {
            const arrayProducts = await this.leerArchivo();
            const buscado = arrayProducts.find(item => item.id === id);
            if (!buscado) {
                console.log("Producto no encontrado");
            } else {
                console.log("Producto encontrado");
                return buscado;
            }
        } catch (error) {
            console.log("Error al leer el archivo ", error);
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProducts = JSON.parse(respuesta);
            return arrayProducts;
        } catch (error) {
            console.log("Error al leer un archivo", error);
        }
    }

    async guardarArchivo(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    }

    // Actualizamos algun producto:
    async updateProduct(id, productoActualizado) {
        try {
            const arrayProducts = await this.leerArchivo();
            const index = arrayProducts.findIndex(item => item.id === id);
            if (index !== -1) {
                arrayProducts.splice(index, 1, productoActualizado);
                await this.guardarArchivo(arrayProducts);
            } else {
                console.log("Producto no encontrado");
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

    deleteProduct(id) {
        this.products = this.products.filter(product => product.id !== id);
        this.guardarArchivo();
    }
}

export default ProductManager;