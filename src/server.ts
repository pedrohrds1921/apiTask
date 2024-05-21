import http from 'node:http'
import { routes } from './routes/index'
import { json } from './miidleware/bodyJson'
import { extractQueryPath } from './utils/extract-query-path'


const server= http.createServer(async(req, res)=>{
   await json(req,res)
   const { method,url}=req
   const router =routes.find(route=>{
      return route.method===method && route.path.test(url||'')
   })
   if(router){
      const routeParam= (req.url || '').match(router.path)
      if (routeParam && routeParam.groups) {
         const {query,...params}=routeParam?.groups
         req.params= params
         req.query= query ? extractQueryPath(query):{}
         return  router.handler(req,res)
      }
   }
})
server.listen(3333,()=>{
console.log('Server runnig')
})
