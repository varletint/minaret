import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface ThemeState {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

// Sync theme with DOM
const syncThemeToDOM = (theme: Theme) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'dark',
            toggleTheme: () =>
                set((state) => {
                    const newTheme = state.theme === 'dark' ? 'light' : 'dark'
                    syncThemeToDOM(newTheme)
                    return { theme: newTheme }
                }),
            setTheme: (theme) => {
                syncThemeToDOM(theme)
                set({ theme })
            },
        }),
        {
            name: 'theme-storage',
            onRehydrateStorage: () => (state) => {
                // Apply theme on page load from localStorage
                if (state) {
                    syncThemeToDOM(state.theme)
                }
            },
        }
    )
)

