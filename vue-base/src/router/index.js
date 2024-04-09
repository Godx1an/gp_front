//导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
//导入组件
import LoginVue from '@/views/login.vue'
import UserLayoutVue from '@/views/user/layout.vue'
import AdminLayoutVue from '@/views/admin/layout.vue'
import superAdminLayoutVue from '@/views/superAdmin/layout.vue'
import UserItemInfo from '@/views/user/item/itemInfo.vue'
import UserItem1 from '@/views/user/item/item1.vue'
import AdminItemInfo from '@/views/admin/item/itemInfo.vue'
import AdminItem1 from '@/views/admin/item/item1.vue'
import User1 from '@/views/user/user1.vue'
import User2 from '@/views/user/user2.vue'
import Admin1 from '@/views/admin/admin1.vue'
import Admin2 from '@/views/admin/admin2.vue'
import UserInfo from '@/views/user/userInfo.vue'
import AdminInfo from '@/views/admin/adminInfo.vue'
import Super from '@/views/superAdmin/super.vue'
import AddItem from '@/views/superAdmin/addItem.vue'
import SuperAdminInfo from '@/views/superAdmin/superAdminInfo.vue'
import AddSchool from '@/views/superAdmin/addSchool.vue'
//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    { path: '/', component: UserLayoutVue, redirect:'/user/userInfo',children:[
        {path:'/user/userInfo',component:UserInfo},
        {path:'/user/user1',component:User1},
        {path:'/user/user2',component:User2},
        {path:'/item/userItemInfo',component:UserItemInfo},
        {path:'/item/userItem1',component:UserItem1},
    ] },
    { path: '/', component: AdminLayoutVue, redirect:'/admin/adminInfo',children:[
        {path:'/admin/adminInfo',component:AdminInfo},
        {path:'/admin/admin1',component:Admin1},
        {path:'/admin/admin2',component:Admin2},
        {path:'/item/adminItemInfo',component:AdminItemInfo},
        {path:'/item/adminItem1',component:AdminItem1},
    ] },
    { path: '/', component: superAdminLayoutVue, redirect:'/superAdmin/super',children:[
        {path:'/superAdmin/super',component:Super},
        {path:'/superAdmin/addItem',component:AddItem},
        {path:'/superAdmin/superAdminInfo',component:SuperAdminInfo},
        {path:'/superAdmin/addSchool',component:AddSchool},
    ] }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router