import { IncomingMessage, ServerResponse } from "http";
import { database } from "../db/database";
import { Task } from "../db/models/task";
import { randomUUID } from "crypto";
import { buildRoutePath } from "../utils/build-route-path";
import { csvImport } from "./csvroute";

export const routes= [
    {
        method:'POST',
        path:buildRoutePath('/task/csv'),
        handler:async (req:IncomingMessage,res:ServerResponse)=>{
           await csvImport()
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({mensage:'Importação Realizada'})) 

        }
    },
    {
        method:'POST',
        path:buildRoutePath('/task'),
        handler:(req:IncomingMessage,res:ServerResponse)=>{
            const {title,description}=req.body
            const task:Task={
                id: String(randomUUID()),
                completed_at:null,
                title,
                description,
                updated_at:new Date()
            }
            database.insert('task',task)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(task)) 

        }
    },
    {
        method:'GET',
        path:buildRoutePath('/task'),
        handler:(req:IncomingMessage,res:ServerResponse)=>{
            const { search}=req.query
           const data= database.select('task',search ?{
            title:search,
            description:search
        }:null)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data)) 

        }
    },
    {
            method:'DELETE',
            path:buildRoutePath('/task/:id'),
            handler:(req:IncomingMessage,res:ServerResponse)=>{
                const {id}=req.params
                const result =database.delete('task',id)
                if(result <= -1){
                    res.setHeader('Content-Type', ' text/html')
                    return   res.writeHead(403).end('Id nao encontrado')
                }
                res.writeHead(204).end()
        }
    },
    {
        method:'PUT',
        path:buildRoutePath('/task/:id'),
        handler:(req:IncomingMessage,res:ServerResponse)=>{
            const {id}=req.params
            const {title, description}= req.body
            const task= database.selectById('task',id)
            const taskUpdated:Task={
                id:task.id,
                completed_at:task.completed_at,
                description: description ?? task.description,
                title:title ?? task.title,
                updated_at: new Date()
            }
            database.update('task',id,taskUpdated)

            if(task <= -1){
                res.setHeader('Content-Type', ' text/html')
                return res.writeHead(403).end('Id nao encontrado')
            }
            res.writeHead(204).end()
        }
    },
    {
        method:'PATCH',
        path:buildRoutePath('/task/:id/complete'),
        handler:(req:IncomingMessage,res:ServerResponse)=>{
            const {id}=req.params
            const task= database.selectById('task',id)
            if(task <= -1){
                res.setHeader('Content-Type', ' text/html')
                return res.writeHead(403).end('Id nao encontrado')
            }
            if(task.completed_at===null){
            task.completed_at=new Date
            task.updated_at= new Date
            }else{
                task.completed_at=null
                task.updated_at= new Date
            }
            database.update('task',id,task)
            res.writeHead(204).end()
        }
    }

]