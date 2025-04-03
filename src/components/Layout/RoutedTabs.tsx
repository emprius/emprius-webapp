import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface TabConfig {
  path: string
  label: React.ReactNode
  content: React.ReactNode
  hidden?: boolean
}

interface RoutedTabsProps {
  tabs: TabConfig[]
  defaultPath: string
}

export const RoutedTabs = ({ tabs, defaultPath }: RoutedTabsProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Filter out hidden tabs for display
  const visibleTabs = React.useMemo(() => tabs.filter((tab) => !tab.hidden), [tabs])

  // Find current tab index based on path
  const currentTabIndex = React.useMemo(() => {
    // First check if the current path matches any visible tab
    const visibleIndex = visibleTabs.findIndex((tab) => tab.path === location.pathname)
    if (visibleIndex >= 0) {
      return visibleIndex
    }

    // If we're on a hidden tab, show the first visible tab
    return 0
  }, [location.pathname, visibleTabs])

  const handleTabChange = (index: number) => {
    navigate(visibleTabs[index].path)
  }

  useEffect(() => {
    // If we're at a non-matching route, navigate to default
    if (!tabs.some((tab) => tab.path === location.pathname)) {
      navigate(defaultPath)
    }
  }, [location.pathname, navigate, tabs, defaultPath])

  return (
    <>
      <Tabs isLazy index={currentTabIndex} onChange={handleTabChange} variant={'outline'}>
        <TabList>
          {visibleTabs.map((tab, index) => (
            <Tab key={index}>{tab.label}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {visibleTabs.map((tab, index) => (
            <TabPanel key={index} px={1}>
              {tab.content}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  )
}
