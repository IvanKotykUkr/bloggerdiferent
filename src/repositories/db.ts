import {MongoClient} from 'mongodb'
import {settings} from "../settings";


export const client = new MongoClient(settings.MONGO_URL);
const db = client.db("api")
export const bloggerCollection = db.collection("bloggers");
export const postsCollection = db.collection("posts");
export const usersCollection = db.collection("users");
export const commentsCollection = db.collection("comment");
export const trafficCollection= db.collection("traffic");
export const tokenCollection = db.collection("tokens")

export async function runDb() {
    try {
        await client.connect();
        await client.db("blogger").command({ping: 1});
        console.log("Connected successfully to mongo server")
    } catch {
        await client.close();
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

