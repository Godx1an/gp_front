import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { markRaw } from 'vue' // 引入 markRaw
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from '@/router'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, markRaw(component)) // 使用 markRaw 处理组件
}

app.mount('#app')
