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
    getUserByEmail,
    getUserCart,
    addOrUpdateCartItem,
    deleteCartItem
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
userRouter.get('/getUserByEmail/:email', getUserByEmail);

userRouter.get('/cart/:email', getUserCart); // Fetch cart
userRouter.put('/cart/:email', addOrUpdateCartItem); // Add/update item
userRouter.delete('/cart/:email/:productId', deleteCartItem); // Delete item



// export 
export default userRouter;
