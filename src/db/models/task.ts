import { RandomUUIDOptions } from "crypto";


export interface Task{

    id: string;
    title:string;
    description:string;
    completed_at:Date | null;
    updated_at:Date

}