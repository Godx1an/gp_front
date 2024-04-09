<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
const form = reactive({
    type: [],
    time: 0, // 修改为数字类型
    participants: 0, // 修改为数字类型
})
const form1 = reactive({
    type: [],
    time: 0, // 修改为数字类型
    participants: 0, // 修改为数字类型
})
const dialogFormVisible1 = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus'
const items = ref([]);

//搜索所有项目
const itemdata = async () => {
    // 从sessionStorage获取token
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token不存在或为空');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post('http://localhost:8080/admin/admin_query_item', {});
        items.value = response.data.data;
    } catch (error) {
        console.error('请求失败:', error);
    }
};
itemdata();
let data = {};

//删除项目
const handleDelete = (item) => {
    ElMessageBox.confirm('确认删除该项目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        data = { item: item.item };
        submitDelete(data);
    }).catch(() => {
        console.log('用户点击了取消');
    });
};

//日期处理方法
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

//提交删除项目
const submitDelete = async (v) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token不存在或为空');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post('http://localhost:8080/admin/delete_item', data);
        if (response.data.code === 20000) {
            sessionStorage.setItem('successMessage', '删除成功');
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

//显示成功消息
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

let origin = ref([]);
// 编辑项目按钮函数
const editItem = (row) => {
    // 将项目名称填充到表单中
    form.item = row.item;
    // 显示编辑对话框
    origin = row.item;
    dialogFormVisible1.value = true;
}

//取消编辑
const cancelForm = () => {
    // 重置表单数据
    form.item = ''
    // 关闭对话框
    dialogFormVisible1.value = false
}

//提交修改本校项目
const submitForm = async () => {
    // 发送 POST 请求到后端
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token不存在或为空');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post('http://localhost:8080/admin/modify_item', {
            origin:origin,
            item: form.item,
        });
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

//取消添加
const cancelAdd = () => {
    // 重置表单数据
    form1.item = ""
    dialogFormVisible.value = false
}

//添加项目按钮函数
const addItem = () => {
    // 显示编辑对话框
    dialogFormVisible.value = true;
}

//提交添加本校项目
const submitAdd = async () => {
    // 发送 POST 请求到后端
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token不存在或为空');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post('http://localhost:8080/admin/add_item', {
            item: form1.item,
        });
        if (response.data.code === 20000) {
            sessionStorage.setItem('successMessage', '添加成功');
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

</script>

<template>
    <el-dialog v-model="dialogFormVisible" title="Add item information" width="500">
        <div class="flex flex-wrap">
            <div class="m-4">
                <el-form :model="form1">
                    <el-form-item label="Item name" :label-width="formLabelWidth">
                        <el-input v-model="form1.item" autocomplete="off" />
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelAdd">Cancel</el-button>
                <el-button type="primary" @click=submitAdd>
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>


    <el-dialog v-model="dialogFormVisible1" title="Modify item information" width="500">
        <el-form :model="form">
            <el-form-item label="Item" :label-width="formLabelWidth">
                <el-input v-model="form.item" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelForm">Cancel</el-button>
                <el-button type="primary" @click=submitForm>
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>


    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>项目类型</span>
                <div class="extra">
                    <el-button type="primary" @click="addItem">添加项目</el-button>
                </div>
            </div>
        </template>
        <el-table :data="items" style="width: 100%">
            <el-table-column el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="项目" prop="item"></el-table-column>
            <el-table-column label="更新时间" prop="created_at">
                <template #default="{ row }">
                    {{ formatDate(row.updated_at) }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="created_at">
                <template #default="{ row }">
                    {{ formatDate(row.created_at) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="editItem(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="handleDelete(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

.row {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    /* 垂直居中对齐 */
}

.item-label {
    margin: 0;
    margin-right: 10px;
    /* 右边距，可以根据需要调整 */
}

.select-box {
    width: 240px;
    /* 设置选择框宽度，根据需要调整 */
}
</style>