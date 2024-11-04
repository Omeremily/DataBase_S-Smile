import { MongoClient, ObjectId } from "mongodb";
import { Product } from "../products/product.model";

let client: MongoClient;

async function getClient(): Promise<MongoClient> {
    if (!client) {
        client = new MongoClient(process.env.CONNECTION_STRING as string);
    }
    await client.connect();
    return client;
}

export class ProductDB {
    db_name: string;
    collection = "products"; // Collection name for products

    constructor() {
        this.db_name = process.env.DB_NAME as string;
    }

    async findAllProducts(): Promise<Product[]> {
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
        } finally {
            await client.close();
        }
    }

    async insertProduct(product: Product): Promise<any> {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).insertOne(product);
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
