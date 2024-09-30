import { ObjectId } from "mongodb";
import { UserDB } from "./user.db";

export type User = {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    password: string; // Password should not be optional if required for registration
    birthDate: Date,
    email: string; // Email should be mandatory for login/register
    isAdmin?: boolean;
    currentWeight?: number;
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
        console.error('Failed to login user', error);
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
