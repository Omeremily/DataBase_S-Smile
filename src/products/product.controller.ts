import { Request, Response } from 'express';
import { Product } from './product.model';
import { ProductDB } from './product.db';

const productDB = new ProductDB();

// Get all products
export async function getProducts(req: Request, res: Response) {
    try {
        const products = await productDB.findAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
}

// Add a new product
export async function addProduct(req: Request, res: Response) {
    const { name, description, price, category, imageURL, availability } = req.body;

    if (!name || !description || !price || !category || !imageURL || availability === undefined) {
        return res.status(400).json({ error: 'All product fields are required' });
    }

    const product: Product = { name, description, price, category, imageURL, availability };
    try {
        const result = await productDB.insertProduct(product);
        res.status(201).json({ message: "Product added successfully!", productId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
}

// Update a product by ID
export async function editProduct(req: Request, res: Response) {
    const { id } = req.params;
    const updates = req.body;

    try {
        const result = await productDB.updateProductById(id, updates);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Product not found or no changes applied' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
}

// Delete a product by ID
export async function deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const result = await productDB.deleteProductById(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
}
