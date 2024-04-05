<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue';
import axios from 'axios';
const items = ref([]);
const itemdata = async () => {
    // 从sessionStorage获取token
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token不存在或为空');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post('http://localhost:8080/user/query_item', {});
        items.value = response.data.data;
        console.log(items);
        // 处理后端返回的数据
    } catch (error) {
        console.error('请求失败:', error);
    }
};
itemdata();

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

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>项目总览</span>
            </div>
        </template>
        <el-table :data="items" style="width: 100%">
            <el-table-column el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="项目" prop="item"></el-table-column>
            <el-table-column label="平均时长" prop="avg_time_per_person"></el-table-column>
            <el-table-column label="最大人数" prop="max_participants"></el-table-column>
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
</style>