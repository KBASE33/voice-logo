import base from './base'
import req from './request'
export const postGenerateApi=(fd:any,queryParams:any)=>{
    return req.post<any,any>(base.generate,fd,{
        params: queryParams
    })
}
export const postLogo=(jsonData:any)=>{
    return req.post<any,any>(base.logopost,jsonData)
}