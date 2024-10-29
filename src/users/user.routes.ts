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
    addPhotoToGallery, 
    deletePhotoFromGallery, 
    purchaseInStore, 
    createDailyMenu, 
    getDailyMenu, 
    deleteDailyMenu, 
    editDailyMenu,
    countUsers,
    getUsersWeight,    
    getActivityLevelDistribution
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





// methods - after logging in
userRouter.post('/addUserPhoto', addPhotoToGallery);
userRouter.delete('/users/:userId/photos/:photoId', deletePhotoFromGallery);
userRouter.post('/users/:userId/purchase', purchaseInStore);
userRouter.post('/users/:userId/dailyMenu', createDailyMenu);
userRouter.get('/users/:userId/dailyMenu', getDailyMenu);
userRouter.delete('/users/:userId/dailyMenu', deleteDailyMenu);
userRouter.put('/users/:userId/dailyMenu', editDailyMenu);

// export 
export default userRouter;
