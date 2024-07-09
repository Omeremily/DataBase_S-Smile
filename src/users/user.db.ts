import { Document, Filter, MongoClient, ObjectId } from "mongodb";
import { User } from "./user.model";

export class UserDB{
    connection_string: string;
    db_name: string;
    client: MongoClient;
    collection= "users";    

    constructor(){
        this.connection_string = process.env.CONNECTION_STRING as string;
        this.db_name = process.env.DB_NAME as string;
        this.client = new MongoClient(this.connection_string);
    }

    async findAll( query= {}, project={}) : Promise<any>{
        try {
            console.log('find')
            await this.client.connect(); 
            return await this.client.db(this.db_name).collection(this.collection).find(query, {projection: project}).toArray();
        }
        catch(error){
            throw new Error("Users not found");
        }
        finally{
            this.client.close();
        }
    }


    async insertUser(user: User): Promise<void> {
        try {
            await this.client.connect();
            //הוספה
            await this.client.db(this.db_name).collection(this.collection).insertOne(user);
        } catch (error) {
            throw new Error("User insertion failed");
        } finally {
             this.client.close(); // Ensure that close is awaited
        }
    }


    async checkIfDocumentExist(query={}) {
        let mongo = this.client.db(this.db_name).collection(this.collection);
        try{
            //התחברות למסד הנתונים
            await this.client.connect();
            //החזרת כמות המסמכים
            return await this.client.db(this.db_name).collection(this.collection).countDocuments(query);
        }catch(error){
            throw error;      
        }finally{
            this.client.close();
        }
    }



}