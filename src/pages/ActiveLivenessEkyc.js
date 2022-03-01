import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

// machine learning stuff
import * as Blazeface from "@tensorflow-models/blazeface";
import * as tf from "@tensorflow/tfjs-core";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
);
tf.setBackend("wasm");
// end machine learning stuff

const millisecond = 1000;

// TODO: implement ekyc service
const ekycService = async (clientVdo, ekycCheckType) => {
  console.log(clientVdo);
  return true;
};

const generateEkycCheckType = () => {
  const type = ["blink", "mouth", "nod", "yaw"];
  return type;
};

const initialMediaDevice = async () => {
  return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
};

const getSupportedRecorderMimeType = () => {
  const mp4 = MediaRecorder.isTypeSupported("video/mp4");
  const webm = MediaRecorder.isTypeSupported("video/webm");

  if (webm) return "video/webm";

  if (mp4) return "video/mp4";
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
      mimeType: getSupportedRecorderMimeType(),
    });

    recorder.current.addEventListener("start", (e) => {
      console.log("record started");
      setStarted(true);
    });

    recorder.current.addEventListener("dataavailable", (e) => {
      recordedBlob.current.push(e.data);
      console.log("generating video record");
    });

    recorder.current.addEventListener("stop", () => {
      const recordedVideo = URL.createObjectURL(
        new Blob(recordedBlob.current, { type: recorder.current.mimeType })
      );
      recordedBlob.current = [];
      setRecordedVideo(recordedVideo);
      console.log("record ended");
      setStarted(false);
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

const useFaceDetector = (vdo) => {
  const [isReady, setReady] = useState(false);
  const [isFaceExists, setFaceExists] = useState(false);
  const faceModel = useRef();

  useEffect(() => {
    Blazeface.load().then((model) => {
      faceModel.current = model;
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (isReady) {
      setInterval(() => {
        faceModel.current.estimateFaces(vdo, false).then((prediction) => {
          setFaceExists(
            prediction.length ? prediction[0].probability > 0.95 : false
          );
        });
      }, 200);
    }
  }, [isReady, vdo]);

  return [{ isFaceExists }];
};

export const ActiveLivenessEkyc = () => {
  const videoRef = useRef();
  const [ekycCheckType, setEkycCheckType] = useState(generateEkycCheckType());
  const [retries, setRetries] = useState(0);

  const [{ recordedVideo, isReady }, { startRecorder, stopRecorder }] =
    useRecorder(videoRef);
  const [{ isFaceExists }] = useFaceDetector(videoRef.current);

  useEffect(() => {
    if (isReady && ekycCheckType.length) startRecorder();
  }, [startRecorder, ekycCheckType, isReady]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isReady) stopRecorder();

      ekycService(recordedVideo, ekycCheckType).then((status) => {
        /*
          TODO: check whether liveness passed

          if liveness passed -> go to next action
          if liveness not passed -> retry 3 times
          
          if failed more than 3 times make it failed
        */
        if (status)
          setEkycCheckType((prevType) =>
            prevType.filter((_, index) => index !== 0)
          );
        if (!status && retries <= 3) {
          setRetries((prevRetries) => prevRetries + 1);
          startRecorder();
        }
      });
    }, 5 * millisecond);

    return () => {
      clearInterval(interval);
    };
  }, [
    recordedVideo,
    stopRecorder,
    startRecorder,
    ekycCheckType,
    isReady,
    retries,
  ]);

  return (
    <>
      <div className="w-screen max-w-full py-10 flex justify-center">
        <div
          className={classNames(
            "rounded-mask",
            "border-solid",
            "border-4",
            isFaceExists ? "border-emerald-500" : "border-rose-500"
          )}
        >
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
