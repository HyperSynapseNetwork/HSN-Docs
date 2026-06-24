import DefaultTheme from 'vitepress/theme'
import GitMeta from './components/GitMeta.vue'
import { h } from 'vue'
import type { FunctionalComponent } from 'vue'
import './custom.css'

// Custom Layout: wraps the default theme and injects <GitMeta />
// into the doc-after slot on every content page.
const Layout: FunctionalComponent = () => {
  return h(DefaultTheme.Layout, null, {
    'doc-after': () => h(GitMeta),
  })
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('GitMeta', GitMeta)
  },
}
