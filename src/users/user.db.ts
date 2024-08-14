import { Document, Filter, MongoClient, ObjectId } from "mongodb";
import { User } from "./user.model";

let client: MongoClient;

async function getClient(): Promise<MongoClient> {
    if (!client) {
        client = new MongoClient(process.env.CONNECTION_STRING as string);
        await client.connect();
    }
    return client;
}

export class UserDB {
    db_name: string;
    collection = "users";

    constructor() {
        this.db_name = process.env.DB_NAME as string;
    }

    async findAll(query = {}, project = {}): Promise<any> {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).find(query, { projection: project }).toArray();
        } catch (error) {
            console.error('Error finding users', error);
            throw new Error("Users not found");
        }
    }

    async insertUser(user: User): Promise<any> {
        const client = await getClient();
        console.log('user', user);
        try {
            return await client.db(this.db_name).collection(this.collection).insertOne(user);
        } catch (error) {
            console.error('Error inserting user', error);
            throw new Error("User insertion failed");
        }
    }

    async checkIfDocumentExist(query = {}) {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).countDocuments(query);
        } catch (error) {
            console.error('Error checking document existence', error);
            throw error;
        }
    }
}
