<script lang="ts">
import { ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

export default {

  setup() {
    const formData = ref({
      phone: '',
      pwd: '',
      confirmPassword: ''
    });

    const loginMessage = sessionStorage.getItem('loginMessage');
    if (loginMessage) {
      ElMessage.error({
        message: loginMessage,
        duration: 3000,
        center: true,
        offset: 20
      });
      sessionStorage.removeItem('loginMessage'); // 显示成功消息后移除存储
    }

    const phoneIcon = User;
    const lockIcon = Lock;
    const isRegister = ref(false);
    const router = useRouter();
    const radio = ref('1')
    const login = async () => {
      let url = '';
      if (radio.value === '1') {
        url = 'http://localhost:8080/user_login';
      } else if (radio.value === '2') {
        url = 'http://localhost:8080/admin_login';
      }
      try {
        const response = await axios.post(url, {
          phone: formData.value.phone,
          pwd: formData.value.pwd
        });
        sessionStorage.setItem('token', response.data.data.token);
        sessionStorage.setItem('r', JSON.stringify(response.data.data));
        if (response.data.code === 20000) {
          // 登录成功，处理成功逻辑，例如跳转页面等
          ElMessage.success({
            message: "登录成功！",
            duration: 3000,
            center: true,
            offset: 20
          });
          if (radio.value === '1') {
            router.push('/user/userInfo');
          } else if (radio.value === '2') {
            router.push('/admin/adminInfo');
          }
        } else {
          formData.value.pwd = "";
          ElMessage.error({
            message: response.data.msg,
            duration: 3000, // 错误提示显示时间
            center: true, // 居中显示
            offset: 20
          });
        }
        // 处理后端返回的数据
      } catch (error) {
        console.error('请求失败:', error);
      }
    };
    return {
      formData,
      phoneIcon,
      lockIcon,
      isRegister,
      login,
      radio
    };
  }
};
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册表单 -->
      <h1 style="text-align: center;">智能体测排队预约系统</h1>

      <el-form size="large" autocomplete="off" :model="formData">

        <el-form-item>
          <h1>登录</h1>

        </el-form-item>

        <el-form-item>
          <el-input :prefix-icon="phoneIcon" placeholder="请输入用户名" v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input name="password" :prefix-icon="lockIcon" type="password" placeholder="请输入密码" v-model="formData.pwd"
            @keyup.enter="login"></el-input>
        </el-form-item>
        <div>
          <el-radio-group v-model="radio" style="margin-bottom: 10px">
            <el-radio value="1" size="large" border>用户登录</el-radio>
            <el-radio value="2" size="large" border>管理员登录</el-radio>
          </el-radio-group>
        </div>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>

        </el-form-item>
        <el-form-item class="flex">
          <el-popover placement="right" :width="200" trigger="hover" append-to-body>
            <template v-slot:reference>
              <el-button class="m-2">TIPS</el-button>
            </template>
            <div style="max-width: 200px;">
              <p>手机号须为11位数字！</p>
              <p>密码须6-12位且包含数字、大写字母、小写字母、符号中的两种</p>
              <p>首次登录即为注册</p>
            </div>
          </el-popover>

        </el-form-item>

      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url('@/assets/kobe.png') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>