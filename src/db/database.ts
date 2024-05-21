import { error } from 'node:console'
import fs from 'node:fs/promises'
const databasePath= new URL('../../database/db.json', import.meta.url)
 class Database{
    constructor(private database: Record<string, any[]>={}){
        fs.readFile(databasePath,'utf8')
        .then(data=>{
            this.database=JSON.parse(data)
        }).catch(()=>{
            this.save()
        })
    }
    private save(){
    fs.writeFile(databasePath,JSON.stringify(this.database))
}
    select(table:string,search:{}| null){
        let data = this.database[table]
        if (search) {
            data = data.filter(row => {
              return Object.entries(search).some(([key, value]) => {
                if (typeof value === 'string' && typeof row[key] === 'string') {
                    return row[key].toLowerCase().includes(value.toLowerCase());
                }
              })
            })
          }
        return data
    }

    selectById(table:string,id:string){
        const itemIndex= this.database[table].findIndex(row=>{
            return row.id===id
        })
        if(itemIndex > -1){
            return this.database[table][itemIndex]
        }
        return itemIndex
    }
    insert (table:string,data:any){
        console.log(this.database)
        if(Array.isArray(this.database[table])){
            this.database[table].push(data)
        }else{
           this.database[table]=[data]
        }
        this.save()
        return data
    }
    delete (table:string,id:string):any{
        const itemIndex= this.database[table].findIndex(row=>{
            return row.id===id
        })
        if(itemIndex > -1){
            this.database[table].splice(itemIndex,1)
            this.save()
        }
       return itemIndex
    }
    update(table:string,id:string,data:any){
        const itemIndex= this.database[table].findIndex(row=>{
            return row.id===id
        })
        if(itemIndex > -1){
            this.database[table][itemIndex]={id,...data}
            this.save()
        }

        return itemIndex

    }
}
export const database= new Database()