"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDB = void 0;
const mongodb_1 = require("mongodb");
let client;
async function getClient() {
    if (!client) {
        console.log('process.env.CONNECTION_STRING', process.env.CONNECTION_STRING);
        client = new mongodb_1.MongoClient(process.env.CONNECTION_STRING);
    }
    await client.connect();
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
            //throw new Error(error.message);
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
    async countAll() {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).countDocuments();
        }
        catch (error) {
            console.error('Error counting users', error);
            throw new Error("Failed to count users");
        }
    }
    async getUserWeights() {
        const client = await getClient();
        try {
            // Fetching users with their weight, firstName, and lastName
            return await client.db(this.db_name)
                .collection(this.collection)
                .find({}, { projection: { currentWeight: 1, firstName: 1, lastName: 1 } })
                .toArray();
        }
        catch (error) {
            console.error('Error fetching user weights from DB', error);
            throw new Error('Failed to fetch user weights');
        }
        finally {
            await client.close();
        }
    }
    async updateUserByEmail(email, updates) {
        const client = await getClient();
        try {
            return await client
                .db(this.db_name)
                .collection(this.collection)
                .updateOne({ email }, { $set: updates });
        }
        catch (error) {
            console.error('Error updating user by email:', error);
            throw new Error('Failed to update user by email');
        }
        finally {
            await client.close();
        }
    }
    async getActivityLevelCounts() {
        const client = await getClient();
        try {
            return await client.db(this.db_name)
                .collection(this.collection)
                .aggregate([
                { $group: { _id: "$activityLevel", count: { $sum: 1 } } }
            ])
                .toArray();
        }
        catch (error) {
            console.error('Error fetching activity level counts from DB', error);
            throw new Error('Failed to fetch activity level counts');
        }
        finally {
            await client.close();
        }
    }
    async addMenuToUser(userId, menu) {
        const client = await getClient();
        try {
            const query = { _id: new mongodb_1.ObjectId(userId) };
            // Test if the user can be found without attempting to update
            const user = await client.db(this.db_name).collection(this.collection).findOne(query);
            if (!user) {
                console.error(`User not found with userId: ${userId}`);
                throw new Error("User not found");
            }
            else {
                console.log(`User found: ${userId}`);
                // Optionally log the user to confirm
                console.log(user);
            }
            // Comment out the update code for now to isolate the retrieval step
            /*
            const update = { $push: { menus: menu } };
            const result = await client.db(this.db_name).collection(this.collection).updateOne(query, update);
      
            if (result.matchedCount === 0) {
                throw new Error("User not found");
            } else {
                console.log(`Menu added successfully to user with userId: ${userId}`);
            }
            */
        }
        catch (error) {
            console.error('Error in addMenuToUser:', error);
            throw new Error("Error adding menu to user");
        }
        finally {
            await client.close();
        }
    }
}
exports.UserDB = UserDB;
//# sourceMappingURL=user.db.js.map