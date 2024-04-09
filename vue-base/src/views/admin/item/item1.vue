<script setup>
import { ref } from 'vue'
import axios from 'axios';
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
const items = ref([]);
const total = ref(0); // 总数
const pageIndex = ref(1); // 当前页，默认为第一页

const userData = async () => {
    // 从sessionStorage获取token
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token不存在或为空');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post('http://localhost:8080/admin/query_user', {
            pageIndex: pageIndex.value, // 传递当前页参数
        });
        items.value = response.data.data.list;
        total.value = response.data.data.total;
        console.log(total)
    } catch (error) {
        console.error('请求失败:', error);
    }
};
userData();

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

const handleCurrentChange = (newPage) => {
    pageIndex.value = newPage;
    userData();
}
</script>

<template>
    <el-card class="page-container">
        <el-table :data="items" style="width: 100%">
            <el-table-column el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="昵称" prop="nickname"></el-table-column>
            <el-table-column label="手机号" prop="phone"></el-table-column>
            <el-table-column label="更新时间" prop="updated_at">
                <template #default="{ row }">
                    {{ formatDate(row.created_at) }}
                </template>
            </el-table-column>
            <el-table-column label="下次更新学校时间" prop="next_update_time">
                <template #default="{ row }">
                    {{ formatDate(row.next_update_time) }}
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary"></el-button>
                    <el-button :icon="Delete" circle plain type="danger"></el-button>
                </template>
            </el-table-column> -->
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    </el-card>
    <div class="example-pagination-block pagination-wrapper">
    <el-pagination layout="prev, pager, next" :page-size="20" :total="total" @current-change="handleCurrentChange"/>
  </div>
</template>
<style scoped>
.example-pagination-block+.example-pagination-block {
    margin-top: 10px;
}
.page-container {
    position: relative;
}

.example-pagination-block {
    margin-bottom: 16px;
}
.pagination-wrapper {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 20px;
    margin-right: 20px;
}
</style>
