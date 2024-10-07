import { Request, Response } from 'express';
import { User, add, deleteByEmail, findUsersById, getAllUsers, getUsersByName, getUsersCount, loginUser, registerUser } from './user.model';
import { ObjectId } from 'mongodb';
import { decryptPassword, encryptPassword } from '../utils/utils';

// User CRUD Operations with Express
export async function getUsers(req: Request, res: Response) {
  try {
    console.log("hello");
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
    
    let { firstName, lastName, email, password, birthDate, isAdmin, currentWeight } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Missing information' });
    }

    let user: User = { firstName, lastName, email, password: encryptPassword(password), birthDate, isAdmin, currentWeight };
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
  let { email, password, firstName, lastName, birthDate, isAdmin, currentWeight } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing information' });
  }

  try {
    let user: User = { email, password: encryptPassword(password), firstName, lastName, birthDate, isAdmin, currentWeight };
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

export function editUser(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "User Updated!" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
}


export async function deleteUser(req: Request, res: Response) {
  try {
    const { email } = req.body; // The email is passed in the body
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await deleteByEmail(email);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

export async function countUsers(req: Request, res: Response) {
  try {
    let count: number = await getUsersCount();
    res.status(200).json({ userCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to count users' });
  }
}











// User actions after login
export function addPhotoToGallery(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Photo added to gallery!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add photo to gallery" });
  }
}

export function deletePhotoFromGallery(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Photo deleted from gallery!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete photo from gallery" });
  }
}

export function purchaseInStore(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Purchase successful!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to complete purchase" });
  }
}

export function createDailyMenu(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Daily menu created!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create daily menu" });
  }
}

export function getDailyMenu(req: Request, res: Response) {
  try {
    res.status(200).json("dailyMenu");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch daily menu" });
  }
}

export function deleteDailyMenu(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Daily menu deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete daily menu" });
  }
}

export function editDailyMenu(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Daily menu updated!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update daily menu" });
  }
}