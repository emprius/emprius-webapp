import React, { createContext, useContext, useState } from 'react'
import { useBreakpointValue } from '@chakra-ui/react'

export const DashboardLayoutContext = createContext<ReturnType<typeof useDashboardLayoutProvider> | undefined>(
  undefined
)

export const useIsDashboardLayout = () => {
  const context = useContext(DashboardLayoutContext)
  if (!context) {
    throw new Error('useDashboardLayout must be used within a DashboardLayoutProvider')
  }
  return context
}

interface DashboardLayoutProviderProps {
  children: React.ReactNode
}

export const DashboardLayoutProvider = ({ children }: DashboardLayoutProviderProps) => {
  const dashboardLayout = useDashboardLayoutProvider()
  return <DashboardLayoutContext.Provider value={dashboardLayout}>{children}</DashboardLayoutContext.Provider>
}

const useDashboardLayoutProvider = () => {
  const [isDashboardLayout, setIsDashboardLayout] = useState<boolean>(false)
  const isDashboardBigLayout = useBreakpointValue({ base: false, md: true })

  return {
    isDashboardLayout,
    setIsDashboardLayout,
    isDashboardBigLayout,
  }
}
