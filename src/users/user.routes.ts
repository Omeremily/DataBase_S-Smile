// imports
import { Router } from 'express';
import { 
    getUserById, 
    getUsers, 
    addUser, 
    getUsersName, 
    Login, 
    register, 
    editUser, 
    deleteUser, 
    countUsers,
    getUsersWeight,    
    getActivityLevelDistribution,
    saveMenu,
    getUserMenus,
    getUserByEmail
} 
from './user.controller';

// create the router object
const userRouter = Router();

// methods
userRouter.post('/login', Login);
userRouter.post('/register', register);
userRouter.put('/edit', editUser);
userRouter.delete('/delete', deleteUser);
userRouter.get('/activity-levels', getActivityLevelDistribution);


userRouter.get('/', getUsers);
userRouter.get('/name/:userName', getUsersName);
userRouter.get('/id/:id', getUserById);
userRouter.post('/add', addUser);
userRouter.get('/countUsers', countUsers); 
userRouter.get('/weights', getUsersWeight);
userRouter.post('/saveMenu', saveMenu);
userRouter.get('/menus/:email', getUserMenus);
userRouter.get('/getUserByEmail', getUserByEmail);





// export 
export default userRouter;
