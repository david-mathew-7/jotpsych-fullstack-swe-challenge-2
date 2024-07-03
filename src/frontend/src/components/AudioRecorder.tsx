import React, { useState, useEffect } from 'react';
import APIService from '../services/APIService';

interface AudioRecorderProps {
  onMottoChange: (newMotto: string) => void;
}

function AudioRecorder({ onMottoChange }: AudioRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (recording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const recorder = new MediaRecorder(stream);
          recorder.start();
          setMediaRecorder(recorder);

          const audioChunks: Blob[] = [];
          recorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };

          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            setAudioBlob(audioBlob);
          };
        })
        .catch(error => console.error('Error recording audio:', error));
    }
  }, [recording]);

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleUploadAudio = () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      console.log(...formData.entries()); // Log FormData contents

      const apiService = APIService;
      apiService.request('/upload', 'POST', formData, true, true)
        .then(response => {
          onMottoChange(response.motto);
        })
        .catch(error => console.error('Error uploading audio:', error));
    }
  };

  return (
    <div>
      {recording ? (
        <button onClick={handleStopRecording}>Stop Recording</button>
      ) : (
        <button onClick={() => setRecording(true)}>Record (New) Motto</button>
      )}
      {audioBlob && (
        <button onClick={handleUploadAudio}>Upload Audio</button>
      )}
    </div>
  );
};

export default AudioRecorder;
