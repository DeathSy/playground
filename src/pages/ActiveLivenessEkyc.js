import { useEffect, useRef, useState } from "react";

const millisecond = 1000;

// TODO: implement ekyc service
const ekycService = async (clientVdo, ekycCheckType) => {
  console.log(clientVdo);
  return false;
};

const generateEkycCheckType = () => {
  return ["nod", "right-blink"];
};

const initialMediaDevice = async () => {
  return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
};

const useRecorder = (videoRef) => {
  const deviceRef = useRef();
  const recorder = useRef();
  const recordedBlob = useRef([]);
  const [recordedVideo, setRecordedVideo] = useState();

  useEffect(() => {
    initialMediaDevice().then((stream) => {
      deviceRef.current = stream;
      videoRef.current.srcObject = stream;
    });
  }, [videoRef]);

  const startRecorder = () => {
    recorder.current = new MediaRecorder(deviceRef.current, {
      mimeType: "video/webm",
    });

    recorder.current.addEventListener("start", (e) => {
      console.log("record started");
    });

    recorder.current.addEventListener("dataavailable", (e) => {
      recordedBlob.current.push(e.data);
      console.log("generating video record");
    });

    recorder.current.addEventListener("stop", () => {
      const recordedVideo = URL.createObjectURL(
        new Blob(recordedBlob.current, { type: "video/webm" })
      );
      recordedBlob.current = [];
      setRecordedVideo(recordedVideo);
      console.log("record ended");
    });

    recorder.current.start();
  };

  const stopRecorder = () => {
    if (recorder.current) recorder.current.stop();
  };

  return [recordedVideo, { startRecorder, stopRecorder }];
};

export const ActiveLivenessEkyc = () => {
  const videoRef = useRef();
  const [ekycCheckType,] = useState(generateEkycCheckType());

  const [recordedVideo, { startRecorder, stopRecorder }] =
    useRecorder(videoRef);

  useEffect(() => {
    const interval = setInterval(() => {
      stopRecorder();
      ekycService(recordedVideo, ekycCheckType).then(() => {});
      startRecorder();
    }, 5 * millisecond);

    return () => {
      clearInterval(interval);
    };
  }, [recordedVideo, startRecorder, stopRecorder, ekycCheckType]);

  return (
    <>
      <div className="w-screen max-w-full py-10 flex justify-center">
        <div className="rounded-mask">
          <video
            className="w-auto h-auto min-w-full min-h-full bg-black"
            style={{
              transform: "scaleX(-1)",
            }}
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />
        </div>
      </div>
      <h1 className="text-5xl font-bold text-center">{ekycCheckType[0]}</h1>
    </>
  );
};
