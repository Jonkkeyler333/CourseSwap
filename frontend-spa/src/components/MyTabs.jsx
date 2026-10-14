import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import TabPanel from './TabPanel'
import LoginForm from './LoginForm'
// import RegisterForm from './RegisterForm'

const MyTabs = ({ onLogin, onRegister }) => {
  const [tab, setTab] = useState(0)

  const handleChange = (event, newValue) => {
    setTab(newValue)
  }

  return (
    <Box>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Iniciar sesión" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Registrarse" id="tab-1" aria-controls="tabpanel-1" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <LoginForm onLogin={onLogin} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {/* <RegisterForm onRegister={onRegister} /> */}
        xd
      </TabPanel>
    </Box>
  )
}

export default MyTabs