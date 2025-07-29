import { ref, onMounted, watch, readonly } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

export function useTheme() {
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    
    if (process.client) {
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('theme', newTheme)
    }
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  const initTheme = () => {
    if (process.client) {
      // Check for saved theme in localStorage
      const savedTheme = localStorage.getItem('theme') as Theme
      
      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(prefersDark ? 'dark' : 'light')
      }
    }
  }

  // Watch for theme changes and apply them
  watch(theme, (newTheme) => {
    if (process.client) {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  })

  onMounted(() => {
    initTheme()
  })

  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme,
    initTheme
  }
}
