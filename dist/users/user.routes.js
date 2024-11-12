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
userRouter.get('/activity-levels', user_controller_1.getActivityLevelDistribution);
userRouter.get('/', user_controller_1.getUsers);
userRouter.get('/name/:userName', user_controller_1.getUsersName);
userRouter.get('/id/:id', user_controller_1.getUserById);
userRouter.post('/add', user_controller_1.addUser);
userRouter.get('/countUsers', user_controller_1.countUsers);
userRouter.get('/weights', user_controller_1.getUsersWeight);
userRouter.post('/saveMenu', user_controller_1.saveMenu);
// export 
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map