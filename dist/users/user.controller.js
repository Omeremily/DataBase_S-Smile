"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editDailyMenu = exports.deleteDailyMenu = exports.getDailyMenu = exports.createDailyMenu = exports.purchaseInStore = exports.deletePhotoFromGallery = exports.addPhotoToGallery = exports.deleteUser = exports.editUser = exports.register = exports.Login = exports.addUser = exports.getUserById = exports.getUsersName = exports.getUsers = void 0;
const user_model_1 = require("./user.model");
const mongodb_1 = require("mongodb");
const utils_1 = require("../utils/utils");
// User CRUD Operations with Express
async function getUsers(req, res) {
    try {
        console.log("hello");
        let users = await (0, user_model_1.getAllUsers)();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
}
exports.getUsers = getUsers;
async function getUsersName(req, res) {
    try {
        let { firstName, lastName } = req.params;
        let user = await (0, user_model_1.getUsersByName)(firstName, lastName);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'User not found' });
    }
}
exports.getUsersName = getUsersName;
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
exports.getUserById = getUserById;
async function addUser(req, res) {
    try {
        let { firstName, lastName, email, password, birthDate, isAdmin, currentWeight } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'Missing information' });
        }
        let user = { firstName, lastName, email, password: (0, utils_1.encryptPassword)(password), birthDate, isAdmin, currentWeight };
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
exports.addUser = addUser;
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
exports.Login = Login;
async function register(req, res) {
    let { email, password, firstName, lastName, birthDate, isAdmin, currentWeight } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing information' });
    }
    try {
        let user = { email, password: (0, utils_1.encryptPassword)(password), firstName, lastName, birthDate, isAdmin, currentWeight };
        let result = await (0, user_model_1.registerUser)(user);
        console.log('result ==> ', result);
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
exports.register = register;
function editUser(req, res) {
    try {
        res.status(200).json({ msg: "User Updated!" });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
}
exports.editUser = editUser;
async function deleteUser(req, res) {
    try {
        const { email } = req.body; // The email is passed in the body
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const result = await (0, user_model_1.deleteByEmail)(email);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
}
exports.deleteUser = deleteUser;
// User actions after login
function addPhotoToGallery(req, res) {
    try {
        res.status(200).json({ msg: "Photo added to gallery!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to add photo to gallery" });
    }
}
exports.addPhotoToGallery = addPhotoToGallery;
function deletePhotoFromGallery(req, res) {
    try {
        res.status(200).json({ msg: "Photo deleted from gallery!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete photo from gallery" });
    }
}
exports.deletePhotoFromGallery = deletePhotoFromGallery;
function purchaseInStore(req, res) {
    try {
        res.status(200).json({ msg: "Purchase successful!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to complete purchase" });
    }
}
exports.purchaseInStore = purchaseInStore;
function createDailyMenu(req, res) {
    try {
        res.status(200).json({ msg: "Daily menu created!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create daily menu" });
    }
}
exports.createDailyMenu = createDailyMenu;
function getDailyMenu(req, res) {
    try {
        res.status(200).json("dailyMenu");
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch daily menu" });
    }
}
exports.getDailyMenu = getDailyMenu;
function deleteDailyMenu(req, res) {
    try {
        res.status(200).json({ msg: "Daily menu deleted!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete daily menu" });
    }
}
exports.deleteDailyMenu = deleteDailyMenu;
function editDailyMenu(req, res) {
    try {
        res.status(200).json({ msg: "Daily menu updated!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update daily menu" });
    }
}
exports.editDailyMenu = editDailyMenu;
//# sourceMappingURL=user.controller.js.map