import express from "express"
import { getAllProducts, addProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/adminMiddleware.js";
// import customMiddleware from "../utils/customMiddleware.js";



// initialize  Router using express.Router method
const Router = express.Router();


//from the router create the different routes
Router.route('/products')
.get(getAllProducts)


Router.route("/products/:id")
.get(getProductById)
.patch(auth, admin, updateProduct)
.put(auth, admin, updateProduct)
.delete(auth, admin, deleteProduct)



export default Router;
