const express = require("express");
const app = express();
const PORT = 8080;

const productsRouter = require("./routes/products.router");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//routes
app.use("/api", productsRouter);

app.listen(PORT, ()=>{
    console.log(`Server activo: http://localhost:8080/products`);
    console.log(`Server activo: http://localhost:8080/products?limit=5`);
    console.log(`Server activo: http://localhost:8080/products/2`);
})
