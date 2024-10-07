"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
// create the router object
const userRouter = (0, express_1.Router)();
// methods
userRouter.post('/login', user_controller_1.Login);
userRouter.post('/register', user_controller_1.register);
userRouter.put('/edit', user_controller_1.editUser);
userRouter.delete('/delete', user_controller_1.deleteUser);
userRouter.get('/', user_controller_1.getUsers);
userRouter.get('/name/:userName', user_controller_1.getUsersName);
userRouter.get('/id/:id', user_controller_1.getUserById);
userRouter.post('/add', user_controller_1.addUser);
userRouter.get('/countUsers', user_controller_1.countUsers);
// methods - after logging in
userRouter.post('/addUserPhoto', user_controller_1.addPhotoToGallery);
userRouter.delete('/users/:userId/photos/:photoId', user_controller_1.deletePhotoFromGallery);
userRouter.post('/users/:userId/purchase', user_controller_1.purchaseInStore);
userRouter.post('/users/:userId/dailyMenu', user_controller_1.createDailyMenu);
userRouter.get('/users/:userId/dailyMenu', user_controller_1.getDailyMenu);
userRouter.delete('/users/:userId/dailyMenu', user_controller_1.deleteDailyMenu);
userRouter.put('/users/:userId/dailyMenu', user_controller_1.editDailyMenu);
// export 
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map