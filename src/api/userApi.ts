import base from './base'
import req from './request'
// import UserNS from '@/'

interface IViewApi{
    prompt_id:string;
    client_id:string;
}
export const getViewApi=(queryParams:IViewApi)=>{
    return req.get<any,any>(base.view,{params:queryParams})

}