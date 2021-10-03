import React, { useEffect, useState } from "react";
import Head from "next/head";
import electron from "electron";

function Home() {
  const ipcRenderer = electron.ipcRenderer;
  const [cpuUsage, setCpuUsage] = useState(0);
  const [freeMemoryPercentage, setFreeMemoryPercentage] = useState(0);
  const [systemMemory, setSystemMemory] = useState(0);
  const [version, setVersion] = useState("");
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const update = () => {
    ipcRenderer.send("update");
  };
  useEffect(() => {
    ipcRenderer.on("cpuUsage", (e, data) => {
      setCpuUsage(data);
    });
    ipcRenderer.on("freeMemoryPercentage", (e, data) => {
      setFreeMemoryPercentage(data);
    });
    ipcRenderer.on("systemMemory", (e, data) => {
      setSystemMemory(data);
    });
    ipcRenderer.on("version", (e, data) => {
      setVersion(data);
    });
    ipcRenderer.on("updateDownloaded", (e, data) => {
      console.log(data);
      setUpdateDownloaded(true);
    });
  }, [ipcRenderer]);
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <p>version: {version}</p>
      <p>CPU Usage: {cpuUsage.toFixed(2)}</p>
      <p>System Memory: {systemMemory.toFixed(2)} GB</p>
      <p>Free Memory: {freeMemoryPercentage.toFixed(2)} %</p>
      <p>
        {updateDownloaded && (
          <>
            <button
              onClick={() => {
                update();
              }}
            >
              Update
            </button>
          </>
        )}
      </p>
    </>
  );
}

export default Home;
