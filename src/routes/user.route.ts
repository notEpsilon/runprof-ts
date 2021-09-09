import express from 'express';
import userController from '../controllers/user.controller';

const userAuthRouter = express.Router();

/** Add User */
userAuthRouter.post('/register', userController.addUser);

/** Get All Users */
userAuthRouter.get('/users', userController.getAllUsers);

/** Get Single User */
userAuthRouter.get('/users/:mail', userController.getSingleUser);

/** Update User */
userAuthRouter.put('/users/:mail', userController.updateUser);

/** Delete User */
userAuthRouter.delete('/users/:mail', userController.deleteUser);

export default userAuthRouter;
