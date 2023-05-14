// reference: https://juejin.cn/post/6844903798750576647
// https://zhuanlan.zhihu.com/p/63662433
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/sidebar";
import styles from "@/styles/layout.module.css";
import LeftColumn from "@/components/chat/left_column/left_column";
import ChatBoard from "@/components/chat/chat_board";
import UpperBar from "@/components/chat/upper_bar";

const Video = () => {
  const [list, setList] = useState<any>([]);
  const [session, setSession] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // 获取本地视频流
  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Failed to get local stream", error);
    }
  };

  useEffect(() => {
    getLocalStream();
  }, []);

  // 显示远程视频流
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  /*return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar type={"chat"} />
      </div>
      <div className={styles.column}>
        <UpperBar setRefresh={setRefresh} />
        <LeftColumn
          setSession={setSession}
          refresh={refresh}
          list={list}
          setList={setList}
        />
      </div>
      {session === null ? (
        <div></div>
      ) : (
        <div className={styles.content}>
          <ChatBoard session={session} setRefresh={setRefresh} />
          <div>
            <h2>Local</h2>
            <video ref={localVideoRef} autoPlay muted></video>
          </div>
          <div>
            <h2>Remote</h2>
            <video ref={remoteVideoRef} autoPlay></video>
          </div>
        </div>
      )}
    </div>
  );
  */
  return (
    <div>
      <h2>Local Video</h2>
      <video ref={localVideoRef} autoPlay muted></video>
    </div>
  );
};

export default Video;
