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
    async addToCart(userId, product) {
        const client = await getClient();
        const productIdObj = new mongodb_1.ObjectId(product.productId);
        try {
            const userCollection = client.db(this.db_name).collection(this.collection);
            const user = await userCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
            // Initialize cart if it doesn't exist
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.cart) {
                user.cart = [];
            }
            const existingItemIndex = user.cart.findIndex((item) => item.productId.equals(productIdObj));
            if (existingItemIndex !== -1) {
                const update = { [`cart.${existingItemIndex}.quantity`]: user.cart[existingItemIndex].quantity + product.quantity };
                await userCollection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $set: update });
            }
            else {
                await userCollection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $push: { cart: { ...product, productId: productIdObj } } });
            }
            return await userCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
        }
        catch (error) {
            console.error('Failed to add item to cart:', error);
            throw error;
        }
    }
    // Update cart item quantity
    async updateCartItem(userId, productId, quantity) {
        const client = await getClient();
        const productIdObj = new mongodb_1.ObjectId(productId);
        try {
            const userCollection = client.db(this.db_name).collection(this.collection);
            const user = await userCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
            // Check for user and cart existence
            if (!user || !user.cart) {
                throw new Error("User or cart not found");
            }
            // Update the quantity of the specific product in the user's cart
            const update = await userCollection.updateOne({ _id: new mongodb_1.ObjectId(userId), 'cart.productId': productIdObj }, { $set: { 'cart.$.quantity': quantity } });
            if (update.modifiedCount === 0)
                throw new Error("Item not found in cart or no change made");
            return await userCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
        }
        catch (error) {
            console.error('Failed to update cart item:', error);
            throw error;
        }
    }
    // Remove item from cart
    async removeFromCart(userId, productId) {
        const client = await getClient();
        const productIdObj = new mongodb_1.ObjectId(productId);
        try {
            const userCollection = client.db(this.db_name).collection(this.collection);
            const user = await userCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
            // Check for user and cart existence
            if (!user || !user.cart) {
                throw new Error("User or cart not found");
            }
            // Remove the item from the cart
            await userCollection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $pull: { cart: { productId: productIdObj } } });
            return await userCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
        }
        catch (error) {
            console.error('Failed to remove item from cart:', error);
            throw error;
        }
    }
}
exports.UserDB = UserDB;
//# sourceMappingURL=user.db.js.map