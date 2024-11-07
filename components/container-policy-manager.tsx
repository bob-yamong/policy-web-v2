"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ContainersContent } from "./containers-content";
import { Dashboard } from "./dashboard";
import { LoginPage } from "./login-page";
import { PolicyContent } from "./policy-content";
import { SettingsContent } from "./settings-content";
import { Sidebar } from "./sidebar";

export const BASE_URL = "http://113.198.229.153:4001/api/v1"; //나중에 환경변수로 빼자
export const SERVER_NUMBER = 13;

export interface ContainerType {
  cgroup_id: number;
  created_at: string;
  host_server: number;
  id: number;
  mnt_id: number;
  name: string;
  pid_id: number;
  remove_at: string;
  req_time: string;
  runtime: "docker" | "runc" | "cri-o";
  tag: any[];
}

type actvieTabType = "dashboard"|"policy"|"containers"|"settings"


export const ContainerPolicyManagerComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<actvieTabType>("dashboard");
  const [containerList, setContainerList] = useState<ContainerType[]>([]);

  useEffect(() => {
    if(isLoggedIn){
      axios
      .get(`${BASE_URL}/container/${SERVER_NUMBER}`)
      .then((res) => {
        setContainerList(res.data.containers);
      })
      .catch((err) => {console.log(err);window.alert("Login Failed")});
    }else{}
  }, [isLoggedIn]);

  const handleLogin = (username: string, password: string) => {
    // In a real application, you would validate the credentials here
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("dashboard");
  };

  const handleRedirect = (page: actvieTabType) => {
    setActiveTab(page);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={()=>setActiveTab('dashboard')}
        onLogout={handleLogout}
      />
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "dashboard" && (
          <Dashboard containerList={containerList} />
        )}
        {activeTab === "policy" && (
          <PolicyContent
            onRedirect={handleRedirect}
            containerList={containerList}
          />
        )}
        {activeTab === "containers" && (
          <ContainersContent containerList={containerList} />
        )}
        {activeTab === "settings" && <SettingsContent />}
      </div>
    </div>
  );
}
