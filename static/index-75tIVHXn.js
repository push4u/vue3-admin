import{r as e}from"./index-PXxC_NGL.js";const r="/v1/admin/dict";function o(t){return e({url:r,method:"post",data:t})}function a(t){return e({url:r,method:"delete",data:t})}function i(t,n){return e({url:r+"/"+t,method:"put",data:n})}function s(t){return e({url:r,method:"get",params:t})}function d(t){return e({url:r+"/"+t,method:"get"})}function m(t){return e({url:r+"Type/"+t,method:"get"})}export{o as C,a as D,d as G,s as L,i as U,r as a,m as b};
