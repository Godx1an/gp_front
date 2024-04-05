<template>
    <div class="center-container">
        <el-form ref="ruleFormRef"
            style="max-width: 600px; border: 1px solid #409EFF; border-radius: 10px; padding: 20px;" :model="ruleForm"
            status-icon :rules="rules" label-width="auto" class="demo-ruleForm">
            <div style="text-align: center; margin-bottom: 10px;">
                <p style="font-weight: bold;">Reset Password</p>
            </div>
            <el-form-item label="Old Password" prop="oldPassword">
                <el-input v-model="ruleForm.oldPassword" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="New Password" prop="newPassword">
                <el-input v-model="ruleForm.newPassword" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Repeat New Password" prop="repeatPassword">
                <el-input v-model="ruleForm.repeatPassword" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <div style="margin-left: 20%;">
                    <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
                    <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
                    <el-popover placement="bottom" :width="200" trigger="hover" append-to-body>
                        <template v-slot:reference>
                            <el-button class="m-2">TIPS</el-button>
                        </template>
                        <div style="max-width: 800px;">
                            Password validation regex: must contain digits and letter or symbol and be 6-12 characters
                            long
                        </div>
                    </el-popover>
                </div>
            </el-form-item>
        </el-form>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios';

import { ElMessage } from 'element-plus';
const ruleFormRef = ref()

import { useRouter } from 'vue-router';

const router = useRouter();
const validatePassword = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('Please input the password'))
    }

    // Password validation regex: must contain digits and letter or symbol and be 6-12 characters long
    const passwordRegex = /^(?=.*\d)(?=.*[A-Za-z\d\W_])[A-Za-z\d\W_]{6,12}$/

    if (!passwordRegex.test(value)) {
        callback(new Error('Invalid password'))
    } else {
        callback()
    }
}

const validateRepeatPassword = (rule, value, callback) => {
    if (value !== ruleForm.newPassword) {
        callback(new Error('Passwords do not match'))
    } else {
        callback()
    }
}

const validateDifferentPassword = (rule, value, callback) => {
    if (value === ruleForm.oldPassword) {
        callback(new Error('It is the same as the old password'))
    } else {
        callback()
    }
}

const ruleForm = reactive({
    oldPassword: '',
    newPassword: '',
    repeatPassword: '',
})

const rules = reactive({
    oldPassword: [{ validator: validatePassword, trigger: 'blur' }],
    newPassword: [
        { validator: validatePassword, trigger: 'blur' },
        { validator: validateDifferentPassword, trigger: 'blur' }
    ],
    repeatPassword: [
        { validator: validatePassword, trigger: 'blur' },
        { validator: validateRepeatPassword, trigger: 'blur' }
    ],
})

const submitForm = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
        if (valid) {
            const token = sessionStorage.getItem('token');
            if (!token) {
                return;
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const response = await axios.post('http://localhost:8080/user/modify_pwd', {
                    oldPassword:ruleForm.oldPassword,
                    pwd: ruleForm.newPassword // 使用新密码作为要发送的数据
                });
                if (response.data.code === 20000) {
                    router.push('/user/userInfo');
                    ElMessage.success({
                        message: "修改成功",
                        duration: 3000,
                        center: true,
                        offset: 20
                    });
                } else {
                    ElMessage.error({
                        message: response.data.msg,
                        duration: 3000,
                        center: true,
                        offset: 20
                    });
                    ruleForm.oldPassword = '',
                    ruleForm.newPassword = '',
                    ruleForm.repeatPassword = ''
                }
            } catch (error) {
                console.error('请求失败:', error);
                // 在这里可以处理错误，比如显示错误消息等
            }
        } else {
            console.log('error submit!');
            return false;
        }
    });
};

const resetForm = (formRef) => {
    if (formRef) {
        formRef.resetFields();
    }
};
</script>


<style>
.center-container {
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    height: 80vh;
    /* 设置容器高度为视窗高度，实现垂直居中 */
}
</style>