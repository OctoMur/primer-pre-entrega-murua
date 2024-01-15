const express = require("express");
const app = express();
const PORT = 8080;

const productsRouter = require("./routes/products.router");
const cartRouter = require("./routes/carts.router")

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//routes
app.use("/api", productsRouter);
app.use("/api", cartRouter);

app.listen(PORT, ()=>{
    console.log(`Server activo: http://localhost:8080`);
})
