import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie
} from "recharts";
import { cpuData, networkData, diskData, memoryData, ResourceDataType, LineType, CPU_LINE_ARRAY, NETWORK_LINE_ARRAY } from "./data/Mock";
import { ContainerType } from "./container-policy-manager";
import Table from "./table"; // Ensure the correct path

// Mock Data for testing
const mockCpuData = [
  { time: '00:00', temperature: 45, load_average: 1.2, processes: 220 },
  { time: '01:00', temperature: 47, load_average: 1.5, processes: 230 },
  { time: '02:00', temperature: 50, load_average: 1.7, processes: 250 },
  { time: '03:00', temperature: 55, load_average: 1.8, processes: 260 },
  { time: '04:00', temperature: 60, load_average: 2.0, processes: 270 },
];

const mockContainerData = [
  { name: "Container 1", ip: "192.168.1.1", uptime: "3 days", cpu: "12%", memory: "75%" },
  { name: "Container 2", ip: "192.168.1.2", uptime: "1 day", cpu: "30%", memory: "65%" },
  { name: "Container 3", ip: "192.168.1.3", uptime: "5 hours", cpu: "45%", memory: "50%" },
  { name: "Container 4", ip: "192.168.1.4", uptime: "12 hours", cpu: "20%", memory: "60%" },
];

// Mock Alert Data
const mockAlerts = [
  { type: "Memory Spike", container: "Container 3", severity: "Critical" },
  { type: "High CPU Usage", container: "Container 2", severity: "Warning" },
  { type: "Disk Full", container: "Container 1", severity: "Critical" },
  { type: "Network Traffic", container: "Container 4", severity: "Info" },
];

// Mock Server Status
const mockServerStatus = {
  status: "Running",
  lastChecked: "10 minutes ago",
  diskSpace: "80% used",
  memoryUsage: "70% used",
};

export const Dashboard = ({ containerList }: { containerList: ContainerType[] }) => {

  const ResoureGraph = ({ title, data, lineArray }: { title: string, data: ResourceDataType, lineArray: LineType[] }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              {lineArray.map((line) => (
                <Line key={line.dataKey} type="monotone" dataKey={line.dataKey} stroke={line.stroke} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const UsageGraph = ({ title, data, color, totalValue }: { title: string, data: ResourceDataType, color: "#8884d8" | "#82ca9d", totalValue: string }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={color} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center mt-2">{totalValue}</p>
      </CardContent>
    </Card>
  );

  // Disk Usage Donut Chart
  const DiskUsageDonut = ({ used, total }: { used: number, total: number }) => {
    const data = [
      { name: 'Used', value: used, fill: '#82ca9d' },
      { name: 'Free', value: total - used, fill: '#ccc' }
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Disk Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" outerRadius={80} innerRadius={60} fill="#82ca9d" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center mt-2">Total: {total}GB</p>
        </CardContent>
      </Card>
    );
  };

  // Memory Usage Line Graph
  const MemoryUsageLine = ({ data }: { data: ResourceDataType }) => (
    <Card>
      <CardHeader>
        <CardTitle>Memory Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
      
      {/* Resource Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResoureGraph title="CPU Usage per Core" data={cpuData} lineArray={CPU_LINE_ARRAY} />
        <ResoureGraph title="Network Traffic" data={networkData} lineArray={NETWORK_LINE_ARRAY} />
        <MemoryUsageLine data={memoryData} />
        <DiskUsageDonut used={400} total={500} /> {/* Example: 400GB used, 500GB total */}
      </div>

      {/* Server Health & Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CPU Temperature */}
        <Card>
          <CardHeader>
            <CardTitle>CPU Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockCpuData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="temperature" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Server Uptime */}
        <Card>
          <CardHeader>
            <CardTitle>Server Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockCpuData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="uptime" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Active Services Status */}
        <Card>
          <CardHeader>
            <CardTitle>Active Services Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Service 1</p>
                <span className="text-green-500">Active</span>
              </div>
              <div className="flex justify-between">
                <p>Service 2</p>
                <span className="text-red-500">Inactive</span>
              </div>
              <div className="flex justify-between">
                <p>Service 3</p>
                <span className="text-yellow-500">Warning</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>

      {/* New Visualizations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        
        {/* Server Load Average */}
        <Card>
          <CardHeader>
            <CardTitle>Server Load Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Current Load: 1.5</p>
              <p>Last 5 minutes: 1.2</p>
              <p>Last 15 minutes: 1.7</p>
            </div>
          </CardContent>
        </Card>

        {/* Number of Processes Running */}
        <Card>
          <CardHeader>
            <CardTitle>Number of Processes Running</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Current Processes: 250</p>
              <p>Average Load: 1.8</p>
              <p>Processes Over Time: </p>
              <LineChart data={mockCpuData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="processes" stroke="#ff7300" />
              </LineChart>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Containers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Containers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table data={mockContainerData} columns={["Name", "IP", "Uptime", "CPU%", "Memory%"]} />
        </CardContent>
      </Card>

      {/* Alerts Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {mockAlerts.map((alert, index) => (
              <li key={index} className={alert.severity === "Critical" ? "text-red-500" : "text-yellow-500"}>
                {alert.type} on {alert.container} - <span>{alert.severity}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Server Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Server Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Status: {mockServerStatus.status}</p>
            <p>Last Checked: {mockServerStatus.lastChecked}</p>
            <p>Disk Space: {mockServerStatus.diskSpace}</p>
            <p>Memory Usage: {mockServerStatus.memoryUsage}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
