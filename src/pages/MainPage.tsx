import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'
import HashPage from './HashPage'
import OtherPage from './NotOnlyHashPage'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Typography>{children}</Typography>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export const MainPage = () => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box>
      <Box></Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tab 1" {...a11yProps(0)} />
          <Tab label="Tab 2" {...a11yProps(1)} />
        </Tabs>

        <CustomTabPanel value={value} index={0}>
          <HashPage />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <OtherPage />
        </CustomTabPanel>
      </Box>
    </Box>
  )
}
