
//imports 
import { Router } from 'express';
import { getUserById, getUsers } from './user.controller';
import { addUser, getUsersName, Login } from './user.controller';
import { register } from './user.controller';
import { editUser } from './user.controller';
import { deleteUser } from './user.controller';
//after logging in
import { addPhotoToGallery } from './user.controller';
import { deletePhotoFromGallery } from './user.controller';
import { purchaseInStore } from './user.controller';
import { createDailyMenu } from './user.controller';
import { getDailyMenu } from './user.controller';
import { deleteDailyMenu } from './user.controller';
import { editDailyMenu } from './user.controller';



//create the router object
const userRouter = Router();

//methods 
userRouter.post('/login', Login);
userRouter.post('/register', register);
userRouter.put('/edit', editUser);
userRouter.delete('/delete', deleteUser);

userRouter.get('/', getUsers);
userRouter.get('/:userName', getUsersName);
userRouter.get('/:id', getUserById);
userRouter.post('/add', addUser);


//methods- after logging in
userRouter.post('/addUserPhoto', addPhotoToGallery);
userRouter.delete('/users/:userId/photos/:photoId', deletePhotoFromGallery);
userRouter.post('/users/:userId/purchase', purchaseInStore);
userRouter.post('/users/:userId/dailyMenu', createDailyMenu);
userRouter.get('/users/:userId/dailyMenu', getDailyMenu);
userRouter.delete('/users/:userId/dailyMenu', deleteDailyMenu);
userRouter.put('/users/:userId/dailyMenu', editDailyMenu);






//export 
export default userRouter;