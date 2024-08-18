import { Request, Response } from 'express';
import { User, add, findUsersById, getAllUsers, getUsersByName, loginUser, registerUser } from './user.model';
import { ObjectId } from 'mongodb';
import { decryptPassword, encryptPassword } from '../utils/utils';

// User CRUD Operations with Express
export async function getUsers(req: Request, res: Response) {
  try {
    let users: any = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
}

export async function getUsersName(req: Request, res: Response) {
  try {
    let { firstName, lastName } = req.params;
    let user: User = await getUsersByName(firstName, lastName);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User not found' });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    let { id } = req.params;
    let user: User = await findUsersById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: 'User not found' });
  }
}

export async function addUser(req: Request, res: Response) {
  try {
    let { firstName, lastName, email, password, age, address, isAdmin, weight } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Missing information' });
    }

    let user: User = { firstName, lastName, email, password: encryptPassword(password), age, address, isAdmin, weight };
    let result = await add(user);

    if (!result.insertedId) {
      return res.status(400).json({ error: 'User creation failed' });
    }

    user._id = new ObjectId(result.insertedId);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
}

export async function Login(req: Request, res: Response) {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  try {
    let user = await loginUser(email);
    if (!user || !decryptPassword(password, user.password!)) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function register(req: Request, res: Response) {
  let { email, password, firstName, lastName, age, address, isAdmin, weight } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing information' });
  }

  try {
    let user: User = { email, password: encryptPassword(password), firstName, lastName, age, address, isAdmin, weight };
    let result = await registerUser(user);
    console.log('result ==> ', result);
    if (!result.insertedId) {
      return res.status(400).json({ error: 'Registration failed' });
    }
    user._id = new ObjectId(result.insertedId);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
}
