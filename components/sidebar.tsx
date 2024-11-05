'use client'

import { Button } from "@/components/ui/button"
import { FileText, Box, Settings, LayoutDashboard, LogOut } from 'lucide-react'

export function Sidebar({ activeTab, setActiveTab, onLogout }: { activeTab: string, setActiveTab: (tab: string) => void, onLogout: () => void }) {
  return (
    <div className="w-64 bg-blue-800 text-white shadow-md flex flex-col h-screen">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Yamong</h2>
        <nav>
          <Button 
            variant="ghost" 
            className={`w-full justify-start mb-2 text-white hover:bg-blue-700 ${activeTab === 'dashboard' ? 'bg-blue-700' : ''}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start mb-2 text-white hover:bg-blue-700 ${activeTab === 'policy' ? 'bg-blue-700' : ''}`} 
            onClick={() => setActiveTab('policy')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Policy
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start mb-2 text-white hover:bg-blue-700 ${activeTab === 'containers' ? 'bg-blue-700' : ''}`} 
            onClick={() => setActiveTab('containers')}
          >
            <Box className="mr-2 h-4 w-4" />
            Containers
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-white hover:bg-blue-700 ${activeTab === 'settings' ? 'bg-blue-700' : ''}`} 
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-blue-700"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}