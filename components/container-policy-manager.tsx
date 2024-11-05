'use client'

import { useState } from 'react'
import { LoginPage } from './login-page'
import { Sidebar } from './sidebar'
import { Dashboard } from './dashboard'
import { PolicyContent } from './policy-content'
import { ContainersContent } from './containers-content'
import { SettingsContent } from './settings-content'

export function ContainerPolicyManagerComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedContainer, setSelectedContainer] = useState('')

  const handleLogin = (username: string, password: string) => {
    // In a real application, you would validate the credentials here
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setActiveTab('dashboard')
    setSelectedContainer('')
  }

  const handleRedirect = (page: string, container: string) => {
    setActiveTab(page)
    setSelectedContainer(container)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'policy' && <PolicyContent onRedirect={handleRedirect} />}
        {activeTab === 'containers' && <ContainersContent selectedContainer={selectedContainer} />}
        {activeTab === 'settings' && <SettingsContent />}
      </div>
    </div>
  )
}