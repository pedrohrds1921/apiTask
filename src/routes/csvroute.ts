import { IncomingMessage, ServerResponse } from "node:http"
import { Task } from "../db/models/task"
import { randomUUID } from "node:crypto"
import { database } from "../db/database"
import csvParser from "../../node_modules/csv-parser/index"
import { pipeline, Readable, Transform, Writable } from "node:stream"
import { promisify } from "node:util"
import { createReadStream } from "node:fs"
const csvPath = new URL('../../task.csv',import.meta.url)
const pipelineAsync = promisify(pipeline);


export async function csvImport(){
    const stream= createReadStream(csvPath)
    const convertLine = new Transform({
        objectMode:true,
        transform(chunk,encoding,callback){
        const task:Task={
            id: String(randomUUID()),
            completed_at:null,
            title:chunk.title,
            description:chunk.description,
            updated_at:new Date() 
        }
        callback(null,task)
        }
    })
    const saveInDB = new Writable({
        objectMode:true,
      async write(chunk,encoding,callback){
         await database.insert('task',chunk)
         callback()
        }
    })

    await pipelineAsync(
        stream,
        csvParser({separator:';'}),
        convertLine,
        saveInDB
    )
}