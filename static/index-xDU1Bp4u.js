import{l as k,aE as C,r as g,Z as S,ag as l,m as I,p as M,T as e,q as h,O as a,u as c,a2 as U,S as q,a8 as z,aH as F,aI as R}from"./vue-ZDMaqQfr.js";import{G as B,c as N,e as E,_ as G}from"./index-6ZzXudcC.js";import{t as H,v as K,w as P,x as T,y as A}from"./element-V6-G1TdP.js";import{_ as D}from"./index.vue_vue_type_script_setup_true_lang-74Kndb01.js";import"./vxe-SD4sv8pp.js";const L=p=>(F("data-v-8fd1877b"),p=p(),R(),p),O={class:"login-container"},Z={class:"login-card"},$=L(()=>h("div",{class:"title"},"Admin",-1)),j={class:"content"},J=k({__name:"index",setup(p){const w=C(),x=g(null),m=g(!1),_=g(""),o=S({username:"admin",password:"12345678"}),b={username:[{required:!0,message:"请输入用户名",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:5,max:16,message:"长度在 5 到 16 个字符",trigger:"blur"}],captcha:[{required:!0,message:"请输入验证码",trigger:"blur"}]},v=()=>{var r;(r=x.value)==null||r.validate((t,n)=>{if(t){m.value=!0;const s=N();s.login(o).then(()=>{s.getMy(),E().fetchPermissions()}).then(()=>{var i,u;w.push({path:((u=(i=s.user)==null?void 0:i.option)==null?void 0:u.default_router)||"/welcome"})}).catch(()=>{f(),o.password=""}).finally(()=>{m.value=!1})}else console.error("表单校验不通过",n)})},f=()=>{o.captcha="",o.captcha_id="",_.value="",B().then(r=>{_.value=r.data.pic_path,o.captcha_id=r.data.captcha_id})};return f(),(r,t)=>{const n=l("el-input"),s=l("el-form-item"),i=l("el-icon"),u=l("el-image"),y=l("el-button"),V=l("el-form");return I(),M("div",O,[e(D,{class:"theme-switch"}),h("div",Z,[$,h("div",j,[e(V,{ref_key:"loginFormRef",ref:x,rules:b,model:o,onKeyup:z(v,["enter"])},{default:a(()=>[e(s,{prop:"username"},{default:a(()=>[e(n,{modelValue:o.username,"onUpdate:modelValue":t[0]||(t[0]=d=>o.username=d),modelModifiers:{trim:!0},placeholder:"用户名",type:"text",tabindex:"1","prefix-icon":c(H),size:"large"},null,8,["modelValue","prefix-icon"])]),_:1}),e(s,{prop:"password"},{default:a(()=>[e(n,{modelValue:o.password,"onUpdate:modelValue":t[1]||(t[1]=d=>o.password=d),modelModifiers:{trim:!0},placeholder:"密码",type:"password",tabindex:"2","prefix-icon":c(K),size:"large","show-password":""},null,8,["modelValue","prefix-icon"])]),_:1}),e(s,{prop:"captcha"},{default:a(()=>[e(n,{modelValue:o.captcha,"onUpdate:modelValue":t[2]||(t[2]=d=>o.captcha=d),modelModifiers:{trim:!0},placeholder:"验证码",type:"text",tabindex:"3","prefix-icon":c(P),maxlength:"7",size:"large"},{append:a(()=>[e(u,{src:_.value,onClick:f,draggable:"false"},{placeholder:a(()=>[e(i,null,{default:a(()=>[e(c(T))]),_:1})]),error:a(()=>[e(i,null,{default:a(()=>[e(c(A))]),_:1})]),_:1},8,["src"])]),_:1},8,["modelValue","prefix-icon"])]),_:1}),e(y,{loading:m.value,type:"primary",size:"large",onClick:U(v,["prevent"])},{default:a(()=>[q("登 录")]),_:1},8,["loading"])]),_:1},8,["model"])])])])}}}),oe=G(J,[["__scopeId","data-v-8fd1877b"]]);export{oe as default};
