import React, { useState, useRef, useEffect } from "react";

const AudioPlayer = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef(null);

  // Handle generating and playing audio
  const generateAudio = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Clear previous audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl("");
      }

      // Make request to the backend
      const response = await fetch(
        "https://bright-namely-ant.ngrok-free.app/generate-audio/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!data.success) {
        throw new Error(data.error || "Failed to generate audio");
      }

      // Convert base64 to blob
      const byteCharacters = atob(data.audio_data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: `audio/${data.format}` });

      // Create URL from blob
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Set the audio source
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
    } catch (err) {
      setError(err.message);
      console.error("Error generating audio:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle play button click
  const handlePlay = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handle pause button click
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle stop button click
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Update isPlaying state based on audio events
  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const handleAudioPlay = () => setIsPlaying(true);
      const handleAudioPause = () => setIsPlaying(false);
      const handleAudioEnded = () => setIsPlaying(false);

      audio.addEventListener("play", handleAudioPlay);
      audio.addEventListener("pause", handleAudioPause);
      audio.addEventListener("ended", handleAudioEnded);

      return () => {
        audio.removeEventListener("play", handleAudioPlay);
        audio.removeEventListener("pause", handleAudioPause);
        audio.removeEventListener("ended", handleAudioEnded);
      };
    }
  }, []);

  // Clean up URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Text to Speech Player</h1>

      <div className="mb-4">
        <textarea
          className="w-full p-3 border rounded-md resize-y"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech"
          rows={5}
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          onClick={generateAudio}
          disabled={isLoading || !text}
        >
          {isLoading ? "Generating..." : "Generate Audio"}
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
          onClick={handlePlay}
          disabled={isLoading || !audioUrl || isPlaying}
        >
          Play
        </button>

        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-yellow-300"
          onClick={handlePause}
          disabled={!isPlaying}
        >
          Pause
        </button>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
          onClick={handleStop}
          disabled={
            !audioUrl || (!isPlaying && audioRef.current?.currentTime === 0)
          }
        >
          Stop
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}

      <audio ref={audioRef} className="hidden" />

      {audioUrl && (
        <div className="p-4 border rounded-md bg-gray-50">
          <p className="font-semibold mb-2">Audio Controls:</p>
          <audio ref={audioRef} controls className="w-full">
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
