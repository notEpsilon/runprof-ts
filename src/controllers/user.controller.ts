import { Request, Response } from 'express';
import { firestore } from '../firebase/firebase.utils';
import { getDoc, getDocs, setDoc, updateDoc, deleteDoc, doc, collection } from 'firebase/firestore';
import EmailValidator from 'email-validator';

interface User {
    email: string;
    number: string;
    name: string;
    gender: 'male' | 'female';
    language: string;
    avatarUrl: string;
};

const addUser = async (req: Request, res: Response) => {
    const { email, number, name, gender, language, avatarUrl } = req.body;
    const user = { email, number, name, gender, language, avatarUrl };
    
    if (!EmailValidator.validate(email)) {
        return res.status(400).send('Invalid Email Address');
    }

    try {
        const userDocRef = doc(firestore, 'users', email);
        await setDoc(userDocRef, user);
        res.status(200).send('User Created Successfully');
    }
    catch (e) {
        res.status(500).send(`Error Creating The User\n\nErrorMessage: ${e}`);
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getDocs(collection(firestore, 'users'));
        const allUsers: User[] = [];
        users.forEach(doc => {
            const data = doc.data();
            allUsers.push({
                email: data.email,
                number: data.number,
                name: data.name,
                gender: data.gender,
                language: data.language,
                avatarUrl: data.avatarUrl
            });
        });
        res.status(200).send(allUsers);
    }
    catch (e) {
        res.status(500).send(`Error Retrieving All Users Back\n\nErrorMessage: ${e}`);
    }
};

const getSingleUser = async (req: Request, res: Response) => {
    const mail = req.params.mail;
    const userDoc = doc(firestore, 'users', mail);

    try {
        const user = await getDoc(userDoc);
        if (!user.exists()) {
            return res.status(404).send('User Not Found');
        }
        res.status(200).send(user.data());
    }
    catch (e) {
        res.status(500).send(`Error Retrieving This User\n\nErrorMessage: ${e}`);
    }
};

const updateUser = async (req: Request, res: Response) => {
    const { email, number, name, gender, language, avatarUrl } = req.body;
    const newData = { email, number, name, gender, language, avatarUrl };
    const mail = req.params.mail;
    const userDoc = doc(firestore, 'users', mail);

    if (email !== mail) {
        return res.status(400).send('You Can\'t Change The Email Address');
    }

    try {
        await updateDoc(userDoc, newData);
        res.status(200).send('User Updated Successfully');
    }
    catch (e) {
        res.status(500).send(`Error Updating This User\n\nErrorMessage: ${e}`);
    }
};

const deleteUser = async (req: Request, res: Response) => {
    const mail = req.params.mail;
    const userDoc = doc(firestore, 'users', mail);

    try {
        if (!(await getDoc(userDoc)).exists()) {
            return res.status(404).send('User Already Doesn\'t Exist');
        }

        await deleteDoc(userDoc);
        res.status(200).send('User Deleted Successfully');
    }
    catch (e) {
        res.status(500).send(`Error Deleting This User\n\nErrorMessage: ${e}`);
    }
};

const userController = {
    addUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
};

export default userController;
