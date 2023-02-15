'use client';

import { FC, MouseEventHandler, useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import { AppClient } from './AppClient';

const Button: FC<{ label: string; onClick: MouseEventHandler }> = ({
  label,
  onClick,
}) => {
  return (
    <button
      className='rounded-lg border bg-white px-2 py-1 text-blue-800'
      onClick={onClick}>
      {label}
    </button>
  );
};

export default function WebCam() {
  const [isShowVideo, setIsShowVideo] = useState(false);
  const webcamRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const videoConstraints: MediaStreamConstraints['video'] = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };

  const handleDataAvailable = useCallback(
    ({ data }: any) => {
      if (data.size > 0) {
        setRecordedChunks(prev => prev.concat(data));
      }
    },
    [setRecordedChunks],
  );

  const handleStartCaptureClick = useCallback(() => {
    if (!mediaRecorderRef || !webcamRef || !webcamRef.current) {
      return;
    }

    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable,
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleDownload = useCallback(async () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      var headers = {
        accept: '*/*'
      };
      try {
        const formData = new FormData();
        formData.append('file', blob);

        const response = await fetch('http://localhost:5162/interviews', {
          mode: 'cors',
          method: 'POST',
          body: formData,
          headers,
        });
        console.log('SUCCESS', response.text());
        setRecordedChunks([]);
      } catch (error) {
        console.log(error);
      }

      //   const url = URL.createObjectURL(blob);
      //   const a = document.createElement('a');
      //   document.body.appendChild(a);
      //   a.className = 'hidden';
      //   a.href = url;
      //   a.download = 'react-webcam-stream-capture.webm';
      //   a.click();
      //   window.URL.revokeObjectURL(url);
    }
  }, [recordedChunks]);

  const onUserMedia = useCallback((stream: MediaStream) => {
    console.log(stream);
  }, []);

  const onUserMediaError = useCallback((error: string | DOMException) => {
    console.error(error);
  }, []);

  const startCam = useCallback(() => {
    setIsShowVideo(true);
  }, []);

  const stopCam = useCallback(() => {
    let stream = webcamRef?.current?.stream;

    if (!stream) {
      return;
    }

    console.log(stream);

    const tracks: Array<MediaStreamTrack> = stream.getTracks();
    tracks.forEach(track => track.stop());
    setIsShowVideo(false);
  }, []);

  return (
    <AppClient>
      <div className='rounded-lg bg-blue-900 py-2 px-4 text-white'>
        <div className='camView'>
          {isShowVideo && (
            <Webcam
              audio={true}
              ref={webcamRef}
              mirrored={true}
              imageSmoothing={true}
              videoConstraints={videoConstraints}
              onUserMedia={onUserMedia}
              onUserMediaError={onUserMediaError}
            />
          )}
        </div>
        <div className='mt-4 flex items-center gap-2'>
          <Button label='Start Video' onClick={startCam} />
          <Button label='Stop Video' onClick={stopCam} />
        </div>
        {capturing ? (
          <Button label='Stop Capture' onClick={handleStopCaptureClick} />
        ) : (
          <Button label='Start Capture' onClick={handleStartCaptureClick} />
        )}
        {recordedChunks.length > 0 && (
          <Button label='Download' onClick={handleDownload} />
        )}
        <input
          type='file'
          name='media-upload'
          title='file upload'
          className='hidden'
        />
      </div>
    </AppClient>
  );
}
