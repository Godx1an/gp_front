<script setup>
import axios from 'axios';
import { ref } from 'vue';
const tableData = ref([]);
import { ElMessage } from 'element-plus'
import {
    Refresh,
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
const query = async () => {
    // 从sessionStorage获取token
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token不存在或为空');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post('http://localhost:8080/user/query_reservation', {});
        tableData.value = response.data.data;
        const itemNames = [];
        response.data.data.forEach(item => {
            // 检查 QueueIndex 是否小于 10
            if (item.QueueIndex < 10 && item.QueueIndex != 0) {
                itemNames.push(item.ItemName); // 假设你想要将其标记为 true
            }
        });
        const messageContent = `您有${itemNames.length}个项目即将排到，分别是"${itemNames.join('", "')}"，请尽快到体测地点报道`;
        ElMessageBox.alert(messageContent, 'Tips', {

        })
        // 处理后端返回的数据
    } catch (error) {
        console.error('请求失败:', error);
    }
};
query();

const fresh = async () => {
    // 从sessionStorage获取token
    query();
    ElMessage.success({
        message: "刷新成功",
        duration: 3000,
        center: true,
        offset: 20
    });
};
const calculateWaitTime = (row) => {
    const waitCount = row.QueueIndex;
    const maxParticipants = row.ItemMax;
    const avgTimePerPerson = row.ItemTime;
    return Math.floor(Math.ceil(waitCount / maxParticipants) * avgTimePerPerson);
};

const tableRowClassName = ({ row }) => {
    if (row.QueueIndex !== 0) {
        if (row.QueueIndex >= 10) {
            return 'warning-row';
        } else {
            return 'success-row';
        }
    }
    return '';
};

const formatRowData = (row) => {
    if (row.QueueIndex === 0) {
        return '未预约';
    } else {
        return row.QueueIndex;
    }
}

const cancelQueue = (row) => {
    if (row.QueueIndex == 0) {
        ElMessage.error({
            message: "未预约排队",
            duration: 3000,
            center: true,
            offset: 20
        });
        return;
    }
    ElMessageBox.confirm('确认取消预约该项目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        submitCancel(row.ItemId)
    }).catch(() => {
    });
}

const submitCancel = async(data) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token不存在或为空');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post('http://localhost:8080/user/dequeue', {
            Id:data,
        });
        if (response.data.code === 20000) {
            ElMessage.success({
                message: response.data.msg,
                duration: 3000,
                center: true,
                offset: 20
            });
            fresh();
        } else {
            ElMessage.error({
                message: response.data.msg,
                duration: 3000,
                center: true,
                offset: 20
            });
        }
        // 处理后端返回的数据
    } catch (error) {
        console.error('请求失败:', error);
    }
}

</script>
<template>
    <div>
        <el-button :icon="Refresh" circle plain type="primary" @click="fresh"></el-button>
    </div>
    <div class="table-container">
        <el-table :data="tableData" border style="width: 1000px" :row-class-name="tableRowClassName">
            <el-table-column prop="ItemName" label="ItemName" width="180" align="center" />
            <el-table-column prop="QueueIndex" label="Ranking" width="180" align="center">
                <template #default="{ row }">
                    {{ formatRowData(row) }}
                </template>
            </el-table-column>
            <el-table-column label="Estimated Wait Time(m)" width="200" align="center">
                <template #default="{ row }">
                    {{ row.QueueIndex === 0 ? '未预约' : calculateWaitTime(row) }}
                </template>
            </el-table-column>
            <el-table-column prop="ItemTime" label="ItemTime(m)" align="center" />
            <el-table-column prop="ItemMax" label="ItemMax" align="center" />
            <el-table-column label="Actions" align="center">
                <template #default="{ row }">
                    <el-button type="danger" @click="cancelQueue(row)">取消排队</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>


<style>
.el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.table-container {
    display: flex;
    justify-content: center;
    /* 水平居中 */
}
</style>
