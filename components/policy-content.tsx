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
import { logLevel, Policy, SendPolicy, FilePolicyFlags, NetworkPolicyFlags, ProcessPolicyFlags, PolicyOptionType, CreatePolicyOptionType, NetworkArgument, CustomPolicyStepType, webServerRulesPolicy, blockRootUserPolicy, blockContainerEscapePolicy } from "./data/Mock";
import yaml from 'js-yaml';


export const PolicyContent = ({
  onRedirect,
  containerList,
}: {
  onRedirect: (page: string, container: string) => void;
  containerList: ContainerType[];
}) => {
  const [selectedContainer, setSelectedContainer] = useState<ContainerType>();
  const [loggingOption, setLoggingOption] = useState<logLevel>("medium");
  const [selectedPredefinedPolicy, setSelectedPredefinedPolicy] = useState<SendPolicy>();
  const [finalPolicy, setFinalPolicy] = useState<SendPolicy>();
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [policyOption, setPolicyOption] = useState<PolicyOptionType>("");
  const [createPolicyOption, setCreatePolicyOption] = useState<CreatePolicyOptionType>("");

  const [selectedArgument, setSelectedArgument] = useState("");
  const [customPolicyStep, setCustomPolicyStep] = useState<CustomPolicyStepType>(0);
  const [networkInputs, setNetworkInputs] = useState<NetworkArgument>({
    ip: "127.0.0.1",
    port: 22,
    protocol: 0
  });
  const [sudoUid, setSudoUid] = useState<number>();

  const renderPolicyYaml = (
    selectedContainer: ContainerType,
    selectedActions: string[],
    selectedArgument: string,
    networkInputs: NetworkArgument
  ): SendPolicy => {
    const policyName = window.prompt("Policy name?");
    const policy: SendPolicy = {
      api_version: "v1",
      name: policyName || "",
      containers: [
        {
          container_name: selectedContainer?.name || "",
          raw_tp: "on", // "on" | "off" 타입 명시
          tracepoint_policy: {
            tracepoints: selectedActions.filter((action) => action.includes("tracepoint")),
          },
          lsm_policies: {
            file: selectedActions
              .filter((action) => action.includes("file"))
              .map(() => ({
                flags: [] as FilePolicyFlags[],
                uid: [] as number[],
                path: selectedArgument || "",
              })),
            network: selectedActions
              .filter((action) => action.includes("network"))
              .map(() => ({
                flags: [] as NetworkPolicyFlags[],
                uid: [] as number[],
                ip: networkInputs.ip || "",
                port: Number(networkInputs.port) || 0,
                protocol: networkInputs.protocol || 0
              })),
            process: selectedActions
              .filter((action) => action.includes("process"))
              .map(() => ({
                flags: [] as ProcessPolicyFlags[],
                uid: [] as number[],
                comm: selectedArgument || "",
              })),
          },
        },
      ],
    };
    return policy
  };


  useEffect(() => {
    if (customPolicyStep === 2) {
      const policyYaml: SendPolicy = renderPolicyYaml(selectedContainer, selectedActions, selectedArgument, networkInputs);
      setFinalPolicy((policyYaml));
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
    //이거 보내고 나서도 새로 받아와야됨, 그리고 보내고 나서 리다이렉팅도 해결해야됨
  }, [selectedContainer]);

  const toggleAction = (action: string) => {
    setSelectedActions((prev) =>
      prev.includes(action)
        ? prev.filter((a) => a !== action)
        : [...prev, action]
    );
  };

  const handleApplyPolicy = (isPredefined?: boolean) => {
    // predefined냐에 따라서, 여기서 정책 파일을 받아서 바로 서버에 넘기는 형식으로 변경해야 됨
    setIsLoading(true);

    console.log("API loading...")
    const policyData: SendPolicy = isPredefined ? (selectedPredefinedPolicy) : (finalPolicy);
    console.log(policyData)
    axios.post(`${BASE_URL}/policy/custom`, policyData, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      setIsLoading(false);
      onRedirect("containers", selectedContainer.name);
    }).catch((err) => console.log(err))
  };

  const renderBackButton = (onClick: () => void) => (
    <Button variant="outline" className="mb-4" onClick={onClick}>
      <ArrowLeft className="mr-2 h-4 w-4" /> Back
    </Button>
  );

  const CardSelectButton = ({ title, description, onClick, buttonText, isButton }: { title: string, description?: string, onClick: () => void, buttonText?: string, isButton?: boolean }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
        {isButton && (<Button onClick={onClick} className="bg-blue-500 hover:bg-blue-600 text-white mt-4">
          {buttonText}
        </Button>)}
      </CardContent>
    </Card>
  );

  const renderContainerList = () => (
    <>
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Select Container
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {containerList &&
          containerList.map((container) => (
            <CardSelectButton key={container.id} title={container.name} onClick={() => setSelectedContainer(container)} buttonText="Select" isButton />
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
        <CardSelectButton title="Check Policy" description="View applied policies" onClick={() => setPolicyOption("check")} />
        <CardSelectButton title="Check Logging Option" description="View and change logging settings" onClick={() => setPolicyOption("logging")} />
        <CardSelectButton title="Create Policy" description="Create new policies" onClick={() => setPolicyOption("create")} />
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
              policies.map((policy, policyIndex) => (
                <li key={policyIndex} className="mb-6">
                  <pre className="bg-gray-50 p-4 rounded-lg shadow-md text-sm whitespace-pre-wrap overflow-x-auto max-h-96">
                    {`api_version: ${policy.api_version}
  name: ${policy.name}
  policy:
    container_name: ${policy.policy.container_name}
    raw_tp: ${policy.policy.raw_tp}
    tracepoint_policy:
      tracepoints:
  ${policy.policy.tracepoint_policy.tracepoints
                        .map((tp) => `      - ${tp}`)
                        .join("\n")}
    lsm_policies:
      file:
  ${policy.policy.lsm_policies.file
                        .map(
                          (filePolicy) => `      - path: ${filePolicy.path}
          flags: [${filePolicy.flags.join(", ")}]
          uid: [${filePolicy.uid.join(", ")}]`
                        )
                        .join("\n")}
      network:
  ${policy.policy.lsm_policies.network
                        .map(
                          (netPolicy) => `      - ip: ${netPolicy.ip}
          port: ${netPolicy.port}
          protocol: ${netPolicy.protocol}
          flags: [${netPolicy.flags.join(", ")}]
          uid: [${netPolicy.uid.join(", ")}]`
                        )
                        .join("\n")}
      process:
  ${policy.policy.lsm_policies.process
                        .map(
                          (procPolicy) => `      - comm: ${procPolicy.comm}
          flags: [${procPolicy.flags.join(", ")}]
          uid: [${procPolicy.uid.join(", ")}]`
                        )
                        .join("\n")}`}
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
              className={`p-4 rounded-md ${loggingOption === "high" ? "bg-red-100" : "bg-gray-100"
                }`}
            >
              <h3 className="font-semibold">High</h3>
              <p>
                Logs all system calls using tracepoint and LSM, and logs
                critical events based on user policy.
              </p>
            </div>
            <div
              className={`p-4 rounded-md ${loggingOption === "medium" ? "bg-yellow-100" : "bg-gray-100"
                }`}
            >
              <h3 className="font-semibold">Medium</h3>
              <p>Logs only important system calls and policy violation logs.</p>
            </div>
            <div
              className={`p-4 rounded-md ${loggingOption === "low" ? "bg-green-100" : "bg-gray-100"
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
                onClick={() => {
                  if (policy === "Web Server Rules") {
                    setSelectedPredefinedPolicy((webServerRulesPolicy(selectedContainer)));
                  } else if (policy === "Block Root User") {
                    setSelectedPredefinedPolicy((blockRootUserPolicy(selectedContainer)));
                  } else if (policy === "Block Container Escape") {
                    setSelectedPredefinedPolicy((blockContainerEscapePolicy(selectedContainer)));
                  }
                }}
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
              {yaml.dump(selectedPredefinedPolicy)}
              {/* {JSON.stringify(selectedPredefinedPolicy,null,2)} */}
            </pre>
            <Button
              onClick={() => handleApplyPolicy(true)}
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
                  className={`cursor-pointer transition-all duration-200 ${selectedActions.includes(action)
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
                className={`cursor-pointer transition-all duration-200 ${selectedActions.includes(action)
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
                  className={`cursor-pointer transition-all duration-200 ${selectedActions.includes(action)
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
                value={networkInputs && networkInputs.ip}
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
                value={networkInputs && networkInputs.port}
                onChange={(e) =>
                  setNetworkInputs({ ...networkInputs, port: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="protocol">Protocol</Label>
              <Select
                value={
                  networkInputs.protocol === 6
                    ? "tcp"
                    : networkInputs.protocol === 17
                      ? "udp"
                      : ""
                }
                onValueChange={(value) => {
                  const newProtocol = value === "tcp" ? 6 : value === "udp" ? 17 : 0;
                  setNetworkInputs({ ...networkInputs, protocol: newProtocol });
                }}
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
              onChange={(e) => setSudoUid(Number(e.target.value))}
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
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Final Policy</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {yaml.dump(finalPolicy)}
            {/* {JSON.stringify(finalPolicy,null,2)} */}
          </pre>
          <Button
            onClick={() => handleApplyPolicy()}
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
            setCustomPolicyStep(Math.max(0, customPolicyStep - 1) as CustomPolicyStepType);
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
