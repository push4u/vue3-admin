import{A as ne,r as ue,B as ie,G as de,E as y,C as pe}from"./element-V6-G1TdP.js";import{u as me}from"./usePagination-rdI7J7GV.js";import{j as ce,_ as ge}from"./index-blnq_8Yi.js";import{a as R,C as fe,U as ve,D as _e,G as he,L as be}from"./index-17t7FlNv.js";import{S as Ve}from"./index-Uhu9hv9U.js";import{S as we}from"./index-OH-Q5JHd.js";import{a as ye}from"./index-dIPxxPfs.js";import{l as ke,r as f,Z as T,b as Ce,ag as m,aq as j,m as v,p as A,V as k,M as b,O as o,T as e,u as n,S as V,q as C,R as Se,Q as Ue}from"./vue-ZDMaqQfr.js";import"./vxe-SD4sv8pp.js";const De={class:"app-container"},Pe={class:"toolbar-wrapper"},qe={class:"table-wrapper"},xe={class:"pager-wrapper"},ze=["src"],Be=ke({name:"user",__name:"index",setup(Ee){const S=f(!1),{paginationData:i,handleCurrentChange:F,handleSizeChange:I}=me(),h=f(!1),x=f(null),t=f({}),L=T({username:[{required:!0,trigger:"blur",message:"请输入用户名"}],password:[{required:!0,trigger:"blur",message:"请输入密码"}],confirm_password:[{required:!0,trigger:"blur",message:"请确认密码"}],nickname:[{required:!0,trigger:"blur",message:"请输入姓名"}],phone:[{required:!0,trigger:"blur",message:"请输入手机号"}],email:[{required:!0,trigger:"blur",message:"请输入邮箱"}],group_id:[{required:!0,trigger:"change",message:"请选择部门"}],roles:[{required:!0,trigger:"change",message:"请选择角色"}]}),O=T({username:[{required:!0,trigger:"blur",message:"请输入用户名"}],nickname:[{required:!0,trigger:"blur",message:"请输入姓名"}],phone:[{required:!0,trigger:"blur",message:"请输入手机号"}],email:[{required:!0,trigger:"blur",message:"请输入邮箱"}],group_id:[{required:!0,trigger:"change",message:"请选择部门"}],roles:[{required:!0,trigger:"change",message:"请选择角色"}]}),J=ce(),Q="https://demo.push4u.com",Z=r=>{t.value.avatar=r.data.id,t.value.avatar_file=r.data},H=r=>r.type!=="image/jpeg"&&r.type!=="image/jpg"&&r.type!=="image/png"?(y.error("头像图片只能是 JPG 或 PNG 格式!"),!1):r.size/1024/1024>2?(y.error("头像图片大小不能超过 2MB!"),!1):!0,K=()=>{var r;(r=x.value)==null||r.validate((l,d)=>{l?g.value===void 0?fe(t.value).then(()=>{y.success("新增成功"),w()}).finally(()=>{h.value=!1}):ve(g.value,{...t.value}).then(()=>{y.success("修改成功"),w()}).finally(()=>{h.value=!1}):console.error("表单校验不通过",d)})},W=()=>{var r;g.value=void 0,(r=x.value)==null||r.resetFields(),t.value={}},X=r=>{pe.confirm("确定要删除该用户吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{_e({id:[r.id]}).then(()=>{y.success("删除成功"),w()})})},g=f(void 0),Y=r=>{he(r.id).then(l=>{var s,u;g.value=l.data.id,Object.assign(t.value,l.data||{});const d=l.data;if((((s=d.roles)==null?void 0:s.length)??0)>0){const p=[];(u=d.roles)==null||u.forEach(P=>{p.push(P.id)}),t.value.roles=p}h.value=!0})},U=f([]),G=f(null),c=T({group_id:0,role_id:0,keyword:""}),w=()=>{S.value=!0,be({page:i.currentPage,page_size:i.pageSize,group_id:c.group_id,role_id:c.role_id,keyword:c.keyword}).then(r=>{i.total=r.data.total,U.value=r.data.list,U.value.forEach(l=>{var d,s;if((((d=l.roles)==null?void 0:d.length)??0)>0){let u="";(s=l.roles)==null||s.forEach(p=>{u=u+p.name+","}),l.roleDataForDisplay=u.slice(0,-1)}})}).catch(()=>{U.value=[]}).finally(()=>{S.value=!1})},$=()=>{i.currentPage===1?w():i.currentPage=1},ee=()=>{var r;(r=G.value)==null||r.resetFields(),$()},D={checkStrictly:!0,emitPath:!1},le={...D,multiple:!0},z=f([]);(()=>{Ve().then(r=>{z.value=r.data})})();const B=f([]);return(()=>{we().then(r=>{B.value=r.data})})(),Ce([()=>i.currentPage,()=>i.pageSize],w,{immediate:!0}),(r,l)=>{const d=m("el-cascader"),s=m("el-form-item"),u=m("el-input"),p=m("el-button"),P=m("el-form"),M=m("el-card"),_=m("el-table-column"),ae=m("el-table"),oe=m("el-pagination"),te=m("el-icon"),re=m("el-upload"),se=m("el-dialog"),N=j("loading"),E=j("permission");return v(),A("div",De,[k((v(),b(M,{shadow:"never",class:"search-wrapper"},{default:o(()=>[e(P,{ref_key:"searchFormRef",ref:G,inline:!0,model:c},{default:o(()=>[e(s,{prop:"group_id",label:"部门"},{default:o(()=>[e(d,{modelValue:c.group_id,"onUpdate:modelValue":l[0]||(l[0]=a=>c.group_id=a),options:B.value,props:D,placeholder:"请选择","show-all-levels":!1,clearable:""},null,8,["modelValue","options"])]),_:1}),e(s,{prop:"role",label:"角色"},{default:o(()=>[e(d,{modelValue:c.role_id,"onUpdate:modelValue":l[1]||(l[1]=a=>c.role_id=a),options:z.value,props:D,placeholder:"请选择","show-all-levels":!1,clearable:""},null,8,["modelValue","options"])]),_:1}),e(s,{prop:"keyword",label:"关键字"},{default:o(()=>[e(u,{modelValue:c.keyword,"onUpdate:modelValue":l[2]||(l[2]=a=>c.keyword=a),placeholder:"请输入"},null,8,["modelValue"])]),_:1}),e(s,null,{default:o(()=>[e(p,{type:"primary",icon:n(ne),onClick:$},{default:o(()=>[V("查询")]),_:1},8,["icon"]),e(p,{icon:n(ue),onClick:ee},{default:o(()=>[V("重置")]),_:1},8,["icon"])]),_:1})]),_:1},8,["model"])]),_:1})),[[N,S.value]]),k((v(),b(M,{shadow:"never"},{default:o(()=>[C("div",Pe,[C("div",null,[k((v(),b(p,{type:"primary",icon:n(ie),onClick:l[3]||(l[3]=a=>h.value=!0)},{default:o(()=>[V("新增用户")]),_:1},8,["icon"])),[[E,n(R)+"_POST"]])])]),C("div",qe,[e(ae,{data:U.value},{default:o(()=>[e(_,{prop:"id",label:"ID","min-width":"110"}),e(_,{prop:"username",label:"用户名","min-width":"110"}),e(_,{prop:"nickname",label:"姓名","min-width":"160",sortable:""}),e(_,{prop:"phone",label:"手机号","min-width":"110"}),e(_,{prop:"email",label:"邮箱","min-width":"110"}),e(_,{prop:"group",label:"部门","min-width":"110"},{default:o(a=>{var q;return[C("span",null,Se((q=a.row.group)==null?void 0:q.name),1)]}),_:1}),e(_,{prop:"roleDataForDisplay",label:"角色","min-width":"110"}),e(_,{label:"操作",width:"150",align:"center"},{default:o(a=>[k((v(),b(p,{type:"primary",text:"",bg:"",size:"small",onClick:q=>Y(a.row)},{default:o(()=>[V("修改")]),_:2},1032,["onClick"])),[[E,n(R)+"/:id_PUT"]]),k((v(),b(p,{type:"danger",text:"",bg:"",size:"small",disabled:a.row.id==1,onClick:q=>X(a.row)},{default:o(()=>[V("删除")]),_:2},1032,["disabled","onClick"])),[[E,n(R)+"_DELETE"]])]),_:1})]),_:1},8,["data"])]),C("div",xe,[e(oe,{background:"",layout:n(i).layout,"page-sizes":n(i).pageSizes,total:n(i).total,"page-size":n(i).pageSize,currentPage:n(i).currentPage,onSizeChange:n(I),onCurrentChange:n(F)},null,8,["layout","page-sizes","total","page-size","currentPage","onSizeChange","onCurrentChange"])])]),_:1})),[[N,S.value]]),e(se,{modelValue:h.value,"onUpdate:modelValue":l[13]||(l[13]=a=>h.value=a),title:g.value===void 0?"新增":"修改",onClose:W,width:"30%"},{footer:o(()=>[e(p,{onClick:l[12]||(l[12]=a=>h.value=!1)},{default:o(()=>[V("取消")]),_:1}),e(p,{type:"primary",onClick:K},{default:o(()=>[V("确认")]),_:1})]),default:o(()=>[e(P,{ref_key:"formRef",ref:x,model:t.value,rules:g.value===void 0?L:O,"validate-on-rule-change":!1,"label-width":"100px","label-position":"right"},{default:o(()=>[e(s,{prop:"username",label:"用户名"},{default:o(()=>[e(u,{modelValue:t.value.username,"onUpdate:modelValue":l[4]||(l[4]=a=>t.value.username=a),placeholder:"请输入",disabled:g.value!==void 0},null,8,["modelValue","disabled"])]),_:1}),e(s,{prop:"password",label:"密码"},{default:o(()=>[e(u,{modelValue:t.value.password,"onUpdate:modelValue":l[5]||(l[5]=a=>t.value.password=a),placeholder:"请输入"},null,8,["modelValue"])]),_:1}),g.value===void 0?(v(),b(s,{key:0,prop:"confirm_password",label:"确认密码"},{default:o(()=>[e(u,{modelValue:t.value.confirm_password,"onUpdate:modelValue":l[6]||(l[6]=a=>t.value.confirm_password=a),placeholder:"请输入"},null,8,["modelValue"])]),_:1})):Ue("",!0),e(s,{prop:"nickname",label:"姓名"},{default:o(()=>[e(u,{modelValue:t.value.nickname,"onUpdate:modelValue":l[7]||(l[7]=a=>t.value.nickname=a),placeholder:"请输入"},null,8,["modelValue"])]),_:1}),e(s,{prop:"phone",label:"手机号"},{default:o(()=>[e(u,{modelValue:t.value.phone,"onUpdate:modelValue":l[8]||(l[8]=a=>t.value.phone=a),placeholder:"请输入"},null,8,["modelValue"])]),_:1}),e(s,{prop:"email",label:"邮箱"},{default:o(()=>[e(u,{modelValue:t.value.email,"onUpdate:modelValue":l[9]||(l[9]=a=>t.value.email=a),placeholder:"请输入"},null,8,["modelValue"])]),_:1}),e(s,{prop:"group_id",label:"部门"},{default:o(()=>[e(d,{modelValue:t.value.group_id,"onUpdate:modelValue":l[10]||(l[10]=a=>t.value.group_id=a),options:B.value,props:D,placeholder:"请选择","show-all-levels":!1,clearable:""},null,8,["modelValue","options"])]),_:1}),e(s,{prop:"roles",label:"角色"},{default:o(()=>[e(d,{modelValue:t.value.roles,"onUpdate:modelValue":l[11]||(l[11]=a=>t.value.roles=a),options:z.value,props:le,disabled:g.value==1,placeholder:"请选择","show-all-levels":!1,clearable:""},null,8,["modelValue","options","disabled"])]),_:1}),e(s,{label:"头像","label-width":"80px"},{default:o(()=>[e(re,{class:"avatar-uploader",action:`${n(Q)+ye}`,"show-file-list":!1,headers:{Authorization:"Bearer "+n(J)},"on-success":Z,"before-upload":H},{default:o(()=>[t.value.avatar_file&&t.value.avatar_file.url.length>0?(v(),A("img",{key:0,src:t.value.avatar_file&&t.value.avatar_file.url,class:"avatar"},null,8,ze)):(v(),b(te,{key:1,class:"avatar-uploader-icon"},{default:o(()=>[e(n(de))]),_:1}))]),_:1},8,["action","headers"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue","title"])])}}}),Oe=ge(Be,[["__scopeId","data-v-5e2c06f7"]]);export{Oe as default};
