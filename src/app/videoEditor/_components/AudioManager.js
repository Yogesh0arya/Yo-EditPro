// app/components/AudioManager.jsx
"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addAudioTrack,
  removeAudioTrack,
  updateAudioTrack,
  setBackgroundMusic,
} from "../../../store/audioSlice";
import { Button } from "../../../components/ui/button";
import { Slider } from "../../../components/ui/slider";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Music, Volume2, Upload, Trash2 } from "lucide-react";

export default function AudioManager() {
  const dispatch = useDispatch();
  const { audioTracks, backgroundMusic } = useSelector((state) => state.audio);
  const { currentTime, totalDuration } = useSelector((state) => state.video);

  const [bgMusicName, setBgMusicName] = useState("");
  const [bgMusicVolume, setBgMusicVolume] = useState(70);

  const handleAddBackgroundMusic = (e) => {
    // In a real app, we would handle the actual file upload
    // For now, we'll just simulate it
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBgMusicName(file.name);

      dispatch(
        setBackgroundMusic({
          name: file.name,
          source: URL.createObjectURL(file),
          volume: bgMusicVolume / 100,
        })
      );
    }
  };

  const handleUpdateBgMusicVolume = (value) => {
    setBgMusicVolume(value[0]);

    if (backgroundMusic) {
      dispatch(
        setBackgroundMusic({
          ...backgroundMusic,
          volume: value[0] / 100,
        })
      );
    }
  };

  const handleRemoveBgMusic = () => {
    dispatch(setBackgroundMusic(null));
    setBgMusicName("");
  };

  // Format time in MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Mock waveform render
  // const renderWaveform = () => {
  //   return (
  //     <div className="h-12 bg-gray-100 rounded-md overflow-hidden flex items-center">
  //       {/* This is just a mock waveform visualization */}
  //       {Array.from({ length: 40 }).map((_, i) => {
  //         const height = Math.random() * 100;
  //         const isActive = (i / 40) * duration < currentTime;

  //         return (
  //           <div
  //             key={i}
  //             className={`w-1 mx-px ${
  //               isActive ? "bg-blue-500" : "bg-gray-300"
  //             }`}
  //             style={{
  //               height: `${Math.max(
  //                 1,
  //                 Math.min(12, Math.floor(height / 8)) * 4
  //               )}px`,
  //             }}
  //           />
  //         );
  //       })}
  //     </div>
  //   );
  // };

  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center">
        <Music size={16} className="mr-2" />
        Audio Management
      </h3>

      {/* Original Audio Track */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Original Audio</Label>
          <div className="flex items-center">
            <Volume2 size={16} className="mr-1" />
            <Slider defaultValue={[80]} max={100} step={1} className="w-24" />
          </div>
        </div>
        {/* {renderWaveform()} */}
      </div>

      {/* Background Music */}
      <div className="mt-4">
        <Label>Background Music</Label>

        {!backgroundMusic ? (
          <div className="mt-2">
            <Label
              htmlFor="bg-music-upload"
              className="flex items-center justify-center h-16 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500"
            >
              <div className="flex flex-col items-center">
                <Upload size={20} className="text-gray-500" />
                <span className="text-sm text-gray-500 mt-1">
                  Upload Music File
                </span>
              </div>
            </Label>
            <Input
              id="bg-music-upload"
              type="file"
              accept="audio/*"
              onChange={handleAddBackgroundMusic}
              className="hidden"
            />
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm truncate max-w-xs">
                {backgroundMusic.name}
              </span>
              <button
                onClick={handleRemoveBgMusic}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-center">
              <Volume2 size={16} className="mr-2" />
              <Slider
                value={[bgMusicVolume]}
                onValueChange={handleUpdateBgMusicVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="ml-2 text-sm w-8 text-right">
                {bgMusicVolume}%
              </span>
            </div>

            {/* Mock waveform for background music */}
            <div className="h-8 bg-gray-100 rounded-md overflow-hidden flex items-center">
              {Array.from({ length: 30 }).map((_, i) => {
                const height = Math.sin(i * 0.5) * 50 + 50;
                return (
                  <div
                    key={i}
                    className={`w-1 mx-px bg-green-400`}
                    style={{ height: `${height * (bgMusicVolume / 100)}%` }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Timing Controls */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Current Time</Label>
          <div className="mt-1 text-sm font-medium">
            {formatTime(currentTime)}
          </div>
        </div>

        <div>
          <Label className="text-xs">Duration</Label>
          <div className="mt-1 text-sm font-medium">
            {formatTime(totalDuration)}
          </div>
        </div>
      </div>
    </div>
  );
}
