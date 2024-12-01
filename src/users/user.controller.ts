import { Request, Response } from 'express';
import { User, add, deleteByEmail ,getUsersWeights, findUsersById, getAllUsers, getUsersByName, getUsersCount, loginUser, registerUser, updateUser, fetchActivityLevelDistribution } from './user.model';
import { ObjectId } from 'mongodb';
import { decryptPassword, encryptPassword } from '../utils/utils';
import { UserDB } from './user.db';  


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
    
    let { firstName, lastName, email, password, dateOfBirth, isAdmin, currentWeight } = req.body;
    if (!firstName || !lastName || !email || !password || !dateOfBirth) {
      return res.status(400).json({ error: 'Missing information' });
    }

    let user: User = { firstName, lastName, email, password: encryptPassword(password), isAdmin, currentWeight, dateOfBirth };
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
    dateOfBirth,
    targetDate,
    activityLevel,
    profileImageUrl,
  } = req.body;

  // Check for required fields
  if (!email || !password || !firstName || !lastName || !startWeight || !dateOfBirth) {
    return res.status(400).json({ error: 'Missing required information' });
  }

  try {
    // באופן דיפולטיבי כשמשתמש נרשם משקלו הנוכחי יהיה משקלו ההתחלתי
    const initialCurrentWeight = currentWeight ?? startWeight;

    // יצירת אובייקט מסוג יוזר עם כל התכונות
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
      dateOfBirth
    };

    // שליחה לפונקציות שממודאות שכבר אין משתמש כזה ובמידה ולא מכניסות אותו לרשימת המשתמשים בדאטה בייס
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

export async function getUserByEmail(req: Request, res: Response) {
  try {
      const { email } = req.params;
      const userDB = new UserDB();
      const user = await userDB.findUserByEmail(email);

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve user' });
  }
}

export async function getUserMenus(req: Request, res: Response) {
  try {
      const { email } = req.params;
      const userDB = new UserDB();
      const user = await userDB.findUserByEmail(email);

      if (!user || !user.menus) {
          return res.status(404).json({ error: "No menus found for this user" });
      }

      res.status(200).json(user.menus);
  } catch (error) {
      console.error('Error fetching menus:', error);
      res.status(500).json({ error: "Error retrieving menus" });
  }
}

export const saveMenu = async (req: Request, res: Response) => {
  try {
      const { email, meals, totalMacros } = req.body;

      if (!email || !meals || !totalMacros) {
          console.error('Missing required fields in request body:', { email, meals, totalMacros });
          return res.status(400).json({ message: "Missing data in request body" });
      }

      const menu = {
          menuId: new ObjectId().toString(),
          date: new Date(),
          meals,
          totalMacros,
      };

      const userDB = new UserDB();
      await userDB.addMenuToUserByEmail(email, menu);

      res.status(200).json({ message: "Menu saved successfully", menu });
  } catch (error) {
      if (error instanceof Error) {
          console.error('Error saving menu:', error.message);
          res.status(500).json({ error: "Error saving menu", details: error.message });
      } else {
          res.status(500).json({ error: "Error saving menu", details: "Unexpected error" });
      }
  }
};


//store

export async function getUserCart(req: Request, res: Response) {
  const { email } = req.params;
  try {
      const user = await new UserDB().findUserByEmail(email);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ cart: user.cart || [] });
  } catch (error) {
      console.error('Error fetching user cart:', error);
      res.status(500).json({ error: 'Failed to fetch cart' });
  }
}

export async function addOrUpdateCartItem(req: Request, res: Response) {
  const { email } = req.params;
  const { productId, name, price, quantity, imageURL } = req.body;

  try {
      const userDB = new UserDB();
      await userDB.addOrUpdateCartItemByEmail(email, { productId, name, price, quantity, imageURL });
      res.status(200).json({ message: 'Cart item added/updated successfully' });
  } catch (error) {
    console.error('Error updating cart item:', (error as Error).message); 
    res.status(500).json({ error: 'Failed to add/update cart item' });
}
}


export async function deleteCartItem(req: Request, res: Response) {
  const { email, productId } = req.params;

  try {
      const userDB = new UserDB();
      await userDB.removeCartItemByEmail(email, productId);
      res.status(200).json({ message: 'Cart item removed successfully' });
  } catch (error) {
      console.error('Error removing cart item:', error);
      res.status(500).json({ error: 'Failed to remove cart item' });
  }
}
