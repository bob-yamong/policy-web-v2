"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cpu, Database, HardDrive } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ContainerType } from "./container-policy-manager";

const sampleData = [
  { name: "00:00", cpu: 40, memory: 24, network: 24 },
  { name: "03:00", cpu: 30, memory: 13, network: 22 },
  { name: "06:00", cpu: 20, memory: 98, network: 22 },
  { name: "09:00", cpu: 27, memory: 39, network: 20 },
  { name: "12:00", cpu: 18, memory: 48, network: 21 },
  { name: "15:00", cpu: 23, memory: 38, network: 25 },
  { name: "18:00", cpu: 34, memory: 43, network: 21 },
];

export function ContainersContent({
  containerList,
}: {
  containerList: ContainerType[];
}) {
  const [selectedContainer, setSelectedContainer] = useState("");
  const [containerLogOption, setContainerLogOption] = useState("all");

  const generateLogs = () => {
    const logTypes = ["INFO", "DEBUG", "WARN", "ERROR"];
    const logs = [];
    for (let i = 0; i < 100; i++) {
      const date = new Date(Date.now() - i * 60000);
      const logType = logTypes[Math.floor(Math.random() * logTypes.length)];
      logs.push(
        `[${date.toISOString()}] ${logType}: Sample log message ${i + 1}`
      );
    }
    return logs.join("\n");
  };

  const renderContainerList = () => (
    <>
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Containers</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Server Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Cpu className="h-8 w-8 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">CPU Usage</p>
                <p className="text-lg font-semibold">65%</p>
              </div>
            </div>
            <div className="flex items-center">
              <HardDrive className="h-8 w-8 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Memory Usage</p>
                <p className="text-lg font-semibold">8.2 GB / 16 GB</p>
              </div>
            </div>
            <div className="flex items-center">
              <Database className="h-8 w-8 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Storage Usage</p>
                <p className="text-lg font-semibold">234 GB / 500 GB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="text-xl mb-4">Total Containers: {containerList.length}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {containerList &&
          containerList.map((container) => (
            <Card
              key={container.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle>{container.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setSelectedContainer(container.name)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );

  const renderContainerDetails = () => (
    <>
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => setSelectedContainer("")}
      >
        Back to Containers
      </Button>
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Container Details: {selectedContainer}
      </h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Container Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                value={containerLogOption}
                onValueChange={setContainerLogOption}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select log option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Logs</SelectItem>
                  <SelectItem value="error">Error Logs</SelectItem>
                  <SelectItem value="warn">Warning Logs</SelectItem>
                  <SelectItem value="info">Info Logs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <pre className="bg-blue-50 p-4 rounded-md overflow-x-auto h-64 overflow-y-scroll text-sm">
              {generateLogs()}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke="#3b82f6"
                    name="CPU (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="memory"
                    stroke="#10b981"
                    name="Memory (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="network"
                    stroke="#f59e0b"
                    name="Network (Mbps)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return selectedContainer ? renderContainerDetails() : renderContainerList();
}
