import { createApp } from 'vue'
import App from './App'
import { Icon } from 'arman-ui'
import { injectCSRFTokenToHeaders } from './http'

injectCSRFTokenToHeaders()
const app = createApp(App)
app.component(Icon.name, Icon)

app.mount('#app')
