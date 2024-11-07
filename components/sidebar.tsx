'use client'

import { Button } from "@/components/ui/button"
import { FileText, Box, Settings, LayoutDashboard, LogOut } from 'lucide-react'

import {activeTabType} from "./container-policy-manager"

export function Sidebar({ activeTab, setActiveTab, onLogout }: { activeTab: activeTabType, setActiveTab: (activeTab: activeTabType) => void, onLogout: () => void }) {
  return (
    <div className="w-64 bg-blue-800 text-white shadow-md flex flex-col h-screen">
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-3xl font-bold mb-4 text-center">Yamong</h2>
        <hr className="border-blue-600 mb-4" />
        <nav className="flex flex-col flex-1">
          {['dashboard', 'policy', 'containers', 'settings'].map((tab, index) => {
            const isActive = activeTab === tab;
            const tabInfo = {
              dashboard: { label: 'Dashboard', Icon: LayoutDashboard },
              policy: { label: 'Policy', Icon: FileText },
              containers: { label: 'Containers', Icon: Box },
              settings: { label: 'Settings', Icon: Settings }
            };
            const { label, Icon } = tabInfo[tab];

            return (
              <Button
                key={index}
                variant="ghost"
                className={`w-full flex-1 flex flex-col items-center justify-center text-white ${
                  isActive ? 'bg-blue-700 text-xl' : 'text-lg'
                } hover:bg-blue-500`}
                onClick={() => setActiveTab(tab as activeTabType)}
              >
                <Icon className={`mb-1 ${isActive ? 'h-20 w-20' : 'h-6 w-6'}`} />
                <span className={`${isActive ? 'font-semibold' : ''}`}>{label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
      <hr className="border-blue-600" />
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-white bg-blue-600 border-2 border-white transition-transform duration-200 hover:bg-blue-500 hover:scale-105"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
