import { Request, Response } from 'express';
import { User, add, findUsersById, getAllUsers, getUsersByName, loginUser, registerUser } from './user.model';
import { ObjectId } from 'mongodb';
import { decryptPassword, encryptPassword } from '../utils/utils';



//User CRUD Operations with Express
//פעולות קרוד על יוזר ללא לוגיקה בינתיים

export async function getUsers(req: Request, res: Response) {
  try {
    console.log('controller');
    let users: any = await getAllUsers();
    res.status(200).json(users);
  }
  catch (error) {
    res.status(500).json({ error });
  }
}


export async function getUsersName(req: Request, res: Response) {
  try {
    let { userName } = req.params;
    let users: User = await getUsersByName(userName);
    res.status(200).json(users);
  }
  catch (error) {
    res.status(500).json({ error });
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
  }
  catch (error) {
    res.status(500).json({ error });
  }

}

export async function addUser(req: Request, res: Response) {
  try {
    //שליפת המידע מגוף הבקשה
    let { name } = req.body;
    //יצירת מכונית חדשה
    let user: User = { name: name };
    let result = await add(user);

    //להוסיף את התכונה של האיידי לאובייקט
    user._id = new ObjectId(result.insertedId);
    res.status(201).json(result);
  }
  catch (error) {
    res.status(500).json({ error });
  }

}





export async function Login(req: Request, res: Response) {

  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Invalid email or password' });
  }
  try {
    let user = await loginUser(email);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }
    else if (!decryptPassword(password, user.password)) {
      res.status(200).json({ user });
    } else {
      res.status(400).json({ error: 'Invalid email or password' });
    }

  } catch (error) {
    res.status(500).json(error);
  }
}


export async function register(req: Request, res: Response) {
  let { email, password, name /*תלוי מה יש לנו כאן*/ } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: 'Missing Information' });
  }

  try {

    password = encryptPassword(password);

    let user: User = { email, password, name };
    let result = await registerUser(user);
    if (!result.insertedId) {
      return res.status(400).json({ error: 'registration failed' });
    }
    user._id = result.insertedId;
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json(error);
  }
}

export function editUser(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "User Updated!" });
  } catch (error) {
    res.status(500).json(error);
  }
}

export function deleteUser(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "User Deleted!" });
  } catch (error) {
    res.status(500).json(error);
  }
}


//פונקציות לטיפול באפשרויות משתמש לאחר התחברות

//הוספת תמונה לגלריה
export function addPhotoToGallery(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Photo added to gallery!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add photo to gallery", details: error });
  }
}

//מחיקת תמונה מהגלריה
export function deletePhotoFromGallery(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Photo deleted from gallery!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete photo from gallery", details: error });
  }
}

//רכישה בחנות 
export function purchaseInStore(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Purchase successful!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to complete purchase", details: error });
  }
}

//יצירת תפריט יומי 
export function createDailyMenu(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Daily menu created!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create daily menu", details: error });
  }
}

// גישה לתפריט היומי 
export function getDailyMenu(req: Request, res: Response) {
  try {
    res.status(200).json("dailyMenu");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch daily menu", details: error });
  }
}

export function deleteDailyMenu(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Daily menu deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete daily menu", details: error });
  }
}

export function editDailyMenu(req: Request, res: Response) {
  try {
    res.status(200).json({ msg: "Daily menu updated!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update daily menu", details: error });
  }
}