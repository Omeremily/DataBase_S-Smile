"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDB = void 0;
const mongodb_1 = require("mongodb");
let client;
async function getClient() {
    if (!client) {
        client = new mongodb_1.MongoClient(process.env.CONNECTION_STRING);
    }
    await client.connect();
    return client;
}
class ProductDB {
    constructor() {
        this.collection = "products";
        this.db_name = process.env.DB_NAME;
    }
    async findAllProducts() {
        const client = await getClient();
        try {
            const products = await client.db(this.db_name).collection(this.collection).find({}).toArray();
            return products.map((product) => ({
                _id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                imageURL: product.imageURL,
                availability: product.availability,
            }));
        }
        finally {
            await client.close();
        }
    }
    async insertProduct(product) {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).insertOne(product);
        }
        finally {
            await client.close();
        }
    }
    async updateProductById(id, updates) {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updates });
        }
        finally {
            await client.close();
        }
    }
    async deleteProductById(id) {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).deleteOne({ _id: new mongodb_1.ObjectId(id) });
        }
        finally {
            await client.close();
        }
    }
}
exports.ProductDB = ProductDB;
//# sourceMappingURL=product.db.js.map