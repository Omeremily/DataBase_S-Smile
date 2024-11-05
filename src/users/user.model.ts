import { ObjectId } from "mongodb";
import { UserDB } from "./user.db";

export type User = {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    password: string; // Password should not be optional if required for registration
    email: string; // Email should be mandatory for login/register
    isAdmin?: boolean;
    currentWeight?: number;
    goalWeight?: number;
    startWeight?: number;
    phoneNumber?: string;
    gender?: string;
    height?: number;
    targetDate?: Date;
    activityLevel?: string;
    gallery?: string[];
    profileImageUrl?: string;
    cart?: { productId: string; quantity: number }[]; 


    weeklyGoals?: {
      goalType: 'calories' | 'steps' | 'workouts' | 'hydration' | 'sleep';
      targetValue: number; // e.g., target steps, calories, etc.
      progressValue: number; // Track current progress for the week
      startDate: Date; // To reset weekly
      endDate: Date; // Goal deadline (end of the week)
      isCompleted?: boolean; // Track if the user has completed this week's challenge
  }[];
}

export async function getAllUsers(): Promise<User[]> {
    try {
        let users = await new UserDB().findAll();
        return users;
    } catch (error) {
        console.error('Failed to get users', error);
        throw new Error("Failed to retrieve users");
    }
}

export async function getUsersByName(firstName: string, lastName: string): Promise<User> {
    try {
        let query = { firstName, lastName };
        let users: User[] = await new UserDB().findAll(query);
        if (users.length === 0) throw new Error("User not found");
        return users[0];
    } catch (error) {
        console.error('Failed to find user by name', error);
        throw new Error("User not found");
    }
}

export async function add(user: User): Promise<any> {
    try {
        return await new UserDB().insertUser(user);
    } catch (error) {
        console.error('Failed to add user', error);
        throw new Error("User insertion failed");
    }
}

export async function deleteByEmail(email: string): Promise<any> {
    try {
      return await new UserDB().deleteUserByEmail(email); 
    } catch (error) {
      console.error('Failed to delete user', error);
      throw new Error("User deletion failed");
    }
  }
  

  export async function getUsersWeights(): Promise<{ weights: { name: string; weight: number }[], avgWeight: number }> {
    try {
      const userDB = new UserDB();
      const users = await userDB.getUserWeights(); // Fetch user weights from the DB
      const weights = users.map((user: { currentWeight: any; firstName: any; lastName: any; }) => ({
        weight: user.currentWeight,
        name: `${user.firstName} ${user.lastName}`
      }));
  
      // Calculate the average weight
      const totalWeight = weights.reduce((sum: any, user: { weight: any; }) => sum + (user.weight || 0), 0);
      const avgWeight = users.length > 0 ? totalWeight / users.length : 0;
  
      return { weights, avgWeight }; // Return both weights and the average
    } catch (error) {
      console.error('Error in getUsersWeights module:', error);
      throw new Error('Failed to get user weights');
    }
  }

export async function findUsersById(id: string): Promise<User> {
    try {
        let query = { _id: new ObjectId(id) };
        let users: User[] = await new UserDB().findAll(query);
        if (users.length === 0) throw new Error("User not found");
        return users[0];
    } catch (error) {
        console.error('Failed to find user by ID', error);
        throw new Error("User not found");
    }
}

export async function loginUser(email: string): Promise<User> {
    try {
        let query = { email: email };
        let users: User[] = await new UserDB().findAll(query);
        if (users.length === 0) throw new Error("User not found");
        return users[0];
    } catch (error) {
        console.error('Failed to login user.', error);
        throw new Error("User not found");
    }
}

export async function registerUser(user: User): Promise<any> {
    try {
        let query = { email: user.email };
        let userExists = await new UserDB().findAll(query);
        if (userExists.length > 0) throw new Error("User already exists");
        return await new UserDB().insertUser(user);
    } catch (error) {
        console.error('Failed to register user', error);
        throw new Error("Registration failed");
    }
}

export async function getUsersCount(): Promise<number> {
    try {
      let count: number = await new UserDB().countAll();
      return count;
    } catch (error) {
      console.error('Error counting users', error);
      throw new Error("Failed to count users");
    }
  }

export async function updateUser(email: string, updates: Partial<User>): Promise<any> {
  try {
    return await new UserDB().updateUserByEmail(email, updates);
  } catch (error) {
    console.error('Failed to update user', error);
    throw new Error('User update failed');
  }
}

export async function fetchActivityLevelDistribution(): Promise<{ [key: string]: number }> {
  try {
      const userDB = new UserDB();
      const activityCounts = await userDB.getActivityLevelCounts();
      const distribution: { [key: string]: number } = {};
      
      activityCounts.forEach((level: { _id: string; count: number }) => {
          distribution[level._id] = level.count;
      });
      
      return distribution;
  } catch (error) {
      console.error('Error in fetchActivityLevelDistribution:', error);
      throw new Error('Failed to get activity level distribution');
  }
}


//store
