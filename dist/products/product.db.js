"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDB = void 0;
const mongodb_1 = require("mongodb");
let client;
async function getClient() {
    if (!client) {
        console.log("Connecting to MongoDB with connection string:", process.env.CONNECTION_STRING); // Log connection string
        client = new mongodb_1.MongoClient(process.env.CONNECTION_STRING);
    }
    await client.connect();
    console.log("Connected to database:", process.env.DB_NAME); // Log the intended database
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
            // Use the `.find()` query with type assertion to `Product[]`
            return await client.db(this.db_name)
                .collection(this.collection)
                .find({})
                .toArray(); // Type assertion here
        }
        finally {
            await client.close();
        }
    }
    async insertProduct(product) {
        const client = await getClient();
        try {
            return await client.db("SweatNSmileDB").collection(this.collection).insertOne(product);
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