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
    addToCart,
    getUserCart,
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


//STORE
userRouter.post('/cart', addToCart); 
userRouter.get('/:userId/cart', getUserCart);


// export 
export default userRouter;
