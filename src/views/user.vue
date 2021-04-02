<template>
   <div style="background: #FFFFFF;">
       <!-- 用户列表卡片 -->
       <!-- <el-card class="box-card"> -->
          <el-form :inline="true" :model="UserInfoVo" class="demo-form-inline">
            <el-form-item label="部门" label-width="70px" >
               <el-select v-model="UserInfoVo.depId" clearable  placeholder="请选择"  >
                  <el-option
                    v-for="item in departments"
                    :key="item.dpId"
                    :label="item.departmentName"
                    :value="item.dpId" >
                    <span style="float:left">{{item.departmentName}}</span>
                    <span style="float: right;color: #409EFF;font-size: 13px;">
                        <span class="el-tag el-tag--success el-tag--mini el-tag--plain">{{item.deptCount}}</span>
                    </span>
                  </el-option>
              </el-select>
             </el-form-item>
             
            <!-- <el-form-item label="用户名" label-width="70px">
              <el-input clearable  v-model="UserInfoVo.userName" placeholder="请输入用户名"></el-input>
            </el-form-item> -->
            
            <el-form-item label="邮箱" label-width="70px">
              <el-input v-model="UserInfoVo.email" clearable placeholder="请输入邮箱"></el-input>
            </el-form-item>
            
             <el-radio-group v-model="UserInfoVo.sex" label-width="70px">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
                <el-radio label="">全部</el-radio>
              </el-radio-group>
                <br />
              <el-form-item label="昵称" label-width="70px">
                <el-input clearable  v-model="UserInfoVo.nickname" placeholder="请输入昵称"></el-input>
              </el-form-item>
            <!-- 按钮 -->
            <el-form-item style="margin-left: 10px;">
                <el-row>
                  <el-button icon="el-icon-refresh" @click="resetUserInfoVO()">重置</el-button>
                  <el-button type="primary" icon="el-icon-search" @click="findLists()">查询</el-button>
                  <el-button type="success" icon="el-icon-plus" @click="show">添加</el-button>
                  <el-button type="warning" icon="el-icon-download">导出</el-button> 
                </el-row>
            </el-form-item>
          </el-form>
          
       <!--  // 表格显示 -->
          <el-table
              :data="userList"
              border
              style="width: 100%;height:600px;">
              <el-table-column
                prop="userId"
                label="#"
                width="50">
              </el-table-column>
              <el-table-column
                sortable
                prop="departmentName"
                label="部门"
                width="150">
              </el-table-column>
              <el-table-column
                sortable
                prop="nickname"
                label="昵称"
                width="150">
              </el-table-column>
              <el-table-column
                prop="sex"
                label="性别"
                 width="100">
                 <template slot-scope="scope">{{scope.row.sex==0?'男':(scope.row.sex==1?'女':'保密')}}</template>
                 
              </el-table-column>
              <el-table-column
                prop="birthday"
                label="生日"
                 width="200" >> 
                  <template slot-scope="scope">{{scope.row.birthday| dateYMDHMSFormat}}</template>

              </el-table-column>
              <el-table-column
                prop="phone"
                label="手机号"
                 width="150">
              </el-table-column>
              <el-table-column
                prop="email"
                label="邮箱"
                 width="150">
              </el-table-column>
              <el-table-column
                prop="delflag"
                label="是否禁用"
                 width="100">
                
                   <template slot-scope="scope">
                     <el-switch
                       v-model="scope.row.delflag"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                     >
                     </el-switch>
                   </template>
                 
                  
              </el-table-column>
              
              <el-table-column
                label="操作">
                <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                <el-button type="warning" size="mini" icon="el-icon-s-tools"></el-button>
              </el-table-column>
            </el-table>
            
            <!-- 新增编辑弹框子组件 -->
            <user-info-add :addOrUpdateVisible="addOrUpdateVisible" @changeShow="showAddOrUpdate" ref="UserInfoAdd"></user-info-add>

            <!-- 分页 -->
            <div class="block">
                
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
              </div>
       <!-- </el-card> -->
   </div>
</template>

<script>
    // import Home from "../views/Home" 
    import UserInfoAdd from '../components/common/UserInfoAdd.vue'
   
    export default{
        // 使用子组件
           components:{
               UserInfoAdd
           },
         name: 'Main',
         data() {
              return {
                value:'',
                //每页显示条数
                pageSize:10,
                //总记录条数
                total:7,
                //初始页数      
                currentPage:1,  
                 
                // 用户信息集合 静态数据
                userList: [{
                          userId: '1',
                          departmentName: '研发部',
                          nickname: '张小虎',
                          sex:1,
                          birthday:"2016-05-02",
                          phone:"13452850922",
                          email:"13452850922@qq.com"
                        }],
                departments: [],
                UserInfoVo:{
                      "depId": "",
                      "departmentName": "",
                      "email": "",
                      "nickname": "",
                      "phone": "",
                      "sex": "",
                      "userName": ""
                    },
                // 控制新增编辑弹窗的显示与隐藏
                addOrUpdateVisible: false
                
              }
            },
            //创建组件时调用方法
            created(){
                  this.findLists();
                  this.findDeptAndCount();
            }, 
            methods: {
                //当每页条数改变时
               handleSizeChange(val) {
                   this.pageSize=val;
                   this.findLists();
                   console.log(`每页 ${val} 条`);
                  },
                // 当页码改变时
                handleCurrentChange(val) {
                      this.currentPage=val;
                      this.findLists();
                      console.log(`当前页: ${val}`);
                    }, 
                 // 异步
                 async  findLists(){ 
                        var _this=this
                        // var userInfo=JSON.stringify(this.UserInfoVo)
                        console.log(this.UserInfoVo); 
                        this.$ajax
                        .POST("/sysUserInfo/findLists", {
                          current: this.currentPage,
                          size: this.pageSize,
                          nickname:this.UserInfoVo.nickname,
                          depId:this.UserInfoVo.depId
                        })
                        .then((data) => {
                             console.info(data)
                            if(data.success){  
                                _this.userList = data.data.userInfoList;
                                _this.total=data.data.total;
                            } 
                           })   
                    },
                async  findDeptAndCount(){
                    var _this=this;
                    this.$ajax
                    .POST("/department/findDeptAndCount", {
                      currentPage: this.currentPage,
                      pageSize: this.pageSize
                    })
                    .then((data) => {
                         console.info(data)
                        if(data.success){  
                            _this.departments = data.data.departments; 
                        } 
                       })  
                           
                },
                // 重置查询条件
                resetUserInfoVO(){ 
                    this.UserInfoVo.depId="",
                    this.UserInfoVo.departmentName= "",
                    this.UserInfoVo.email= "",
                    this.UserInfoVo.nickname= "",
                    this.UserInfoVo.phone= "",
                    this.UserInfoVo.sex= "",
                    this.UserInfoVo.userName= ""
                    this.findLists();
                },
                 // 按钮点击事件 显示新增编辑弹窗组件
                show(){
                    this.addOrUpdateVisible = true
                },
                // 监听 子组件弹窗关闭后触发，有子组件调用
                showAddOrUpdate(data){
                    if(data === 'false'){
                        this.addOrUpdateVisible = false
                    }else{
                        this.addOrUpdateVisible = true
                    }
                }
            }
    }
</script>

<style>
</style>
