"use client";

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
} from "recharts";
import { cpuData,networkData,diskData,memoryData,ResourceDataType,LineType,CPU_LINE_ARRAY,NETWORK_LINE_ARRAY } from "./data/Mock";
import { ContainerType } from "./container-policy-manager";


export const Dashboard = ({ containerList}:{containerList:ContainerType[]}) => {

  const ResoureGraph = ({title, data, lineArray} : {title:string, data :ResourceDataType, lineArray:LineType[]}) => {
    
    return(
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
              {lineArray.map((line)=>{
                return(
                  <Line key={line.dataKey} type="monotone" dataKey={line.dataKey} stroke={line.stroke}/>
                )
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    )
  }

  const UsageGraph = ({title,data,color,totalValue} : {title:string, data: ResourceDataType, color:"#8884d8" | "#82ca9d", totalValue:string}) => {
    return(
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
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
      <ResoureGraph title="CPU Usage per Core" data={cpuData} lineArray={CPU_LINE_ARRAY}/>
      <ResoureGraph title="Network Traffic" data={networkData} lineArray={NETWORK_LINE_ARRAY}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsageGraph title="Memory Usage" data={memoryData} color ="#8884d8" totalValue="Total: 16GB"/>
        <UsageGraph title="Disk Usage" data={diskData} color ="#82ca9d" totalValue="Total: 500GB"/>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Container Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {containerList.map((container:ContainerType) => (
              <div key={container.name} className="text-center">
                <div
                  className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                    container.remove_at ? "bg-red-500" : "bg-green-500"
                  }`}
                ></div>
                <p>{container.name}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {container.remove_at}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
