<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'
import avatarImage from '@/assets/avatar.jpg'; // 导入头像图片
const avatar = ref(avatarImage); // 使用 ref 包装头像图片
import axios from 'axios';
const router = useRouter();
const route = useRoute();
const resp = ref([])
const activePath = ref(route.path); // 使用 ref 来追踪当前活跃的路径
const token = sessionStorage.getItem('token');
if (!token) {
    router.push('../login');
}
const infodata = async () => {
    // 从sessionStorage获取token
    const token = sessionStorage.getItem('token');
    if (!token) {
        router.push('../login');
        sessionStorage.setItem("loginMessage", "请先登录！")
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post("http://localhost:8080/admin/admin_info", {});
        resp.value = response.data.data;
        // 处理后端返回的数据
    } catch (error) {
        console.error('请求失败:', error);
    }
};
infodata();

const user = () => {
    router.push('/admin/adminInfo');
};

const modifyAvatar = () => {
    router.push('/admin/admin1');
};

const modifyPwd = () => {
    router.push('/admin/admin2');
};

const handleLogout = () => {
    // 清除本地存储中的 token
    sessionStorage.removeItem('token');
    router.push('/login');
    ElMessage.success({
        message: "退出成功！",
        duration: 3000,
        center: true,
        offset: 20
    });
};
const adminInfo = async () => {
    resp.value = JSON.parse(sessionStorage.getItem('r'));
};
adminInfo();

watch(() => route.path, (newValue, oldValue) => {
    activePath.value = newValue;
});

</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu :default-active="activePath" active-text-color="#ffd04b" background-color="#232323"
                text-color="#fff" router>
                <el-menu-item index="/item/adminItemInfo">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>选择项目</span>
                </el-menu-item>
                <el-menu-item index="/item/adminItem1">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>学生查询</span>
                </el-menu-item>
                <el-sub-menu index="admin">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/admin/adminInfo">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/admin2">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div v-if="resp"><strong>{{ resp.nickname }},你好</strong></div>
                <el-dropdown placement="bottom-end">
                    <span class="el-dropdown__box">
                        <el-avatar>admin</el-avatar>
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="user" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item @click="modifyPwd" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item @click="handleLogout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <routerView></routerView>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>智能体测排队取号系统 ©2023 Created by 张艺贤</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>