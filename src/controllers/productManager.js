const fs = require("fs").promises;


class ProductManager{
    static idProduct = 0;

    constructor(productsDbPath){
        this.products = []; //actualizar mas adelante para que verifique si no existe un archivo JSON con productos guardados.
        this.path = productsDbPath;
        this.verifyProducts();
    }

    async verifyProducts() {
        try {
            const productsList = await this.readFile();
    
            if (productsList && productsList.length > 0) {
                this.products = productsList;
    
                // Usar reduce con un valor inicial para asegurar la comparación
                const maxId = productsList.reduce((max, product) => (product.id > max ? product.id : max), 0);
    
                if (maxId > ProductManager.idProduct) {
                    ProductManager.idProduct = maxId;
                    console.log(ProductManager.idProduct);
                }
            } else {
                console.log('La lista de productos está vacía o no se pudo leer.');
            }
        } catch (error) {
            console.error('Error al verificar productos:', error.message);
        }
    }


    async addProduct(newProduct){
        //destructuracion del objeto
        let {title, description, code, price, status, stock, category, thumbnails} = newProduct;

        //Validaciones
        if(!title || !description || !code || !price || !status || !stock || !category || !thumbnails){
            console.log("Hay uno o mas campos vacios")
            return;thumbnails
        }

        if(this.products.some(item => item.code === code)){
            console.log("Codigo ya registrado, ingrese otro")
            return;
        }

        const product={
            id: ++ProductManager.idProduct,
            title: title,
            description: description,
            code: code,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails
        }

        //sumar el producto al array y pushear a la DB
        this.products.push(product);
        await this.saveFile(this.products);
    }

    async getProducts(){
        return this.products;
    }

    async getProductById(id){
        try {
            const productsImported = await this.readFile();
            const productFinded = productsImported.find(item => item.id == id);

            if(!productFinded){
                console.log("Producto no encontrado");
            }else{
                console.log("Producto encotrado!! (☞ﾟヮﾟ)☞ ", productFinded);
                return productFinded;
            }
        } 
        catch (error) {
            console.log("error al leer el archivo");
        }
    }

    async readFile(){
        try{
            const res = await fs.readFile(this.path, "utf-8");
            const newArrayObjetcs = JSON.parse(res);
            this.products = newArrayObjetcs;
            return newArrayObjetcs;
        }catch (error){
            console.log("error al leer el archivo", error);
        }
    }

    async saveFile(newArrayObjetcs){
        try{
            await fs.writeFile(this.path, JSON.stringify(newArrayObjetcs, null, 2))
        }
        catch (error){
            console.error("error al guardar el archivo", error);
        }
    }

    async updateProduct(id, productUpdated){
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id);

            if(index !== -1){
                arrayProducts.splice(index, 1, productUpdated)
                await this.saveFile(arrayProducts)
            }
            else{
                console.log("producto no encontrado")
            }
        } catch (error) {
            console.log("Error al actualizar el archivo")
        }
    }

    async deleteProduct(id){
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id);

            if(index !== -1){
                const newArrayProducts = arrayProducts.filter(product => product.id !== id)
                await this.saveFile(newArrayProducts)
            }
            else{
                console.log("producto no encontrado")
            }
        } catch (error) {
            console.log("Error al actualizar el archivo")
        }
    }
}

module.exports = ProductManager;

//el siguiente codigo fue el que hice para generar el archivo db.json

/*const manager = new ProductManager("./products.json")
for(i = 1 ; i<11; i++){
    const newProduct={
        id: ProductManager.idProduct++,
        title: `producto ${i}`,
        description: "Este es un producto prueba",
        price: i * 100,
        img: "Sin imagen",
        code: `abc10${i}`,
        stock: i*5
    }

    manager.addProduct(newProduct)
}*/
