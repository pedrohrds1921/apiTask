export function extractQueryPath(query: string): { [key: string]: string } | {}{
    return query.slice(1).split('&').reduce((queryParams,param)=>{
    const [key,value]= param.split('=')
    queryParams[key]=value
    return queryParams
    },{} as { [key: string]: string } )

}