"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../products/product.controller");
const productRouter = (0, express_1.Router)();
productRouter.get('/', product_controller_1.getProducts); // Get all products
productRouter.post('/add', product_controller_1.addProduct); // Add a new product
productRouter.put('/edit/:id', product_controller_1.editProduct); // Update a product by ID
productRouter.delete('/delete/:id', product_controller_1.deleteProduct); // Delete a product by ID
exports.default = productRouter;
//# sourceMappingURL=product.routes.js.map