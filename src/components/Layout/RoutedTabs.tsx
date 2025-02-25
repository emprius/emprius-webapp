import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface TabConfig {
  path: string
  label: React.ReactNode
  content: React.ReactNode
}

interface RoutedTabsProps {
  tabs: TabConfig[]
  defaultPath: string
}

export const RoutedTabs = ({ tabs, defaultPath }: RoutedTabsProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Find current tab index based on path
  const currentTabIndex = React.useMemo(() => {
    const index = tabs.findIndex((tab) => tab.path === location.pathname)
    return index >= 0 ? index : 0
  }, [location.pathname, tabs])

  const handleTabChange = (index: number) => {
    navigate(tabs[index].path)
  }

  useEffect(() => {
    // If we're at a non-matching route, navigate to default
    if (!tabs.some((tab) => tab.path === location.pathname)) {
      navigate(defaultPath)
    }
  }, [location.pathname, navigate, tabs, defaultPath])

  return (
    <Tabs isLazy index={currentTabIndex} onChange={handleTabChange}>
      <TabList>
        {tabs.map((tab, index) => (
          <Tab key={index}>{tab.label}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map((tab, index) => (
          <TabPanel key={index} px={1}>
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}
