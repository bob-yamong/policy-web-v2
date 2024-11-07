"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BASE_URL,
  ContainerType,
  SERVER_NUMBER,
} from "./container-policy-manager";

export interface containerPropsType {
  name: string;
  id: number;
}



export function PolicyContent({
  onRedirect,
  containerList,
}: {
  onRedirect: (page: string, container: string) => void;
  containerList: ContainerType[];
}) {
  const [selectedContainer, setSelectedContainer] =
    useState<containerPropsType>();
  const [policyOption, setPolicyOption] = useState("");
  const [loggingOption, setLoggingOption] = useState("medium");
  const [createPolicyOption, setCreatePolicyOption] = useState("");
  const [selectedPredefinedPolicy, setSelectedPredefinedPolicy] = useState("");
  const [selectedArgument, setSelectedArgument] = useState("");
  const [isBlacklist, setIsBlacklist] = useState(true);
  const [customPolicyStep, setCustomPolicyStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [finalPolicy, setFinalPolicy] = useState("");
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [networkInputs, setNetworkInputs] = useState({
    ip: "",
    port: "",
    protocol: "tcp",
  });
  const [sudoUid, setSudoUid] = useState("");
  const [policies, setPolicies] = useState([]);

  // const predefinedPolicy =JSON.stringify(
  //   //이거 나중에 헤더파일로 빼던지 아니면 서버에서 받던지
  //   {
  //     api_version: "v1",
  //     name: `${selectedPredefinedPolicy.toLowerCase().replace(/ /g, "-")} for ${selectedContainer.name}`,
  //     containers: [
  //       {
  //         container_name: selectedContainer?.name || "",
  //         raw_tp: "true",
  //         tracepoint_policy: {
  //           tracepoints: ["tracepoint1", "tracepoint2"], // 예시 데이터
  //         },
  //         lsm_policies: {
  //           file: [
  //             {
  //               flags: [],
  //               uid: [],
  //               path: "/path/to/file",
  //             },
  //           ],
  //           network: [
  //             {
  //               flags: [],
  //               uid: [],
  //               ip: "0.0.0.0",
  //               port: 22,
  //               protocol: 1, // tcp 예시
  //             },
  //           ],
  //           process: [
  //             {
  //               flags: [],
  //               uid: [],
  //               comm: "example-process",
  //             },
  //           ],
  //         },
  //       },
  //     ],
  //   },
  //   null,
  //   2
  // )

  const renderPolicyYaml = (): string => {
    const policyName = window.prompt("policy name?")
    const policy = {
      api_version: "v1",
      name: policyName,
      containers: [
        {
          container_name: selectedContainer?.name || "",
          raw_tp: "true", 
          tracepoint_policy: {
            tracepoints: selectedActions.filter((action) =>
              action.includes("tracepoint")
            ),
          },
          lsm_policies: {
            file: selectedActions
              .filter((action) => action.includes("file"))
              .map(() => ({
                flags: [], 
                uid: [], 
                path: selectedArgument || "", 
              })),
            network: selectedActions
              .filter((action) => action.includes("network"))
              .map(() => ({
                flags: [], 
                uid: [], 
                ip: networkInputs.ip || "",
                port: Number(networkInputs.port) || 0,
                protocol:
                  networkInputs.protocol === "tcp"
                    ? 1
                    : networkInputs.protocol === "udp"
                    ? 2
                    : 0, // 예시: tcp=1, udp=2
              })),
            process: selectedActions
              .filter((action) => action.includes("process"))
              .map(() => ({
                flags: [], 
                uid: [], 
                comm: selectedArgument || "", 
              })),
          },
        },
      ],
    };
  
    return JSON.stringify(policy, null, 2); 
  };

  useEffect(() => {
    if (customPolicyStep === 2) {
      const policyYaml = renderPolicyYaml();
      setFinalPolicy(policyYaml);
    }
  }, [customPolicyStep]);

  useEffect(() => {
    if (selectedContainer)
      axios
        .get(
          `${BASE_URL}/policy/container/${selectedContainer.id}?server_id=${SERVER_NUMBER}`
        )
        .then((res) => {
          setPolicies(res.data.policies);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
  }, [selectedContainer]);

  const toggleAction = (action: string) => {
    setSelectedActions((prev) =>
      prev.includes(action)
        ? prev.filter((a) => a !== action)
        : [...prev, action]
    );
  };

  const handleApplyPolicy = (isPredefined?:boolean) => {
    // predefined냐에 따라서, 여기서 정책 파일을 받아서 바로 서버에 넘기는 형식으로 변경해야 됨
    setIsLoading(true);

    console.log("API loading...")
    const policyData = isPredefined ? JSON.parse(selectedPredefinedPolicy):JSON.parse(finalPolicy);
    console.log(policyData)
    axios.post(`${BASE_URL}/policy/custom`,policyData, {headers: {
      "Content-Type": "application/json",
    },}).then((res)=>{console.log(res);
        setIsLoading(false);
        onRedirect("containers", selectedContainer.name);
    }).catch((err)=>console.log(err))
  };

  const renderBackButton = (onClick: () => void) => (
    <Button variant="outline" className="mb-4" onClick={onClick}>
      <ArrowLeft className="mr-2 h-4 w-4" /> Back
    </Button>
  );

  const renderContainerList = () => (
    <>
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Select Container
      </h1>
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
                  onClick={() =>
                    setSelectedContainer({
                      name: container.name,
                      id: container.id,
                    })
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );

  const renderPolicyOptions = () => (
    <>
      {renderBackButton(() => setSelectedContainer(null))}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Policy Options for {selectedContainer.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setPolicyOption("check")}
        >
          <CardHeader>
            <CardTitle>Check Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View applied policies</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setPolicyOption("logging")}
        >
          <CardHeader>
            <CardTitle>Check Logging Option</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and change logging settings</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setPolicyOption("create")}
        >
          <CardHeader>
            <CardTitle>Create Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Create new policies</p>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderCheckPolicy = () => (
    <>
      {renderBackButton(() => setPolicyOption(""))}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Applied Policies for {selectedContainer.name}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Current Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            {policies &&
              policies.map((policy, index) => (
                <li key={index} className="mb-6">
                  <pre className="bg-gray-50 p-4 rounded-lg shadow-md text-sm whitespace-pre-wrap">
                    api_version: {policy.api_version}
                    {"\n"}name: {policy.name}
                    {"\n"}policy:
                    <div className="ml-4">
                      container_name: {policy.policy.container_name}
                      {"\n"}lsm_policies:
                      <div className="ml-4">
                        file:
                        {policy.policy.lsm_policies.file.map(
                          (filePolicy, fileIndex) => (
                            <div key={fileIndex} className="ml-6">
                              - path: {filePolicy.path}
                              {"\n"} flags: [{filePolicy.flags.join(", ")}]
                              {"\n"} uid: [{filePolicy.uid.join(", ")}]
                            </div>
                          )
                        )}
                        {"\n"}network:
                        {policy.policy.lsm_policies.network.map(
                          (netPolicy, netIndex) => (
                            <div key={netIndex} className="ml-6">
                              - ip: {netPolicy.ip}
                              {"\n"} port: {netPolicy.port}
                              {"\n"} protocol: {netPolicy.protocol}
                              {"\n"} flags: [{netPolicy.flags.join(", ")}]{"\n"}{" "}
                              uid: [{netPolicy.uid.join(", ")}]
                            </div>
                          )
                        )}
                        {"\n"}process:
                        {policy.policy.lsm_policies.process.map(
                          (procPolicy, procIndex) => (
                            <div key={procIndex} className="ml-6">
                              - comm: {procPolicy.comm}
                              {"\n"} flags: [{procPolicy.flags.join(", ")}]
                              {"\n"} uid: [{procPolicy.uid.join(", ")}]
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </pre>
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );

  const renderLoggingOption = () => (
    <>
      {renderBackButton(() => setPolicyOption(""))}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Logging Options for {selectedContainer.name}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>
            Current Logging Level:{" "}
            {loggingOption.charAt(0).toUpperCase() + loggingOption.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className={`p-4 rounded-md ${
                loggingOption === "high" ? "bg-red-100" : "bg-gray-100"
              }`}
            >
              <h3 className="font-semibold">High</h3>
              <p>
                Logs all system calls using tracepoint and LSM, and logs
                critical events based on user policy.
              </p>
            </div>
            <div
              className={`p-4 rounded-md ${
                loggingOption === "medium" ? "bg-yellow-100" : "bg-gray-100"
              }`}
            >
              <h3 className="font-semibold">Medium</h3>
              <p>Logs only important system calls and policy violation logs.</p>
            </div>
            <div
              className={`p-4 rounded-md ${
                loggingOption === "low" ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <h3 className="font-semibold">Low</h3>
              <p>Logs only policy violation logs.</p>
            </div>
          </div>
          <div className="mt-4 space-x-2">
            <Button
              onClick={() => setLoggingOption("high")}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Set High
            </Button>
            <Button
              onClick={() => setLoggingOption("medium")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Set Medium
            </Button>
            <Button
              onClick={() => setLoggingOption("low")}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Set Low
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderCreatePolicy = () => (
    <>
      {renderBackButton(() => setPolicyOption(""))}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Create Policy for {selectedContainer.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setCreatePolicyOption("predefined")}
        >
          <CardHeader>
            <CardTitle>Apply Predefined Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Choose from a set of predefined policies</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setCreatePolicyOption("custom")}
        >
          <CardHeader>
            <CardTitle>Create Custom Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Define a custom policy for this container</p>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderPredefinedPolicies = () => (

    <>
      {renderBackButton(() => setCreatePolicyOption(""))}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Predefined Policies</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Web Server Rules", "Block Root User", "Block Container Escape"].map((policy) => (
          <Card key={policy} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{policy}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setSelectedPredefinedPolicy(
                  JSON.stringify(
                    //이거 나중에 헤더파일로 빼던지 아니면 서버에서 받던지
                    {
                      api_version: "v1",
                      name: `${policy} for ${selectedContainer.name}`,
                      containers: [
                        {
                          container_name: selectedContainer?.name || "",
                          raw_tp: "true",
                          tracepoint_policy: {
                            tracepoints: ["tracepoint1", "tracepoint2"], // 예시 데이터
                          },
                          lsm_policies: {
                            file: [
                              {
                                flags: [],
                                uid: [],
                                path: "/path/to/file",
                              },
                            ],
                            network: [
                              {
                                flags: [],
                                uid: [],
                                ip: "0.0.0.0",
                                port: 22,
                                protocol: 1, // tcp 예시
                              },
                            ],
                            process: [
                              {
                                flags: [],
                                uid: [],
                                comm: "example-process",
                              },
                            ],
                          },
                        },
                      ],
                    },
                    null,
                    2
                  )
                )}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                View Policy
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedPredefinedPolicy && (
        <Card className="mt-6">
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              {selectedPredefinedPolicy}
            </pre>
            <Button
              onClick={()=>handleApplyPolicy(true)}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white"
            >
              Apply Policy
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );

  const renderCustomPolicy = () => {
    const renderActionSelection = () => (
      <Tabs defaultValue="network" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="filesystem">Filesystem</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
        </TabsList>
        <TabsContent value="network">
          <div className="grid grid-cols-2 gap-4">
            {["block-inbound-network", "block-outbound-network"].map(
              (action) => (
                <Card
                  key={action}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedActions.includes(action)
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white"
                  }`}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={action}
                        checked={selectedActions.includes(action)}
                        onCheckedChange={() => toggleAction(action)}
                      />
                      <Label htmlFor={action} className="font-semibold">
                        {action === "block-inbound-network"
                          ? "Block Inbound"
                          : "Block Outbound"}
                      </Label>
                    </div>
                  </CardHeader>
                </Card>
              )
            )}
          </div>
        </TabsContent>
        <TabsContent value="filesystem">
          <div className="grid grid-cols-2 gap-4">
            {[
              "block-file-read",
              "block-file-write",
              "block-file-execute",
              "block-file-rename",
              "block-file-delete",
              "block-directory-creation",
              "block-file-creation",
            ].map((action) => (
              <Card
                key={action}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedActions.includes(action)
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white"
                }`}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={action}
                      checked={selectedActions.includes(action)}
                      onCheckedChange={() => toggleAction(action)}
                    />
                    <Label htmlFor={action} className="font-semibold">
                      {action
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </Label>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="process">
          <div className="grid grid-cols-2 gap-4">
            {["block-process-creation", "block-sudo", "ml-analysis"].map(
              (action) => (
                <Card
                  key={action}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedActions.includes(action)
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white"
                  }`}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={action}
                        checked={selectedActions.includes(action)}
                        onCheckedChange={() => toggleAction(action)}
                      />
                      <Label htmlFor={action} className="font-semibold">
                        {action
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </Label>
                    </div>
                  </CardHeader>
                </Card>
              )
            )}
          </div>
        </TabsContent>
      </Tabs>
    );

    const renderArgumentInput = () => (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Enter Arguments</h2>
        {selectedActions.some((action) => action.includes("file")) && (
          <div>
            <Label htmlFor="path">File or Directory Path</Label>
            <Input
              id="path"
              placeholder="Enter path"
              value={selectedArgument}
              onChange={(e) => setSelectedArgument(e.target.value)}
            />
          </div>
        )}
        {selectedActions.some((action) => action.includes("network")) && (
          <>
            <div>
              <Label htmlFor="ip">IP Address</Label>
              <Input
                id="ip"
                placeholder="Enter IP address"
                value={networkInputs.ip}
                onChange={(e) =>
                  setNetworkInputs({ ...networkInputs, ip: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                placeholder="Enter port number"
                value={networkInputs.port}
                onChange={(e) =>
                  setNetworkInputs({ ...networkInputs, port: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="protocol">Protocol</Label>
              <Select
                value={networkInputs.protocol}
                onValueChange={(value) =>
                  setNetworkInputs({ ...networkInputs, protocol: value })
                }
              >
                <SelectTrigger id="protocol">
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="udp">UDP</SelectItem>
                  <SelectItem value="http">HTTP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {selectedActions.includes("block-process-creation") && (
          <div>
            <Label htmlFor="process">Process Name</Label>
            <Input
              id="process"
              placeholder="Enter process name"
              value={selectedArgument}
              onChange={(e) => setSelectedArgument(e.target.value)}
            />
          </div>
        )}
        {selectedActions.includes("block-sudo") && (
          <div>
            <Label htmlFor="uid">UID</Label>
            <Input
              id="uid"
              placeholder="Enter UID"
              value={sudoUid}
              onChange={(e) => setSudoUid(e.target.value)}
            />
          </div>
        )}
        {selectedActions.includes("ml-analysis") && (
          <div>
            <p>Machine Learning analysis will be applied to this container.</p>
          </div>
        )}
        <Button
          onClick={() => setCustomPolicyStep(2)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Next
        </Button>
      </div>
    );

    const renderFinalPolicy = () => {
      //const policyYaml = renderPolicyYaml();

      // setFinalPolicy(policyYaml);
      console.log(finalPolicy)
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Final Policy</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {finalPolicy}
          </pre>
          <Button
            onClick={()=>handleApplyPolicy()}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Apply Policy
          </Button>
        </div>
      );
    };

    return (
      <>
        {renderBackButton(() => {
          if (customPolicyStep > 0) {
            setCustomPolicyStep(customPolicyStep - 1);
            if (customPolicyStep === 1) {
              setSelectedActions([]);
            }
          } else {
            setCreatePolicyOption("");
          }
        })}
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          Create Custom Policy
        </h1>
        {customPolicyStep === 0 && (
          <>
            {renderActionSelection()}
            <Button
              onClick={() => setCustomPolicyStep(1)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={selectedActions.length === 0}
            >
              Next
            </Button>
          </>
        )}
        {customPolicyStep === 1 && renderArgumentInput()}
        {customPolicyStep === 2 && renderFinalPolicy()}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
        <p className="ml-4 text-xl">
          Applying policy and redirecting to Dashboard...
        </p>
      </div>
    );
  }

  if (!selectedContainer) return renderContainerList();
  if (!policyOption) return renderPolicyOptions();
  if (policyOption === "check") return renderCheckPolicy();
  if (policyOption === "logging") return renderLoggingOption();
  if (policyOption === "create") {
    if (!createPolicyOption) return renderCreatePolicy();
    if (createPolicyOption === "predefined") return renderPredefinedPolicies();
    if (createPolicyOption === "custom") return renderCustomPolicy();
  }

  return null;
}
