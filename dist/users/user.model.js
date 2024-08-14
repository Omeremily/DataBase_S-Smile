"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUsersByName = getUsersByName;
exports.add = add;
exports.findUsersById = findUsersById;
exports.loginUser = loginUser;
exports.registerUser = registerUser;
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
async function getUsersByName(userName) {
    try {
        let query = { name: userName };
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
async function add(user) {
    try {
        return await new user_db_1.UserDB().insertUser(user);
    }
    catch (error) {
        console.error('Failed to add user', error);
        throw new Error("User insertion failed");
    }
}
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
//# sourceMappingURL=user.model.js.map