import { useEffect, useRef, useState } from "react";

const millisecond = 1000;

// TODO: implement ekyc service
const ekycService = async (clientVdo, ekycCheckType) => {
  return false;
};

const generateEkycCheckType = () => {
  const type = ["blink", "mouth", "nod", "yaw"];
  return type;
};

const initialMediaDevice = async () => {
  return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
};

const useRecorder = (videoRef) => {
  const deviceRef = useRef();
  const recorder = useRef();
  const recordedBlob = useRef([]);
  const [recordedVideo, setRecordedVideo] = useState();
  const [isReady, setReady] = useState(false);
  const [isStarted, setStarted] = useState(false);

  useEffect(() => {
    initialMediaDevice().then((stream) => {
      deviceRef.current = stream;
      videoRef.current.srcObject = stream;
      setReady(true);
    });
  }, [videoRef]);

  const startRecorder = () => {
    recorder.current = new MediaRecorder(deviceRef.current, {
      mimeType: "video/webm",
    });

    recorder.current.addEventListener("start", (e) => {
      console.log("record started");
      setStarted(true)
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
      setStarted(false)
    });

    recorder.current.start();
  };

  const stopRecorder = () => {
    if (recorder.current && isStarted) recorder.current.stop();
  };

  return [
    { isReady, recordedVideo },
    { startRecorder, stopRecorder },
  ];
};

export const ActiveLivenessEkyc = () => {
  const videoRef = useRef();
  const [ekycCheckType, setEkycCheckType] = useState(generateEkycCheckType());

  const [{ recordedVideo, isReady }, { startRecorder, stopRecorder }] =
    useRecorder(videoRef);

  useEffect(() => {
    if (isReady && ekycCheckType.length) startRecorder();
  }, [startRecorder, ekycCheckType, isReady]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isReady) stopRecorder();

      ekycService(recordedVideo, ekycCheckType).then(() => {
        setEkycCheckType((prevType) =>
          prevType.filter((_, index) => index !== 0)
        );
      });
    }, 5 * millisecond);

    return () => {
      clearInterval(interval);
    };
  }, [recordedVideo, stopRecorder, ekycCheckType, isReady]);

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
