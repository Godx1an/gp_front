<script>
import { ref, computed, onBeforeUnmount } from 'vue';
import {
    Iphone,
    Location,
    OfficeBuilding,
    Tickets,
    User,
} from '@element-plus/icons-vue'
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router';
export default {
    components: {
        Iphone,
        Location,
        OfficeBuilding,
        Tickets,
        User,
    },
    setup() {
        const router = useRouter();
        const infodata = async () => {
            // 从sessionStorage获取token
            const token = sessionStorage.getItem('token');
            if (!token) {
                router.push('../login');
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const response = await axios.post('http://localhost:8080/admin/admin_info', {});
                resp.value = response.data.data;
                // 处理后端返回的数据
            } catch (error) {
                console.error('请求失败:', error);
            }
        };
        infodata();
        let url = '';
        let data = {};
        const open = (type) => {
            ElMessageBox.prompt('Please input your content', 'modify', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                inputPattern: /^(?!\s*$).+/,
                inputErrorMessage: 'Invalid parameter',
            })
                .then(({ value }) => {
                    submitEdit(value, type);
                })
                .catch(() => {
                    ElMessage({
                        type: 'info',
                        message: 'modify canceled',
                    })
                })
        }

        // 提交修改函数
        const submitEdit = async (v, type) => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                console.error('Token不存在或为空');
                return;
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                if (type === 'nickname') {
                    url = 'http://localhost:8080/admin/modify_admin_nickname';
                    data = { nickname: v };
                } else if (type === 'school') {
                    url = 'http://localhost:8080/user/modify_school';
                    data = { school: v };
                }
                const response = await axios.post(url, data);
                if (response.data.code === 20000) {
                    sessionStorage.setItem('successMessage', '修改成功');
                    window.location.reload();
                } else {
                    ElMessage.error({
                        message: response.data.msg,
                        duration: 3000,
                        center: true,
                        offset: 20
                    });
                }
            } catch (error) {
                console.error('请求失败:', error);
            }
        };

        const size = ref('default');
        const iconStyle = computed(() => {
            const marginMap = {
                large: '8px',
                default: '6px',
                small: '4px',
            };
            return {
                marginRight: marginMap[size.value] || marginMap.default,
            };
        });
        const blockMargin = computed(() => {
            const marginMap = {
                large: '8px',
                default: '6px',
                small: '4px',
            };
            return {
                marginTop: marginMap[size.value] || marginMap.default,
            };
        });

        const resp = ref([]);
        const formatDate = (timeString) => {
            if (!timeString) return '';
            const date = new Date(timeString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        window.onload = function () {
            const successMessage = sessionStorage.getItem('successMessage');
            if (successMessage) {
                ElMessage.success({
                    message: successMessage,
                    duration: 3000,
                    center: true,
                    offset: 20
                });
                sessionStorage.removeItem('successMessage'); // 显示成功消息后移除存储
            }
        };
        return {
            size,
            iconStyle,
            blockMargin,
            resp,
            formatDate,
            submitEdit,
            open,
        };
    },
};


</script>

<template>
    <div class="profile-container">
        <div class="size-selector">
            <el-radio-group v-model="size">
                <el-radio value="large">Large</el-radio>
                <el-radio value="default">Default</el-radio>
                <el-radio value="small">Small</el-radio>
            </el-radio-group>
        </div>

        <el-descriptions :column="1" :size="size" border class="description-container">

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <iphone />
                        </el-icon>
                        Telephone
                    </div>
                </template>
                <div class="item-content">
                    <div class="itemName">{{ resp.phone }}</div>
                </div>
            </el-descriptions-item>


            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <user />
                        </el-icon>
                        Username
                    </div>
                </template>
                <div class="item-content">
                    <div class="itemName">{{ resp.nickname }}</div>
                    <el-button type="primary" @click="open('nickname')">Edit</el-button>
                </div>
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <location />
                        </el-icon>
                        School
                    </div>
                </template>
                <div class="item-content">
                    <div class="itemName">{{ resp.school }}</div>
                    <el-button type="primary" @click="open('school')">Edit</el-button>
                </div>
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Timer />
                        </el-icon>
                        Create time
                    </div>
                </template>
                {{ formatDate(resp.created_at) }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Timer />
                        </el-icon>
                        Update time
                    </div>
                </template>
                {{ formatDate(resp.updated_at) }}
            </el-descriptions-item>

        </el-descriptions>
    </div>
</template>

<style scoped>
.profile-container {
    max-width: 1000px;
    /* 设置最大宽度 */
    margin: 0 auto;
    /* 水平居中 */
}

.size-selector {
    display: flex;
    justify-content: center;
    /* 水平居中 */
    margin-bottom: 20px;
}

.description-container {
    background-color: #f0f2f5;
    /* 背景颜色 */
    border-radius: 8px;
    /* 边框圆角 */
    padding: 20px;
    /* 内边距 */
}

.itemName {
    width: 100%;
}

.cell-item {
    display: flex;
    align-items: center;
}

.iconStyle {
    margin-right: 10px;
    /* 图标与文本之间的间距 */
}

.item-content {
    width: 100%;
    display: flex;
    align-items: center;
}

.item-content span {
    margin-right: 10px;
    /* 文本与按钮之间的间距 */
}
</style>
