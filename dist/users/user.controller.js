"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUsersName = getUsersName;
exports.getUserById = getUserById;
exports.addUser = addUser;
exports.Login = Login;
exports.register = register;
exports.editUser = editUser;
exports.deleteUser = deleteUser;
exports.addPhotoToGallery = addPhotoToGallery;
exports.deletePhotoFromGallery = deletePhotoFromGallery;
exports.purchaseInStore = purchaseInStore;
exports.createDailyMenu = createDailyMenu;
exports.getDailyMenu = getDailyMenu;
exports.deleteDailyMenu = deleteDailyMenu;
exports.editDailyMenu = editDailyMenu;
const user_model_1 = require("./user.model");
const mongodb_1 = require("mongodb");
const utils_1 = require("../utils/utils");
// User CRUD Operations with Express
async function getUsers(req, res) {
    try {
        let users = await (0, user_model_1.getAllUsers)();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
}
async function getUsersName(req, res) {
    try {
        let { userName } = req.params;
        let user = await (0, user_model_1.getUsersByName)(userName);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'User not found' });
    }
}
async function getUserById(req, res) {
    try {
        let { id } = req.params;
        let user = await (0, user_model_1.findUsersById)(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'User not found' });
    }
}
async function addUser(req, res) {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing information' });
        }
        let user = { name, email, password: (0, utils_1.encryptPassword)(password) };
        let result = await (0, user_model_1.add)(user);
        if (!result.insertedId) {
            return res.status(400).json({ error: 'User creation failed' });
        }
        user._id = new mongodb_1.ObjectId(result.insertedId);
        res.status(201).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add user' });
    }
}
async function Login(req, res) {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }
    try {
        let user = await (0, user_model_1.loginUser)(email);
        if (!user || !(0, utils_1.decryptPassword)(password, user.password)) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
}
async function register(req, res) {
    let { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Missing information' });
    }
    try {
        let user = { email, password: (0, utils_1.encryptPassword)(password), name };
        let result = await (0, user_model_1.registerUser)(user);
        if (!result.insertedId) {
            return res.status(400).json({ error: 'Registration failed' });
        }
        user._id = new mongodb_1.ObjectId(result.insertedId);
        res.status(201).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
}
function editUser(req, res) {
    try {
        res.status(200).json({ msg: "User Updated!" });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
}
function deleteUser(req, res) {
    try {
        res.status(200).json({ msg: "User Deleted!" });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
}
// User actions after login
function addPhotoToGallery(req, res) {
    try {
        res.status(200).json({ msg: "Photo added to gallery!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to add photo to gallery" });
    }
}
function deletePhotoFromGallery(req, res) {
    try {
        res.status(200).json({ msg: "Photo deleted from gallery!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete photo from gallery" });
    }
}
function purchaseInStore(req, res) {
    try {
        res.status(200).json({ msg: "Purchase successful!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to complete purchase" });
    }
}
function createDailyMenu(req, res) {
    try {
        res.status(200).json({ msg: "Daily menu created!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create daily menu" });
    }
}
function getDailyMenu(req, res) {
    try {
        res.status(200).json("dailyMenu");
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch daily menu" });
    }
}
function deleteDailyMenu(req, res) {
    try {
        res.status(200).json({ msg: "Daily menu deleted!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete daily menu" });
    }
}
function editDailyMenu(req, res) {
    try {
        res.status(200).json({ msg: "Daily menu updated!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update daily menu" });
    }
}
//# sourceMappingURL=user.controller.js.map