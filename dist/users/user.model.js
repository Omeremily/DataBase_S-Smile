"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersCount = exports.registerUser = exports.loginUser = exports.findUsersById = exports.getUsersWeights = exports.deleteByEmail = exports.add = exports.getUsersByName = exports.getAllUsers = void 0;
const mongodb_1 = require("mongodb");
const user_db_1 = require("./user.db");
async function getAllUsers() {
    try {
        let users = await new user_db_1.UserDB().findAll();
        return users;
    }
    catch (error) {
        console.error('Failed to get users', error);
        throw new Error("Failed to retrieve users");
    }
}
exports.getAllUsers = getAllUsers;
async function getUsersByName(firstName, lastName) {
    try {
        let query = { firstName, lastName };
        let users = await new user_db_1.UserDB().findAll(query);
        if (users.length === 0)
            throw new Error("User not found");
        return users[0];
    }
    catch (error) {
        console.error('Failed to find user by name', error);
        throw new Error("User not found");
    }
}
exports.getUsersByName = getUsersByName;
async function add(user) {
    try {
        return await new user_db_1.UserDB().insertUser(user);
    }
    catch (error) {
        console.error('Failed to add user', error);
        throw new Error("User insertion failed");
    }
}
exports.add = add;
async function deleteByEmail(email) {
    try {
        return await new user_db_1.UserDB().deleteUserByEmail(email); // Calling DB layer to delete user
    }
    catch (error) {
        console.error('Failed to delete user', error);
        throw new Error("User deletion failed");
    }
}
exports.deleteByEmail = deleteByEmail;
async function getUsersWeights() {
    try {
        const userDB = new user_db_1.UserDB();
        const users = await userDB.getUserWeights(); // Fetch user weights from the DB
        const weights = users.map((user) => ({
            weight: user.currentWeight,
            name: `${user.firstName} ${user.lastName}`
        }));
        // Calculate the average weight
        const totalWeight = weights.reduce((sum, user) => sum + (user.weight || 0), 0);
        const avgWeight = users.length > 0 ? totalWeight / users.length : 0;
        return { weights, avgWeight }; // Return both weights and the average
    }
    catch (error) {
        console.error('Error in getUsersWeights module:', error);
        throw new Error('Failed to get user weights');
    }
}
exports.getUsersWeights = getUsersWeights;
async function findUsersById(id) {
    try {
        let query = { _id: new mongodb_1.ObjectId(id) };
        let users = await new user_db_1.UserDB().findAll(query);
        if (users.length === 0)
            throw new Error("User not found");
        return users[0];
    }
    catch (error) {
        console.error('Failed to find user by ID', error);
        throw new Error("User not found");
    }
}
exports.findUsersById = findUsersById;
async function loginUser(email) {
    try {
        let query = { email: email };
        let users = await new user_db_1.UserDB().findAll(query);
        if (users.length === 0)
            throw new Error("User not found");
        return users[0];
    }
    catch (error) {
        console.error('Failed to login user', error);
        throw new Error("User not found");
    }
}
exports.loginUser = loginUser;
async function registerUser(user) {
    try {
        let query = { email: user.email };
        let userExists = await new user_db_1.UserDB().findAll(query);
        if (userExists.length > 0)
            throw new Error("User already exists");
        return await new user_db_1.UserDB().insertUser(user);
    }
    catch (error) {
        console.error('Failed to register user', error);
        throw new Error("Registration failed");
    }
}
exports.registerUser = registerUser;
async function getUsersCount() {
    try {
        let count = await new user_db_1.UserDB().countAll();
        return count;
    }
    catch (error) {
        console.error('Error counting users', error);
        throw new Error("Failed to count users");
    }
}
exports.getUsersCount = getUsersCount;
//# sourceMappingURL=user.model.js.map