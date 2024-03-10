import{B as ae,E as U,C as le}from"./element-V6-G1TdP.js";import{u as te}from"./usePagination-rdI7J7GV.js";import{f as oe}from"./index-Y-UeT1O7.js";import{a as z,C as ne,U as re,D as se,G as ie,L as ue,S as de}from"./index-WMqIDYIB.js";import{L as pe}from"./index-RfOB3oMY.js";import{l as ce,r as _,Z as me,b as _e,e as ve,ag as i,aq as q,m as f,p as fe,V as g,M as b,O as l,u,S as d,q as x,T as t,R as D}from"./vue-ZDMaqQfr.js";import{_ as ge}from"./index-GmBho-p0.js";import"./vxe-SD4sv8pp.js";const be={class:"app-container"},he={class:"toolbar-wrapper"},Ce={class:"table-wrapper"},we={class:"pager-wrapper"},ye=ce({name:"group",__name:"index",setup(Ve){const S=_(!1),{paginationData:p,handleCurrentChange:$,handleSizeChange:G}=te(),m=_(!1),k=_(null),s=_({}),I=me({name:[{required:!0,trigger:"blur",message:"请输入名称"}],sort:[{required:!0,trigger:"blur",message:"请输入排序"}],status:[{required:!0,trigger:"change",message:"请选择启用状态"}],parent_id:[{required:!0,validator:(a,e,n)=>{e==null||e===""?n(new Error("请选择上级部门")):e===c.value?n(new Error("不能选择本部门为上级部门")):n()},trigger:"change"}]}),M=()=>{var a;w(),(a=k.value)==null||a.validate((e,n)=>{e?c.value===void 0?ne(s.value).then(()=>{U.success("新增成功"),h()}).finally(()=>{m.value=!1}):re(c.value,{...s.value}).then(()=>{U.success("修改成功"),h()}).finally(()=>{m.value=!1}):console.error("表单校验不通过",n)})},R=a=>{w(),s.value.parent_id=a.id,m.value=!0},N=()=>{var a;c.value=void 0,(a=k.value)==null||a.resetFields(),s.value={}},F=a=>{le.confirm("确定要删除吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{se({id:[a.id]}).then(()=>{U.success("删除成功"),h()})})},c=_(void 0),j=a=>{ie(a.id).then(e=>{w(),c.value=e.data.id,Object.assign(s.value,e.data||{}),m.value=!0})},P=_([]),h=()=>{S.value=!0,ue({page:p.currentPage,page_size:p.pageSize}).then(a=>{p.total=a.data.total,P.value=a.data.list,w()}).catch(()=>{P.value=[]}).finally(()=>{S.value=!1})},H=_([]);(()=>{pe({page:1,page_size:999}).then(a=>{H.value=a.data.list})})();const C=_([{value:0,label:"顶级部门"}]),Z=()=>{C.value.splice(0,C.value.length,{value:0,label:"顶级部门"})},T=(a,e,n)=>{a&&a.map(r=>{if(r.children&&r.children.length){const v={label:r.label,value:r.value,disabled:n||r.value===c.value,children:[]};T(r.children,v.children,n||v.value===c.value),e.push(v)}else{const v={label:r.label,value:r.value,disabled:n||r.value===c.value};e.push(v)}})},A={checkStrictly:!0,disabled:"disabled",emitPath:!1},w=()=>{Z(),de().then(a=>{T(a.data,C.value,!1)})};_e([()=>p.currentPage,()=>p.pageSize],h,{immediate:!0});const E=ve(()=>a=>oe(a));return(a,e)=>{const n=i("el-button"),r=i("el-table-column"),v=i("el-table"),J=i("el-pagination"),K=i("el-card"),B=i("el-input"),y=i("el-form-item"),Q=i("el-cascader"),L=i("el-radio"),W=i("el-radio-group"),X=i("el-form"),Y=i("el-dialog"),V=q("permission"),ee=q("loading");return f(),fe("div",be,[g((f(),b(K,{shadow:"never"},{default:l(()=>[x("div",he,[x("div",null,[g((f(),b(n,{type:"primary",icon:u(ae),onClick:e[0]||(e[0]=o=>m.value=!0)},{default:l(()=>[d("新增部门")]),_:1},8,["icon"])),[[V,u(z)+"_POST"]])])]),x("div",Ce,[t(v,{data:P.value,"row-key":"id"},{default:l(()=>[t(r,{prop:"name",label:"部门名称","min-width":"130"}),t(r,{prop:"sort",label:"排序","min-width":"110"}),t(r,{prop:"status",label:"启用","min-width":"110"},{default:l(o=>[d(D(o.row.status?"是":"否"),1)]),_:1}),t(r,{prop:"created_at",label:"创建时间","min-width":"160",sortable:""},{default:l(o=>[d(D(E.value(o.row.created_at)),1)]),_:1}),t(r,{prop:"updated_at",label:"最后更新时间","min-width":"160",sortable:""},{default:l(o=>[d(D(E.value(o.row.updated_at)),1)]),_:1}),t(r,{label:"操作",width:"200",align:"center"},{default:l(o=>[g((f(),b(n,{type:"primary",text:"",bg:"",size:"small",onClick:O=>R(o.row)},{default:l(()=>[d("子部门")]),_:2},1032,["onClick"])),[[V,u(z)+"_POST"]]),g((f(),b(n,{type:"primary",text:"",bg:"",size:"small",onClick:O=>j(o.row)},{default:l(()=>[d("修改")]),_:2},1032,["onClick"])),[[V,u(z)+"/:id_PUT"]]),g((f(),b(n,{type:"danger",text:"",bg:"",size:"small",onClick:O=>F(o.row)},{default:l(()=>[d("删除")]),_:2},1032,["onClick"])),[[V,u(z)+"_DELETE"]])]),_:1})]),_:1},8,["data"])]),x("div",we,[t(J,{background:"",layout:u(p).layout,"page-sizes":u(p).pageSizes,total:u(p).total,"page-size":u(p).pageSize,currentPage:u(p).currentPage,onSizeChange:u(G),onCurrentChange:u($)},null,8,["layout","page-sizes","total","page-size","currentPage","onSizeChange","onCurrentChange"])])]),_:1})),[[ee,S.value]]),t(Y,{modelValue:m.value,"onUpdate:modelValue":e[6]||(e[6]=o=>m.value=o),title:c.value===void 0?"新增":"修改",onClose:N,width:"30%"},{footer:l(()=>[t(n,{onClick:e[5]||(e[5]=o=>m.value=!1)},{default:l(()=>[d("取消")]),_:1}),t(n,{type:"primary",onClick:M},{default:l(()=>[d("确认")]),_:1})]),default:l(()=>[t(X,{ref_key:"formRef",ref:k,model:s.value,rules:I,"label-width":"100px","label-position":"right"},{default:l(()=>[t(y,{prop:"name",label:"部门名称"},{default:l(()=>[t(B,{modelValue:s.value.name,"onUpdate:modelValue":e[1]||(e[1]=o=>s.value.name=o),placeholder:"请输入"},null,8,["modelValue"])]),_:1}),t(y,{prop:"parent_id",label:"上级部门"},{default:l(()=>[t(Q,{modelValue:s.value.parent_id,"onUpdate:modelValue":e[2]||(e[2]=o=>s.value.parent_id=o),options:C.value,props:A,placeholder:"请选择","show-all-levels":!1,clearable:""},null,8,["modelValue","options"])]),_:1}),t(y,{prop:"sort",label:"排序"},{default:l(()=>[t(B,{modelValue:s.value.sort,"onUpdate:modelValue":e[3]||(e[3]=o=>s.value.sort=o),modelModifiers:{number:!0},placeholder:"请输入"},null,8,["modelValue"])]),_:1}),t(y,{prop:"status",label:"是否启用"},{default:l(()=>[t(W,{modelValue:s.value.status,"onUpdate:modelValue":e[4]||(e[4]=o=>s.value.status=o)},{default:l(()=>[t(L,{label:1},{default:l(()=>[d("是")]),_:1}),t(L,{label:0},{default:l(()=>[d("否")]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue","title"])])}}}),Le=ge(ye,[["__scopeId","data-v-2b31b5f0"]]);export{Le as default};