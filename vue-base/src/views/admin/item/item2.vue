<script setup>
import axios from 'axios';
import { ref } from 'vue'
import { ElTable } from 'element-plus'
const multipleTableRef = ref(null)
const data = ref([])
import { useRouter } from 'vue-router';
const router = useRouter();
import { ElMessage } from 'element-plus'
let selection = [];
const rowId = sessionStorage.getItem("rowId");
const rowSchool = sessionStorage.getItem("rowSchool");
const rowItem = sessionStorage.getItem("rowItem");
const rowMax = sessionStorage.getItem("rowMax");
const adminQueryQueue = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token不存在或为空');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post('http://localhost:8080/admin/admin_query_queue', {
            id: rowId,
        });
        if (response.data.code === 20000) {
            data.value = response.data.data;
        } else {
            data.value = []
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
}

adminQueryQueue();

const toggleSelection = (rows) => {
    if (rows) {
        rows.forEach((row) => {
            multipleTableRef.value.toggleRowSelection(row, undefined)
        })
    } else {
        multipleTableRef.value.clearSelection()
    }
}

const handleSelectionChange = (sc, row) => {
    if (sc.length > rowMax) {
        multipleTableRef.value.toggleRowSelection(row, false);
        ElMessage.error({
            message: `最多只可以添加${rowMax}个人`,
            duration: 3000,
            center: true,
            offset: 20
        })
    } else {
        selection = sc;
    }
}

const selectAll = (selection) => {
    if (selection.length > rowMax) {
        for (let i = 0; i < selection.length; i++) {
            const row = selection[i];
            if (i >= rowMax) {
                multipleTableRef.value.toggleRowSelection(row, false);
            }
        }
    }
};

const submitSelection = async () => {
    const allId = selection.map(item => item.id);
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token不存在或为空');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.post('http://localhost:8080/admin/handle_queue', {
            id: rowId,
            ids: allId,
        });
        if (response.data.code === 20000) {
            ElMessage.success({
                message: response.data.msg,
                duration: 3000,
                center: true,
                offset: 20
            });
            adminQueryQueue();
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

}

const goBack = () => {
    sessionStorage.removeItem('rowItem');
    sessionStorage.removeItem('rowSchool');
    sessionStorage.removeItem('rowId');
    router.push('/item/adminItemInfo');
}

const fresh = () => {
    adminQueryQueue();
}

</script>

<template>
    <el-card class="page-container">
        <el-page-header @back="goBack">
            <template #content>
                <span class="text-large font-600 mr-3">{{ rowSchool }}的项目——{{ rowItem }}——排队情况（最多可选择{{ rowMax
                    }}人）</span>
            </template>
        </el-page-header>
        <el-table ref="multipleTableRef" :data="data" style="width: 100%" @select="handleSelectionChange"
            @select-all="selectAll" :select-on-indeterminate="false">
            <el-table-column type="selection" width="55" />
            <el-table-column label="排位" width="100" type="index" />
            <el-table-column property="nickname" label="Name" width="200" />
            <el-table-column property="phone" label="Phone" show-overflow-tooltip />
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="toggleSelection()">Clear selection</el-button>
            <el-button @click="submitSelection()">Submit selection</el-button>
            <el-button @click="fresh()">Fresh</el-button>
        </div>
    </el-card>
</template>