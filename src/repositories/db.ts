import {MongoClient} from 'mongodb'
import {settings} from "../settings";
import mongoose from 'mongoose';
import {BloggerDBType} from "../types/blogger-type";

const dbName = "newapi";
export const client = new MongoClient(settings.MONGO_URL);
const db = client.db("newapi")
//export const bloggerCollection = db.collection("bloggers");
export const postsCollection = db.collection("posts");
export const usersCollection = db.collection("users");
export const commentsCollection = db.collection("comment");
export const trafficCollection = db.collection("traffic");
export const tokenCollection = db.collection("tokens")

export const BloggerSchema = new mongoose.Schema<BloggerDBType>({
        name: String,
        youtubeUrl: String,
    },
    {
        versionKey: false,
    });

export const BloggerModelClass = mongoose.model('Bloggers', BloggerSchema);


export async function runDb() {
    try {

        await mongoose.connect(settings.MONGO_URL);
        // await client.connect();
        //await client.db("blogger").command({ping: 1});
        console.log("Connected successfully to mongo server")
    } catch {
        console.log("Cant connect to db")
        await client.close();
        await mongoose.disconnect();
    }
}

export const testing = {


    async deleteAllData(): Promise<void> {
        try {
            await db.dropDatabase()


        } catch {
            await client.close()
            await runDb()
        }


    }
}

