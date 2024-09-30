import { Document, Filter, MongoClient, ObjectId } from "mongodb";
import { User } from "./user.model";

let client: MongoClient;

async function getClient(): Promise<MongoClient> {
    if (!client) {
        client = new MongoClient(process.env.CONNECTION_STRING as string);
        await client.connect();
    }
    return client;
}

export class UserDB {
    db_name: string;
    collection = "users";

    constructor() {
        this.db_name = process.env.DB_NAME as string;
    }

    async findAll(query = {}, project = {}): Promise<any> {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).find(query, { projection: project }).toArray();
        } catch (error) {
            console.error('Error finding users', error);
            throw new Error("Users not found");
        }
    }

    async insertUser(user: User): Promise<any> {
        const client = await getClient();
        console.log('user', user);
        try {
            const existingUser = await client.db(this.db_name).collection(this.collection).findOne({ email: user.email });
            
            if (existingUser) {
              throw new Error("User already exists");
            }
            
            return await client.db(this.db_name).collection(this.collection).insertOne(user);
          } catch (error) {
            if (error instanceof Error) {
                console.error('Error in registerUser');
                throw error;
  }
          }        
    }

    async checkIfDocumentExist(query = {}) {
        const client = await getClient();
        try {
            return await client.db(this.db_name).collection(this.collection).countDocuments(query);
        } catch (error) {
            console.error('Error checking document existence', error);
            throw error;
        }
    }


     async deleteUserByEmail(email: string): Promise<any> {
        const client = await getClient(); // Get MongoDB client connection
        try {
          const result = await client.db('your_db_name').collection('users').deleteOne({ email });
          if (result.deletedCount === 0) {
            console.error('No user found with this email');
          }
          return result; // Return the result from MongoDB
        } catch (error) {
          console.error('Error in deleteUserByEmail:', error);
          throw new Error('Failed to delete user by email');
        } finally {
          await client.close(); // Close the DB connection
        }
      }
}
