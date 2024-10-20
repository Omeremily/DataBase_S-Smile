"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editDailyMenu = exports.deleteDailyMenu = exports.getDailyMenu = exports.createDailyMenu = exports.purchaseInStore = exports.deletePhotoFromGallery = exports.addPhotoToGallery = exports.getUsersWeight = exports.countUsers = exports.deleteUser = exports.editUser = exports.register = exports.Login = exports.addUser = exports.getUserById = exports.getUsersName = exports.getUsers = void 0;
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
        let user = { firstName, lastName, email, password: (0, utils_1.encryptPassword)(password), isAdmin, currentWeight };
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
        return res.status(400).json({ error: 'Invalid email or password.' });
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
    const { email, password, firstName, lastName, isAdmin, startWeight, // Include startWeight here
    currentWeight, // Extract currentWeight, but make it optional
    phoneNumber, gender, height, goalWeight, targetDate, activityLevel, } = req.body;
    // Check for required fields
    if (!email || !password || !firstName || !lastName || !startWeight) {
        return res.status(400).json({ error: 'Missing required information' });
    }
    try {
        // If currentWeight is not provided, set it to startWeight
        const initialCurrentWeight = currentWeight ?? startWeight;
        // Create user object with all fields
        let user = {
            email,
            password: (0, utils_1.encryptPassword)(password),
            firstName,
            lastName,
            isAdmin,
            startWeight, // Add startWeight to the user object
            currentWeight: initialCurrentWeight, // Set currentWeight to startWeight initially if not provided
            goalWeight,
            phoneNumber,
            gender,
            height,
            targetDate,
            activityLevel,
        };
        // Call to register user in the database
        let result = await (0, user_model_1.registerUser)(user);
        console.log('result ==> ', result);
        // Check if registration was successful
        if (!result.insertedId) {
            return res.status(400).json({ error: 'Registration failed' });
        }
        // Set the _id field on the user object
        user._id = new mongodb_1.ObjectId(result.insertedId);
        // Return the newly registered user (without the password for security)
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword });
    }
    catch (error) {
        console.error('Registration error: ', error);
        res.status(500).json({ error: 'Registration failed' });
    }
}
exports.register = register;
async function editUser(req, res) {
    try {
        const { email, updates } = req.body; // Expect `email` to identify the user and `updates` to include fields to be changed.
        if (!email || !updates) {
            return res.status(400).json({ error: 'Email and updates are required' });
        }
        const result = await (0, user_model_1.updateUser)(email, updates);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'User not found or no changes applied' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
}
exports.editUser = editUser;
async function deleteUser(req, res) {
    try {
        const { email } = req.body;
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
        res.status(500).json({ error: 'Failed to delete user.' });
    }
}
exports.deleteUser = deleteUser;
async function countUsers(req, res) {
    try {
        let count = await (0, user_model_1.getUsersCount)();
        res.status(200).json({ userCount: count });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to count users' });
    }
}
exports.countUsers = countUsers;
async function getUsersWeight(req, res) {
    try {
        const { weights, avgWeight } = await (0, user_model_1.getUsersWeights)(); // Call the module function
        res.status(200).json({ weights, avgWeight }); // Send weights and average to the client
    }
    catch (error) {
        console.error('Error in getUsersWeight controller:', error);
        res.status(500).json({ error: 'Failed to fetch user weights' });
    }
}
exports.getUsersWeight = getUsersWeight;
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