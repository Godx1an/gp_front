<template>
    <div class="file-upload-container">
        <!-- 文件选择框 -->
        <label for="file-upload" class="file-label">
            <input id="file-upload" type="file" class="file-input" @change="onFileChange">
        </label>
        <!-- 上传按钮 -->
        <div class="upload-button-container">
            <button class="upload-button" @click="uploadFile">上传文件</button>
        </div>
    </div>
</template>

<style>
/* 文件上传容器样式 */
.file-upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

/* 文件选择框样式 */
.file-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px dashed #ccc;
    padding: 20px;
    border-radius: 10px;
    cursor: pointer;
}

.file-label:hover {
    border-color: #007bff;
}

/* 上传按钮容器样式 */
.upload-button-container {
    margin-top: 10px;
}

/* 上传按钮样式 */
.upload-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.upload-button:hover {
    background-color: #0056b3;
}
</style>

<script setup>
import axios from "axios";
import { ElMessage } from 'element-plus';

// 数据声明
let file = null;

// 文件选择事件
const onFileChange = (event) => {
    // 更新文件数据
    file = event.target.files[0];
};

// 文件上传方法
const uploadFile = async () => {
    if (!file) {
        ElMessage.error({
            message: "请选择要上传的图片",
            duration: 3000,
            center: true,
            offset: 20
        });
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post("http://localhost:8080/user/upload_avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
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
        console.error(error);
        alert("上传文件时发生错误.");
    }
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
</script>
