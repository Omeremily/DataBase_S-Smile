import { ObjectId } from "mongodb";
import { UserDB } from "./user.db";


export type User = {
    _id?: ObjectId;
    name: string;
    password?: string;
    age?: number;
    email?: string;
    address?: string;
    isAdmin?: boolean;
}

export  async function getAllUsers() : Promise<User[]>{
        console.log('first')
        let users = await new UserDB().findAll();
        console.log('users', users)
        return users;
}

export  async function getUsersByName(userName: string) : Promise<User>{
        try{
            let query = {name: userName};
            let users:User[] = await new UserDB().findAll(query);
            return users[0]; //הוא תמיד מביא מערך של אובייקט אחדאז אני רוצה לשלוף את האובייקט האחד הזה 
        }catch(error){
            throw new Error("User not found");
        }

}

export async function add(user: User) : Promise<any>{
    return new UserDB().insertUser(user); 
}

export async function findUsersById(id: string) : Promise<User>{

    try{
        let query = {_id: new ObjectId(id)};
        let users:User[] = await new UserDB().findAll(query);
        return users[0]; //הוא תמיד מביא מערך של אובייקט אחד אז אני רוצה לשלוף את האובייקט האחד הזה 
    }catch(error){
        throw new Error("User not found");
    }
}

export async function loginUser(email: string) : Promise<any>{
    try{
        let query = {email: email};
        let users:User[] = await new UserDB().findAll(query);
        if(users.length == 0){
            throw new Error("User not found");
        }
        return users[0];
    }catch(error){
        throw error;
    }

}



export async function registerUser(user: User):Promise<any>{

    try{

    //האם המייל כבר קיים במאגר
    let query = {email: user.email};
    let userExists = await new UserDB().findAll(query);

    if(userExists.length > 0){
        throw new Error("User already exists"); 
    }

    //הוספת המשתמש
    return await new UserDB().insertUser(user);

    }catch(error){
        throw error;
    }
}
