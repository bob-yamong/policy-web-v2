export const sampleData = [
  { name: "00:00", cpu: 40, memory: 24, network: 24 },
  { name: "03:00", cpu: 30, memory: 13, network: 22 },
  { name: "06:00", cpu: 20, memory: 98, network: 22 },
  { name: "09:00", cpu: 27, memory: 39, network: 20 },
  { name: "12:00", cpu: 18, memory: 48, network: 21 },
  { name: "15:00", cpu: 23, memory: 38, network: 25 },
  { name: "18:00", cpu: 34, memory: 43, network: 21 },
  //이건 나중에 동적으로 변경
];

export const cpuData = [
    { time: "00:00", core1: 30, core2: 40, core3: 20, core4: 50 },
    { time: "01:00", core1: 40, core2: 30, core3: 40, core4: 35 },
    { time: "02:00", core1: 45, core2: 55, core3: 30, core4: 40 },
    { time: "03:00", core1: 35, core2: 45, core3: 50, core4: 30 },
    { time: "04:00", core1: 50, core2: 35, core3: 40, core4: 45 },
  ];
  
export const networkData = [
    { time: "00:00", in: 100, out: 50 },
    { time: "01:00", in: 120, out: 60 },
    { time: "02:00", in: 90, out: 70 },
    { time: "03:00", in: 150, out: 80 },
    { time: "04:00", in: 110, out: 55 },
  ];
  
export const memoryData = [
    { name: "Used", value: 8 },
    { name: "Free", value: 8 },
  ];
  
export const diskData = [
    { name: "Used", value: 234 },
    { name: "Free", value: 266 },
  ];

export type ResourceDataType = typeof cpuData | typeof networkData | typeof diskData | typeof memoryData

export interface LineType {dataKey:string,stroke:string}

export const CPU_LINE_ARRAY : LineType[] = [
  {dataKey:"core1", stroke:"#8884d8"},
  {dataKey:"core2", stroke:"#82ca9d"},
  {dataKey:"core3", stroke:"#ffc658"},
  {dataKey:"core4", stroke:"#ff7300"},
];

export const NETWORK_LINE_ARRAY :LineType[] = [
  {dataKey:"in", stroke:"#8884d8"},
  {dataKey:"out", stroke:"#82ca9d"}
]