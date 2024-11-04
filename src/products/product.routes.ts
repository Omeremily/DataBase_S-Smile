import { Router } from 'express';
import { getProducts, addProduct, editProduct, deleteProduct } from '../products/product.controller';

const productRouter = Router();

productRouter.get('/', getProducts);               // Get all products
productRouter.post('/add', addProduct);            // Add a new product
productRouter.put('/edit/:id', editProduct);       // Update a product by ID
productRouter.delete('/delete/:id', deleteProduct); // Delete a product by ID

export default productRouter;
