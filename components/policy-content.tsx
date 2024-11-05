'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const containerList = ['Container1', 'Container2', 'Container3', 'Container4', 'Container5']

export function PolicyContent({ onRedirect }: { onRedirect: (page: string, container: string) => void }) {
  const [selectedContainer, setSelectedContainer] = useState('')
  const [policyOption, setPolicyOption] = useState('')
  const [loggingOption, setLoggingOption] = useState('medium')
  const [createPolicyOption, setCreatePolicyOption] = useState('')
  const [selectedPredefinedPolicy, setSelectedPredefinedPolicy] = useState('')
  const [selectedArgument, setSelectedArgument] = useState('')
  const [isBlacklist, setIsBlacklist] = useState(true)
  const [customPolicyStep, setCustomPolicyStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [finalPolicy, setFinalPolicy] = useState('')
  const [selectedActions, setSelectedActions] = useState<string[]>([])
  const [networkInputs, setNetworkInputs] = useState({ ip: '', port: '', protocol: 'tcp' })
  const [sudoUid, setSudoUid] = useState('')

  const toggleAction = (action: string) => {
    setSelectedActions(prev =>
      prev.includes(action)
        ? prev.filter(a => a !== action)
        : [...prev, action]
    )
  }

  const handleApplyPolicy = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onRedirect('containers', selectedContainer)
    }, 2000)
  }

  const renderBackButton = (onClick: () => void) => (
    <Button
      variant="outline"
      className="mb-4"
      onClick={onClick}
    >
      <ArrowLeft className="mr-2 h-4 w-4" /> Back
    </Button>
  )

  const renderContainerList = () => (
    <>
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Select Container</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {containerList.map(container => (
          <Card key={container} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{container}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setSelectedContainer(container)} className="bg-blue-500 hover:bg-blue-600 text-white">Select</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )

  const renderPolicyOptions = () => (
    <>
      {renderBackButton(() => setSelectedContainer(''))}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Policy Options for {selectedContainer}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setPolicyOption('check')}>
          <CardHeader>
            <CardTitle>Check Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View applied policies</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setPolicyOption('logging')}>
          <CardHeader>
            <CardTitle>Check Logging Option</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and change logging settings</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setPolicyOption('create')}>
          <CardHeader>
            <CardTitle>Create Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Create new policies</p>
          </CardContent>
        </Card>
      </div>
    </>
  )

  const renderCheckPolicy = () => (
    <>
      {renderBackButton(() => setPolicyOption(''))}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Applied Policies for {selectedContainer}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Current Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li>Network: Block incoming connections on port 22</li>
            <li>Filesystem: Restrict write access to /etc directory</li>
            <li>Process: Prevent execution of sudo command</li>
          </ul>
        </CardContent>
      </Card>
    </>
  )

  const renderLoggingOption = () => (
    <>
      {renderBackButton(() => setPolicyOption(''))}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Logging Options for {selectedContainer}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Current Logging Level: {loggingOption.charAt(0).toUpperCase() + loggingOption.slice(1)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`p-4 rounded-md ${loggingOption === 'high' ? 'bg-red-100' : 'bg-gray-100'}`}>
              <h3 className="font-semibold">High</h3>
              <p>Logs all system calls using tracepoint and LSM, and logs critical events based on user policy.</p>
            </div>
            <div className={`p-4 rounded-md ${loggingOption === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
              <h3 className="font-semibold">Medium</h3>
              <p>Logs only important system calls and policy violation logs.</p>
            </div>
            <div className={`p-4 rounded-md ${loggingOption === 'low' ? 'bg-green-100' : 'bg-gray-100'}`}>
              <h3 className="font-semibold">Low</h3>
              <p>Logs only policy violation logs.</p>
            </div>
          </div>
          <div className="mt-4 space-x-2">
            <Button onClick={() => setLoggingOption('high')} className="bg-red-500 hover:bg-red-600 text-white">Set High</Button>
            <Button onClick={() => setLoggingOption('medium')} className="bg-yellow-500 hover:bg-yellow-600 text-white">Set Medium</Button>
            <Button onClick={() => setLoggingOption('low')} className="bg-green-500 hover:bg-green-600 text-white">Set Low</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderCreatePolicy = () => (
    <>
      {renderBackButton(() => setPolicyOption(''))}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Create Policy for {selectedContainer}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCreatePolicyOption('predefined')}>
          <CardHeader>
            <CardTitle>Apply Predefined Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Choose from a set of predefined policies</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCreatePolicyOption('custom')}>
          <CardHeader>
            <CardTitle>Create Custom Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Define a custom policy for this container</p>
          </CardContent>
        </Card>
      </div>
    </>
  )

  const renderPredefinedPolicies = () => (
    <>
      {renderBackButton(() => setCreatePolicyOption(''))}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Predefined Policies</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Web Server Rules', 'Block Root User', 'Block Container Escape'].map((policy) => (
          <Card key={policy} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{policy}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setSelectedPredefinedPolicy(policy)} className="bg-blue-500 hover:bg-blue-600 text-white">View Policy</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedPredefinedPolicy && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{selectedPredefinedPolicy}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              {`apiVersion: v1
kind: Policy
metadata:
  name: ${selectedPredefinedPolicy.toLowerCase().replace(/ /g, '-')}
spec:
  rules:
    - name: example-rule
      match:
        resources:
          - type: Container
      actions:
        - type: Block
          resource: Network
          conditions:
            - key: port
              operator: Equals
              value: "22"`}
            </pre>
            <Button onClick={handleApplyPolicy} className="mt-4 bg-green-500 hover:bg-green-600 text-white">Apply Policy</Button>
          </CardContent>
        </Card>
      )}
    </>
  )

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
            {['block-inbound-network', 'block-outbound-network'].map(action => (
              <Card key={action} className={`cursor-pointer transition-all duration-200 ${selectedActions.includes(action) ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}>
                <CardHeader className="p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={action}
                      checked={selectedActions.includes(action)}
                      onCheckedChange={() => toggleAction(action)}
                    />
                    <Label htmlFor={action} className="font-semibold">
                      {action === 'block-inbound-network' ? 'Block Inbound' : 'Block Outbound'}
                    </Label>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="filesystem">
          <div className="grid grid-cols-2 gap-4">
            {['block-file-read', 'block-file-write', 'block-file-execute', 'block-file-rename', 'block-file-delete', 'block-directory-creation', 'block-file-creation'].map(action => (
              <Card key={action} className={`cursor-pointer transition-all duration-200 ${selectedActions.includes(action) ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}>
                <CardHeader className="p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={action}
                      checked={selectedActions.includes(action)}
                      onCheckedChange={() => toggleAction(action)}
                    />
                    <Label htmlFor={action} className="font-semibold">
                      {action.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Label>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="process">
          <div className="grid grid-cols-2 gap-4">
            {['block-process-creation', 'block-sudo', 'ml-analysis'].map(action => (
              <Card key={action} className={`cursor-pointer transition-all duration-200 ${selectedActions.includes(action) ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}>
                <CardHeader className="p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={action}
                      checked={selectedActions.includes(action)}
                      onCheckedChange={() => toggleAction(action)}
                    />
                    <Label htmlFor={action} className="font-semibold">
                      {action.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Label>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    )

    const renderArgumentInput = () => (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Enter Arguments</h2>
        {selectedActions.some(action => action.includes('file')) && (
          <div>
            <Label htmlFor="path">File or Directory Path</Label>
            <Input id="path" placeholder="Enter path" value={selectedArgument} onChange={(e) => setSelectedArgument(e.target.value)} />
          </div>
        )}
        {selectedActions.some(action => action.includes('network')) && (
          <>
            <div>
              <Label htmlFor="ip">IP Address</Label>
              <Input 
                id="ip" 
                placeholder="Enter IP address" 
                value={networkInputs.ip}
                onChange={(e) => setNetworkInputs({...networkInputs, ip:  e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input 
                id="port" 
                placeholder="Enter port number" 
                value={networkInputs.port}
                onChange={(e) => setNetworkInputs({...networkInputs, port: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="protocol">Protocol</Label>
              <Select 
                value={networkInputs.protocol}
                onValueChange={(value) => setNetworkInputs({...networkInputs, protocol: value})}
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
        {selectedActions.includes('block-process-creation') && (
          <div>
            <Label htmlFor="process">Process Name</Label>
            <Input id="process" placeholder="Enter process name" value={selectedArgument} onChange={(e) => setSelectedArgument(e.target.value)} />
          </div>
        )}
        {selectedActions.includes('block-sudo') && (
          <div>
            <Label htmlFor="uid">UID</Label>
            <Input id="uid" placeholder="Enter UID" value={sudoUid} onChange={(e) => setSudoUid(e.target.value)} />
          </div>
        )}
        {selectedActions.includes('ml-analysis') && (
          <div>
            <p>Machine Learning analysis will be applied to this container.</p>
          </div>
        )}
        <Button onClick={() => setCustomPolicyStep(2)} className="bg-blue-500 hover:bg-blue-600 text-white">Next</Button>
      </div>
    )

    const renderPolicyYaml = () => {
      const policyYaml = `apiVersion: v1
      kind: Policy
      metadata:
        name: custom-policy
      spec:
        rules:
          ${selectedActions.map(action => `
          - name: ${action}
            match:
              resources:
                - type: Container
            actions:
              - type: Block
                resource: ${action.split('-')[1].charAt(0).toUpperCase() + action.split('-')[1].slice(1)}
                conditions:
                  ${action.includes('network') ? `
                  - key: ip
                    operator: Equals
                    value: "${networkInputs.ip}"
                  - key: port
                    operator: Equals
                    value: "${networkInputs.port}"
                  - key: protocol
                    operator: Equals
                    value: "${networkInputs.protocol}"
                  ` : action === 'block-sudo' ? `
                  - key: uid
                    operator: Equals
                    value: "${sudoUid}"
                  ` : `
                  - key: ${action.includes('file') ? 'path' : 'name'}
                    operator: Equals
                    value: "${selectedArgument}"
                  `}`).join('\n')}
      `
      return policyYaml
    }


    const renderFinalPolicy = () => {
      const policyYaml = renderPolicyYaml()

      setFinalPolicy(policyYaml)

      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Final Policy</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {finalPolicy}
          </pre>
          <Button onClick={handleApplyPolicy} className="bg-green-500 hover:bg-green-600 text-white">Apply Policy</Button>
        </div>
      )
    }

    return (
      <>
        {renderBackButton(() => {
          if (customPolicyStep > 0) {
            setCustomPolicyStep(customPolicyStep - 1)
            if (customPolicyStep === 1) {
              setSelectedActions([])
            }
          } else {
            setCreatePolicyOption('')
          }
        })}
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Create Custom Policy</h1>
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
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
        <p className="ml-4 text-xl">Applying policy and redirecting to Dashboard...</p>
      </div>
    )
  }

  if (!selectedContainer) return renderContainerList()
  if (!policyOption) return renderPolicyOptions()
  if (policyOption === 'check') return renderCheckPolicy()
  if (policyOption === 'logging') return renderLoggingOption()
  if (policyOption === 'create') {
    if (!createPolicyOption) return renderCreatePolicy()
    if (createPolicyOption === 'predefined') return renderPredefinedPolicies()
    if (createPolicyOption === 'custom') return renderCustomPolicy()
  }

  return null
}