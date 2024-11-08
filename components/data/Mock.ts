import { ContainerType } from "../container-policy-manager";

export const sampleData = [
  { name: "00:00", cpu: 40, memory: 24, network: 24 },
  { name: "03:00", cpu: 30, memory: 13, network: 22 },
  { name: "06:00", cpu: 20, memory: 98, network: 22 },
  { name: "09:00", cpu: 27, memory: 39, network: 20 },
  { name: "12:00", cpu: 18, memory: 48, network: 21 },
  { name: "15:00", cpu: 23, memory: 38, network: 25 },
  { name: "18:00", cpu: 34, memory: 43, network: 21 },
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

export type ResourceDataType = typeof cpuData | typeof networkData | typeof diskData | typeof memoryData;

export interface LineType {
  dataKey: string;
  stroke: string;
}

export const CPU_LINE_ARRAY: LineType[] = [
  { dataKey: "core1", stroke: "#8884d8" },
  { dataKey: "core2", stroke: "#82ca9d" },
  { dataKey: "core3", stroke: "#ffc658" },
  { dataKey: "core4", stroke: "#ff7300" },
];

export const NETWORK_LINE_ARRAY: LineType[] = [
  { dataKey: "in", stroke: "#8884d8" },
  { dataKey: "out", stroke: "#82ca9d" },
];

export type logLevel = "low" | "medium" | "high";

export interface Policy {
  api_version: string;
  name: string;
  policy: ContainerPolicy;
}

export interface ContainerPolicy {
  container_name: string;
  raw_tp: "on" | "off";
  tracepoint_policy: TracepointPolicy;
  lsm_policies: LsmPolicies;
}

export interface TracepointPolicy {
  tracepoints: string[];
}

export interface LsmPolicies {
  file: FilePolicy[];
  network: NetworkPolicy[];
  process: ProcessPolicy[];
}

export interface FilePolicy {
  path: string;
  flags: FilePolicyFlags[];
  uid: number[];
}

export type FilePolicyFlags =
  | "POLICY_ALLOW"
  | "POLICY_AUDIT"
  | "POLICY_FILE_READ"
  | "POLICY_FILE_WRITE"
  | "POLICY_FILE_APPEND"
  | "POLICY_RECURSIVE";

export interface NetworkArgument {
  ip: string;
  port: number;
  protocol: number | "tcp" | "udp";
}

export interface NetworkPolicy extends NetworkArgument {
  flags: NetworkPolicyFlags[];
  uid: number[];
}

export type NetworkPolicyFlags =
  | "POLICY_ALLOW"
  | "POLICY_AUDIT"
  | "POLICY_NET_CONNECT"
  | "POLICY_DENY"
  | "POLICY_NET_BIND"
  | "POLICY_NET_ACCEPT";

export interface ProcessPolicy {
  comm: string;
  flags: ProcessPolicyFlags[];
  uid: number[];
}

export type ProcessPolicyFlags =
  | "POLICY_ALLOW"
  | "POLICY_AUDIT"
  | "POLICY_PROC_EXEC";

export type PolicyOptionType = "" | "check" | "logging" | "create";
export type CreatePolicyOptionType = "" | "predefined" | "custom";
export type CustomPolicyStepType = 0 | 1 | 2;

export const webServerRulesPolicy = (selectedContainer: ContainerType): Policy => ({
  api_version: "v1",
  name: `Web Server Rules for ${selectedContainer.name}`,
  policy: {
    container_name: selectedContainer?.name || "",
    raw_tp: "on",
    tracepoint_policy: {
      tracepoints: ["__NR_accept", "__NR_recvfrom"],
    },
    lsm_policies: {
      file: [
        {
          path: "/var/www",
          flags: ["POLICY_ALLOW", "POLICY_AUDIT", "POLICY_FILE_READ"],
          uid: [1000, 1001],
        },
        {
          path: "/var/log",
          flags: ["POLICY_ALLOW", "POLICY_AUDIT", "POLICY_FILE_APPEND"],
          uid: [1000],
        },
      ],
      network: [
        {
          ip: "0.0.0.0",
          port: 80,
          protocol: 6, // TCP
          flags: ["POLICY_ALLOW", "POLICY_AUDIT", "POLICY_NET_CONNECT"],
          uid: [1000],
        },
        {
          ip: "0.0.0.0",
          port: 443,
          protocol: 6, // TCP
          flags: ["POLICY_ALLOW", "POLICY_AUDIT", "POLICY_NET_CONNECT"],
          uid: [1001],
        },
      ],
      process: [
        {
          comm: "nginx",
          flags: ["POLICY_ALLOW", "POLICY_AUDIT", "POLICY_PROC_EXEC"],
          uid: [1000],
        },
      ],
    },
  },
});

export const blockRootUserPolicy = (selectedContainer: ContainerType): Policy => ({
  api_version: "v1",
  name: `Block Root User for ${selectedContainer.name}`,
  policy: {
    container_name: selectedContainer?.name || "",
    raw_tp: "on",
    tracepoint_policy: {
      tracepoints: ["__NR_setuid", "__NR_setgid"],
    },
    lsm_policies: {
      file: [
        {
          path: "/root",
          flags: ["POLICY_AUDIT", "POLICY_FILE_READ"],
          uid: [0],
        },
      ],
      network: [
        {
          ip: "0.0.0.0",
          port: 22,
          protocol: 6, // TCP
          flags: ["POLICY_AUDIT", "POLICY_NET_CONNECT"],
          uid: [0],
        },
      ],
      process: [
        {
          comm: "bash",
          flags: ["POLICY_AUDIT", "POLICY_PROC_EXEC"],
          uid: [0],
        },
      ],
    },
  },
});

export const blockContainerEscapePolicy = (selectedContainer: ContainerType): Policy => ({
  api_version: "v1",
  name: `Block Container Escape for ${selectedContainer.name}`,
  policy: {
    container_name: selectedContainer?.name || "",
    raw_tp: "on",
    tracepoint_policy: {
      tracepoints: ["__NR_clone", "__NR_unshare"],
    },
    lsm_policies: {
      file: [
        {
          path: "/proc",
          flags: ["POLICY_AUDIT", "POLICY_FILE_READ"],
          uid: [1000],
        },
      ],
      network: [
        {
          ip: "10.0.0.0/8",
          port: 0,
          protocol: 0, // Any
          flags: ["POLICY_DENY", "POLICY_AUDIT"],
          uid: [1000, 1001],
        },
      ],
      process: [
        {
          comm: "docker",
          flags: ["POLICY_AUDIT", "POLICY_PROC_EXEC"],
          uid: [1000],
        },
      ],
    },
  },
});
