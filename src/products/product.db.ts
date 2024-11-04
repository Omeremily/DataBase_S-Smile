import { MongoClient, ObjectId } from "mongodb";
import { Product } from "../products/product.model";

let client: MongoClient;

async function getClient(): Promise<MongoClient> {
    if (!client) {
        console.log("Connecting to MongoDB with connection string:", process.env.CONNECTION_STRING); // Log connection string
        client = new MongoClient(process.env.CONNECTION_STRING as string);
    }
    await client.connect();
    console.log("Connected to database:", process.env.DB_NAME); // Log the intended database
    return client;
}

export class ProductDB {
    db_name: string;
    collection = "products";

    constructor() {
        this.db_name = process.env.DB_NAME as string;
    }

    async findAllProducts(): Promise<Product[]> {
        const client = await getClient();
        try {
            // Use the `.find()` query with type assertion to `Product[]`
            return await client.db(this.db_name)
                .collection(this.collection)
                .find({})
                .toArray() as Product[]; // Type assertion here
        } finally {
            await client.close();
        }
    }
    
    async insertProduct(product: Product): Promise<any> {
        const client = await getClient();
        try {
            return await client.db("SweatNSmileDB").collection(this.collection).insertOne(product);
        } finally {
            await client.close();
        }
    }
    

    async updateProductById(id: string, updates: Partial<Product>): Promise<any> {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).updateOne(
                { _id: new ObjectId(id) },
                { $set: updates }
            );
        } finally {
            await client.close();
        }
    }

    async deleteProductById(id: string): Promise<any> {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).deleteOne({ _id: new ObjectId(id) });
        } finally {
            await client.close();
        }
    }
}
