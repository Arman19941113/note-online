import { createApp } from 'vue'
import App from './App'
import { Icon } from 'arman-ui'

const app = createApp(App)
app.component(Icon.name, Icon)

app.mount('#app')
