import {trafficCollection} from "./db";
import {ObjectId, WithId} from "mongodb";


export type RecordType = {
    ip: string,
    date: Date
    process:string
}

export const accessAttemptsDbRepositories = {
    async countDate(record:RecordType):Promise< WithId<Document>[]>{
        const ipFound = await trafficCollection.find({"ip": record.ip,"process":record.process}).toArray()


        return ipFound.map(val => (val.date)).slice(Math.max(ipFound.length - 6, 0))

    } ,



    async createRecord(record: RecordType):Promise<WithId<Document>[]> {
        await trafficCollection.insertOne(record)
        return await this.countDate(record)



    }
}