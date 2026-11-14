import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimeRange } from '../types'

interface AppState {
  sidebarCollapsed: boolean
  mobileNavOpen: boolean
  timeRange: TimeRange
  mapMode: '3d' | '2d'
  rotationPaused: boolean
  organization: string
  analystName: string
  analystEmail: string
  setProfile: (organization: string, analystName: string, analystEmail: string) => void
  toggleSidebar: () => void
  setMobileNavOpen: (open: boolean) => void
  setTimeRange: (range: TimeRange) => void
  setMapMode: (mode: '3d' | '2d') => void
  toggleRotation: () => void
}
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      timeRange: '24h',
      mapMode: '3d',
      rotationPaused: false,
      organization: 'Atlas Security',
      analystName: 'Alex Morgan',
      analystEmail: 'analyst@atlas.example',
      setProfile: (organization, analystName, analystEmail) =>
        set({ organization, analystName, analystEmail }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      setTimeRange: (timeRange) => set({ timeRange }),
      setMapMode: (mapMode) => set({ mapMode }),
      toggleRotation: () => set((state) => ({ rotationPaused: !state.rotationPaused })),
    }),
    {
      name: 'threatatlas-preferences',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        mapMode: state.mapMode,
        rotationPaused: state.rotationPaused,
        organization: state.organization,
        analystName: state.analystName,
        analystEmail: state.analystEmail,
      }),
    },
  ),
)
