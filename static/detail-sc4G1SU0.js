import{B as X,E as k,C as Y}from"./element-V6-G1TdP.js";import{u as ee}from"./usePagination-rdI7J7GV.js";import{f as ae}from"./index-Y-UeT1O7.js";import{a as z,C as te,U as le,D as oe,G as ne,L as se}from"./index-K7uq35-Y.js";import{l as re,r as m,Z as U,b as ie,e as ue,ag as s,aq as B,m as v,p as de,V as b,M as C,O as a,u as r,S as u,q as h,T as e,R as q}from"./vue-ZDMaqQfr.js";import{_ as pe}from"./index-GmBho-p0.js";import"./vxe-SD4sv8pp.js";const ce={class:"app-container"},me={class:"toolbar-wrapper"},_e={class:"table-wrapper"},ve={class:"pager-wrapper"},fe=re({name:"dictDetail",__name:"detail",props:{dictId:{type:Number,required:!0}},setup(E){const x=E,y=m(!1),{paginationData:i,handleCurrentChange:I,handleSizeChange:N}=ee(),d=m(!1),V=m(null),n=m({}),O=U({label:[{required:!0,trigger:"blur",message:"请输入展示值"}],value:[{required:!0,trigger:"blur",message:"请输入字典值"}],sort:[{required:!0,trigger:"blur",message:"请输入排序标记"}],status:[{required:!0,trigger:"change",message:"请选择状态"}]}),R=()=>{var o;(o=V.value)==null||o.validate((t,p)=>{t?_.value===void 0?te({dict_id:x.dictId,...n.value}).then(()=>{k.success("新增成功"),f()}).finally(()=>{d.value=!1}):le(_.value,{...n.value}).then(()=>{k.success("修改成功"),f()}).finally(()=>{d.value=!1}):console.error("表单校验不通过",p)})},$=()=>{var o;_.value=void 0,(o=V.value)==null||o.resetFields(),n.value={}},L=o=>{Y.confirm("确定要删除吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{oe({id:[o.id]}).then(()=>{k.success("删除成功"),f()})})},_=m(void 0),M=o=>{ne(o.id).then(t=>{_.value=o.id,Object.assign(n.value,t.data||{}),d.value=!0})},w=m([]),S=U({keyword:"",status:void 0}),f=()=>{y.value=!0,se({page:i.currentPage,page_size:i.pageSize,dict_id:x.dictId,keyword:S.keyword||void 0,status:S.status||void 0}).then(o=>{i.total=o.data.total,w.value=o.data.list}).catch(()=>{w.value=[]}).finally(()=>{y.value=!1})};ie([()=>i.currentPage,()=>i.pageSize],f,{immediate:!0});const F=ue(()=>o=>ae(o));return(o,t)=>{const p=s("el-button"),c=s("el-table-column"),G=s("el-table"),j=s("el-pagination"),H=s("el-card"),P=s("el-input"),g=s("el-form-item"),T=s("el-radio"),Z=s("el-radio-group"),A=s("el-input-number"),J=s("el-form"),K=s("el-dialog"),D=B("permission"),Q=B("loading");return v(),de("div",ce,[b((v(),C(H,{shadow:"never"},{default:a(()=>[h("div",me,[h("div",null,[b((v(),C(p,{type:"primary",icon:r(X),onClick:t[0]||(t[0]=l=>d.value=!0)},{default:a(()=>[u("新增字典项")]),_:1},8,["icon"])),[[D,r(z)+"_POST"]])])]),h("div",_e,[e(G,{data:w.value},{default:a(()=>[e(c,{label:"ID",prop:"id"}),e(c,{label:"展示名称",prop:"label"}),e(c,{label:"字典值",prop:"value"}),e(c,{label:"启用状态",prop:"status","min-width":"110"},{default:a(l=>[u(q(l.row.status?"正常":"禁用"),1)]),_:1}),e(c,{label:"排序标记",prop:"sort"}),e(c,{prop:"updated_at",label:"更新于","min-width":"110"},{default:a(l=>[u(q(F.value(l.row.updated_at)),1)]),_:1}),e(c,{label:"操作",width:"150",align:"center"},{default:a(l=>[b((v(),C(p,{type:"primary",text:"",bg:"",size:"small",onClick:W=>M(l.row)},{default:a(()=>[u("修改")]),_:2},1032,["onClick"])),[[D,r(z)+"/:id_POST"]]),b((v(),C(p,{type:"danger",text:"",bg:"",size:"small",onClick:W=>L(l.row)},{default:a(()=>[u("删除")]),_:2},1032,["onClick"])),[[D,r(z)+"_DELETE"]])]),_:1})]),_:1},8,["data"])]),h("div",ve,[e(j,{background:"",layout:r(i).layout,"page-sizes":r(i).pageSizes,total:r(i).total,"page-size":r(i).pageSize,currentPage:r(i).currentPage,onSizeChange:r(N),onCurrentChange:r(I)},null,8,["layout","page-sizes","total","page-size","currentPage","onSizeChange","onCurrentChange"])])]),_:1})),[[Q,y.value]]),e(K,{modelValue:d.value,"onUpdate:modelValue":t[6]||(t[6]=l=>d.value=l),title:_.value===void 0?"新增":"修改",onClose:$,width:"30%"},{footer:a(()=>[e(p,{onClick:t[5]||(t[5]=l=>d.value=!1)},{default:a(()=>[u("取消")]),_:1}),e(p,{type:"primary",onClick:R},{default:a(()=>[u("确认")]),_:1})]),default:a(()=>[e(J,{ref_key:"formRef",ref:V,model:n.value,rules:O,"label-width":"100px","label-position":"right"},{default:a(()=>[e(g,{prop:"label",label:"展示值"},{default:a(()=>[e(P,{modelValue:n.value.label,"onUpdate:modelValue":t[1]||(t[1]=l=>n.value.label=l),placeholder:"请输入"},null,8,["modelValue"])]),_:1}),e(g,{prop:"value",label:"字典值"},{default:a(()=>[e(P,{modelValue:n.value.value,"onUpdate:modelValue":t[2]||(t[2]=l=>n.value.value=l),placeholder:"请输入"},null,8,["modelValue"])]),_:1}),e(g,{prop:"status",label:"状态"},{default:a(()=>[e(Z,{modelValue:n.value.status,"onUpdate:modelValue":t[3]||(t[3]=l=>n.value.status=l)},{default:a(()=>[e(T,{label:!0},{default:a(()=>[u("正常")]),_:1}),e(T,{label:!1},{default:a(()=>[u("禁用")]),_:1})]),_:1},8,["modelValue"])]),_:1}),e(g,{prop:"sort",label:"排序"},{default:a(()=>[e(A,{modelValue:n.value.sort,"onUpdate:modelValue":t[4]||(t[4]=l=>n.value.sort=l),autocomplete:"off"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue","title"])])}}}),De=pe(fe,[["__scopeId","data-v-6abb899e"]]);export{De as default};