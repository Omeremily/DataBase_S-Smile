import { Request, Response } from 'express';
import { User, add, deleteByEmail ,getUsersWeights, findUsersById, getAllUsers, getUsersByName, getUsersCount, loginUser, registerUser, updateUser, fetchActivityLevelDistribution,} from './user.model';
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

    let user: User = { firstName, lastName, email, password: encryptPassword(password), isAdmin, currentWeight };
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
    return res.status(400).json({ error: 'Invalid email or password.' });
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
  const {
    email,
    password,
    firstName,
    lastName,
    isAdmin,
    startWeight, 
    currentWeight,
    phoneNumber,
    gender,
    height,
    goalWeight,
    targetDate,
    activityLevel,
    profileImageUrl, // Add profileImageUrl as an optional field
  } = req.body;

  // Check for required fields
  if (!email || !password || !firstName || !lastName || !startWeight) {
    return res.status(400).json({ error: 'Missing required information' });
  }

  try {
    // If currentWeight is not provided, set it to startWeight
    const initialCurrentWeight = currentWeight ?? startWeight;

    // Create user object with all fields, including the optional profileImageUrl
    let user: User = {
      email,
      password: encryptPassword(password), 
      firstName,
      lastName,
      isAdmin,
      startWeight,
      currentWeight: initialCurrentWeight,
      goalWeight,
      phoneNumber,
      gender,
      height,
      targetDate,
      activityLevel,
      profileImageUrl, // Set profileImageUrl if provided
    };

    // Call to register user in the database
    let result = await registerUser(user);
    console.log('result ==> ', result);

    // Check if registration was successful
    if (!result.insertedId) {
      return res.status(400).json({ error: 'Registration failed' });
    }

    // Set the _id field on the user object
    user._id = new ObjectId(result.insertedId);
    
    // Return the newly registered user (without the password for security)
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword });

  } catch (error) {
    console.error('Registration error: ', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

export async function editUser(req: Request, res: Response) {
  try {
    const { email, updates } = req.body; // Expect `email` to identify the user and `updates` to include fields to be changed.
    
    if (!email || !updates) {
      return res.status(400).json({ error: 'Email and updates are required' });
    }

    const result = await updateUser(email, updates);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'User not found or no changes applied' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
}


export async function deleteUser(req: Request, res: Response) {
  try {
    const { email } = req.body; 
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await deleteByEmail(email);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
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

export async function getUsersWeight(req: Request, res: Response): Promise<void> {
  try {
    const { weights, avgWeight } = await getUsersWeights(); // Call the module function
    res.status(200).json({ weights, avgWeight }); // Send weights and average to the client
  } catch (error) {
    console.error('Error in getUsersWeight controller:', error);
    res.status(500).json({ error: 'Failed to fetch user weights' });
  }
}

export async function getActivityLevelDistribution(req: Request, res: Response): Promise<void> {
  try {
    const distribution = await fetchActivityLevelDistribution();
    res.status(200).json(distribution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity level distribution' });
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



//////// STORE

export async function addToCart(req: Request, res: Response) {
  const { userId, productId, quantity } = req.body;

  try {
    const user = await findUsersById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updatedCart = user.cart || [];
    const itemIndex = updatedCart.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      updatedCart[itemIndex].quantity += quantity;
    } else {
      updatedCart.push({ productId, quantity });
    }

    await updateUser(user.email, { cart: updatedCart });
    res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
}

export async function getUserCart(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const user = await findUsersById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
}