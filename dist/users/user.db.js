"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDB = void 0;
const mongodb_1 = require("mongodb");
let client;
async function getClient() {
    if (!client) {
        client = new mongodb_1.MongoClient(process.env.CONNECTION_STRING);
        await client.connect();
    }
    return client;
}
class UserDB {
    constructor() {
        this.collection = "users";
        this.db_name = process.env.DB_NAME;
    }
    async findAll(query = {}, project = {}) {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).find(query, { projection: project }).toArray();
        }
        catch (error) {
            console.error('Error finding users', error);
            throw new Error("Users not found");
        }
    }
    async insertUser(user) {
        const client = await getClient();
        console.log('user', user);
        try {
            const existingUser = await client.db(this.db_name).collection(this.collection).findOne({ email: user.email });
            if (existingUser) {
                throw new Error("User already exists");
            }
            return await client.db(this.db_name).collection(this.collection).insertOne(user);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error in registerUser');
                throw error;
            }
        }
    }
    async checkIfDocumentExist(query = {}) {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).countDocuments(query);
        }
        catch (error) {
            console.error('Error checking document existence', error);
            throw error;
        }
    }
    async deleteUserByEmail(email) {
        const client = await getClient();
        try {
            console.log('email', email);
            return await client.db(this.db_name).collection(this.collection).deleteOne({ email });
        }
        catch (error) {
            console.error('Error in deleteUserByEmail:', error);
            throw new Error('Failed to delete user by email');
        }
        finally {
            await client.close();
        }
    }
}
exports.UserDB = UserDB;
//# sourceMappingURL=user.db.js.map