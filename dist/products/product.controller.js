"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.editProduct = exports.addProduct = exports.getProducts = void 0;
const product_db_1 = require("./product.db");
const productDB = new product_db_1.ProductDB();
// Get all products
async function getProducts(req, res) {
    try {
        const products = await productDB.findAllProducts();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
}
exports.getProducts = getProducts;
// Add a new product
async function addProduct(req, res) {
    const { name, description, price, category, imageURL, availability } = req.body;
    if (!name || !description || !price || !category || !imageURL || availability === undefined) {
        return res.status(400).json({ error: 'All product fields are required' });
    }
    const product = { name, description, price, category, imageURL, availability };
    try {
        const result = await productDB.insertProduct(product);
        res.status(201).json({ message: "Product added successfully!", productId: result.insertedId });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
}
exports.addProduct = addProduct;
// Update a product by ID
async function editProduct(req, res) {
    const { id } = req.params;
    const updates = req.body;
    try {
        const result = await productDB.updateProductById(id, updates);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Product not found or no changes applied' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
}
exports.editProduct = editProduct;
// Delete a product by ID
async function deleteProduct(req, res) {
    const { id } = req.params;
    try {
        const result = await productDB.deleteProductById(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
}
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.controller.js.map