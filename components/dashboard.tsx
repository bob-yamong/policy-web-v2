'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

const cpuData = [
  { time: '00:00', core1: 30, core2: 40, core3: 20, core4: 50 },
  { time: '01:00', core1: 40, core2: 30, core3: 40, core4: 35 },
  { time: '02:00', core1: 45, core2: 55, core3: 30, core4: 40 },
  { time: '03:00', core1: 35, core2: 45, core3: 50, core4: 30 },
  { time: '04:00', core1: 50, core2: 35, core3: 40, core4: 45 },
]

const networkData = [
  { time: '00:00', in: 100, out: 50 },
  { time: '01:00', in: 120, out: 60 },
  { time: '02:00', in: 90, out: 70 },
  { time: '03:00', in: 150, out: 80 },
  { time: '04:00', in: 110, out: 55 },
]

const memoryData = [
  { name: 'Used', value: 8 },
  { name: 'Free', value: 8 },
]

const diskData = [
  { name: 'Used', value: 234 },
  { name: 'Free', value: 266 },
]

const containerStatus = [
  { name: 'Container1', status: 'up' },
  { name: 'Container2', status: 'up' },
  { name: 'Container3', status: 'down' },
  { name: 'Container4', status: 'up' },
  { name: 'Container5', status: 'up' },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>CPU Usage per Core</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cpuData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="core1" stroke="#8884d8" />
                <Line type="monotone" dataKey="core2" stroke="#82ca9d" />
                <Line type="monotone" dataKey="core3" stroke="#ffc658" />
                <Line type="monotone" dataKey="core4" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Network Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="in" stroke="#8884d8" name="In" />
                <Line type="monotone" dataKey="out" stroke="#82ca9d" name="Out" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center mt-2">Total: 16 GB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disk Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diskData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center mt-2">Total: 500 GB</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Container Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {containerStatus.map((container) => (
              <div key={container.name} className="text-center">
                <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${container.status === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p>{container.name}</p>
                <p className="text-sm text-gray-500 capitalize">{container.status}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}