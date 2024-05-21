import { IncomingMessage, ServerResponse } from "http";
declare module 'http' {
    interface IncomingMessage {
        body: any;
        params:any;
        query:any
    }
}
export async function json(req:IncomingMessage, res:ServerResponse) {
    
    res.setHeader('Content-Type', 'application/json')
    const buffer:any[]= []
    for await (const chunk of req){
        buffer.push(chunk)
    }
    try {
        req.body= JSON.parse(Buffer.concat(buffer).toString())
    }catch{
        req.body=null
    }
}