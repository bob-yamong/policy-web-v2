'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Server, Save } from 'lucide-react'

export function SettingsContent() {
  const [username, setUsername] = useState('JohnDoe')
  const [serverIP, setServerIP] = useState('192.168.1.100')
  const [isEditing, setIsEditing] = useState(false)
  const [tempUsername, setTempUsername] = useState('')
  const [tempServerIP, setTempServerIP] = useState('')

  const handleEditInfo = () => {
    if (isEditing) {
      setUsername(tempUsername)
      setServerIP(tempServerIP)
      setIsEditing(false)
    } else {
      setTempUsername(username)
      setTempServerIP(serverIP)
      setIsEditing(true)
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-500" />
                  {isEditing ? (
                    <Input
                      id="username"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                    />
                  ) : (
                    <span>{username}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Server Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serverIP">Server IP Address</Label>
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-blue-500" />
                  {isEditing ? (
                    <Input
                      id="serverIP"
                      value={tempServerIP}
                      onChange={(e) => setTempServerIP(e.target.value)}
                    />
                  ) : (
                    <span>{serverIP}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleEditInfo}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            'Edit Information'
          )}
        </Button>
      </div>
    </>
  )
}