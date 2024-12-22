import React, { useState, useRef } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";

interface AudioRecorderProps {
  onAudioUpload: (audioUrl: string, fileName: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioUpload }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mpeg" });
        const audioFile = new File([audioBlob], `recording_${Date.now()}.mp3`, {
          type: "audio/mpeg",
        });

        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          if (fileReader.result) {
            onAudioUpload(fileReader.result as string, audioFile.name);
          }
        };
        fileReader.readAsDataURL(audioFile);
        audioChunks.current = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="audio-recorder">
      {isRecording ? (
        <FaStop size={20} onClick={stopRecording} className="icon-button" />
      ) : (
        <FaMicrophone size={20} onClick={startRecording} className="recording-icon" />
      )}
    </div>
  );
};

export default AudioRecorder;
