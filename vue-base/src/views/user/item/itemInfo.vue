<script setup>
import {
    Edit,
    Delete,
    Plus,
    Refresh,
} from '@element-plus/icons-vue'
import { ref } from 'vue';
import axios from 'axios';
const items = ref([]);
const number = ref([]);
import { ElMessage, ElMessageBox } from 'element-plus'
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
        items.value = response.data.data.sftis;
        number.value = response.data.data.lists;
        // 处理后端返回的数据
    } catch (error) {
        console.error('请求失败:', error);
    }
};
itemdata();

const fresh = async () => {
    // 从sessionStorage获取token
    itemdata();
    ElMessage.success({
        message: "刷新成功",
        duration: 3000,
        center: true,
        offset: 20
    });
};

const calculateWaitTime = (row, index) =>{
    const waitCount = number.value[index];
    const maxParticipants = row.max_participants;
    const avgTimePerPerson = row.avg_time_per_person;
    return Math.floor(Math.ceil(waitCount / maxParticipants) * avgTimePerPerson);
}

let data = {};
const chooseItem = (item) => {
    ElMessageBox.confirm('确认选择该项目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        data = { item: item.id };
        submitChooseItem(data)
    }).catch(() => {
    });
};

const submitChooseItem = async () => {
    // 从sessionStorage获取token
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token不存在或为空');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post('http://localhost:8080/user/choose_item', data);
        if (response.data.code === 20000) {
            ElMessageBox.alert('您目前排在第'+response.data.data+"位", '成功', {
                confirmButtonText: 'OK',
            })
        } else {
            ElMessage.error({
                message: response.data.msg,
                duration: 3000,
                center: true,
                offset: 20
            });
        }
        itemdata();
        // 处理后端返回的数据
    } catch (error) {
        console.error('请求失败:', error);
    }
};
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <div class="header-left">
                    <span>项目总览</span>
                </div>
                <div class="header-right">
                    <el-button :icon="Refresh" circle plain type="primary" @click="fresh()"></el-button>
                </div>
            </div>
        </template>
        <el-table :data="items" style="width: 100%">
            <el-table-column el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="项目" prop="item"></el-table-column>
            <el-table-column label="平均时长" prop="avg_time_per_person"></el-table-column>
            <el-table-column label="最大人数" prop="max_participants"></el-table-column>
            <!-- 添加一个新列用于显示number中的信息 -->
            <el-table-column label="等待人数">
                <template #default="{ $index }">
                    {{ number[$index] }}
                </template>
            </el-table-column>
            <el-table-column label="预计等待时间">
                <template #default="{ row, $index }">
                    {{ calculateWaitTime(row, $index) }}
                </template>
            </el-table-column>
            <el-table-column label="预约" width="100">
                <template #default="{ row }">
                    <el-button :icon="Plus" circle plain type="primary" @click="chooseItem(row)"></el-button>
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

        .header-left {
            display: flex;
            align-items: center;
        }

        .header-right {
            margin-left: 10px; // 添加间距，使按钮与文本分开一点
        }
    }
}
</style>