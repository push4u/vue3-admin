import{r as e}from"./index-NDpfkETP.js";const r="/v1/admin/user";function o(t){return e({url:r,method:"post",data:t})}function a(t){return e({url:r,method:"delete",data:t})}function s(t,u){return e({url:r+"/"+t,method:"put",data:u})}function i(t){return e({url:r,method:"get",params:t})}function d(t){return e({url:r+"/"+t,method:"get"})}export{o as C,a as D,d as G,i as L,s as U,r as a};