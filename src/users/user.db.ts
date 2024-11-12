import { Document, Filter, MongoClient, ObjectId } from "mongodb";
import { User } from "./user.model";

let client: MongoClient;

async function getClient(): Promise<MongoClient> {
    if (!client) {
        console.log('process.env.CONNECTION_STRING', process.env.CONNECTION_STRING);
        client = new MongoClient(process.env.CONNECTION_STRING as string);
    }
    await client.connect();
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
            //throw new Error(error.message);
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
      const client = await getClient();  
      try {
        console.log('email', email);
        return await client.db(this.db_name).collection(this.collection).deleteOne({ email });
      } catch (error) {
        console.error('Error in deleteUserByEmail:', error);
        throw new Error('Failed to delete user by email');
      } finally {
        await client.close();
      }
    }



    async countAll(): Promise<number> {
      const client = await getClient();
      try {
        return await client.db(this.db_name).collection(this.collection).countDocuments();
      } catch (error) {
        console.error('Error counting users', error);
        throw new Error("Failed to count users");
      }
    }

    async getUserWeights(): Promise<any> {
      const client = await getClient();
      try {
          // Fetching users with their weight, firstName, and lastName
          return await client.db(this.db_name)
              .collection(this.collection)
              .find({}, { projection: { currentWeight: 1, firstName: 1, lastName: 1 } })
              .toArray();
      } catch (error) {
          console.error('Error fetching user weights from DB', error);
          throw new Error('Failed to fetch user weights');
      } finally {
          await client.close();
      }
  }

  
  async updateUserByEmail(email: string, updates: Partial<User>): Promise<any> {
    const client = await getClient();
    try {
      return await client
        .db(this.db_name)
        .collection(this.collection)
        .updateOne({ email }, { $set: updates });
    } catch (error) {
      console.error('Error updating user by email:', error);
      throw new Error('Failed to update user by email');
    } finally {
      await client.close();
    }
  }


  async getActivityLevelCounts(): Promise<any> {
    const client = await getClient();
    try {
        return await client.db(this.db_name)
            .collection(this.collection)
            .aggregate([
                { $group: { _id: "$activityLevel", count: { $sum: 1 } } }
            ])
            .toArray();
    } catch (error) {
        console.error('Error fetching activity level counts from DB', error);
        throw new Error('Failed to fetch activity level counts');
    } finally {
        await client.close();
    }
}



async addMenuToUserByEmail(email: string, menu: any): Promise<void> {
  const client = await getClient();
  try {
      const query = { email };
      const update = { $push: { menus: menu } };

      const result = await client.db(this.db_name).collection(this.collection).updateOne(query, update);

      if (result.matchedCount === 0) {
          console.error(`User not found with email: ${email}`);
          throw new Error("User not found");
      } else {
          console.log(`Menu added successfully to user with email: ${email}`);
      }
  } catch (error) {
      console.error('Failed to add menu to user in UserDB:', error);
      throw new Error("Error adding menu to user");
  } finally {
      await client.close();
  }
}

async findUserByEmail(email: string): Promise<User | null> {
  const client = await getClient();
  try {
      return await client.db(this.db_name).collection<User>(this.collection).findOne({ email });
  } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error("Error finding user");
  } finally {
      await client.close();
  }
}

//Store

async addOrUpdateCartItemByEmail(email: string, item: any): Promise<void> {
  const client = await getClient();
  try {
      await client.db(this.db_name).collection(this.collection).updateOne(
          { email, "cart.productId": item.productId },
          { $set: { "cart.$": item } }, // Update existing item
          { upsert: true } // If not found, insert as new
      );
  } catch (error) {
      console.error('Error adding/updating cart item:', error);
      throw new Error("Failed to add or update cart item");
  } finally {
      await client.close();
  }
}


async removeCartItemByEmail(email: string, productId: string): Promise<void> {
  const client = await getClient();
  try {
      const filter: Document = { email };
      const update: Document = { $pull: { cart: { productId } } };

      await client.db(this.db_name).collection(this.collection).updateOne(filter, update);
  } catch (error) {
      console.error('Error removing cart item:', error);
      throw new Error("Failed to remove cart item");
  } finally {
      await client.close();
  }
}


  

}

  