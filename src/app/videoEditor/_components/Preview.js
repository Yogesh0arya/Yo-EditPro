// app/components/Preview.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactPlayer from "react-player";
import {
  setDuration,
  setCurrentTime,
  setIsPlaying,
  setActiveVideo,
  reorderVideos,
} from "../../../store/videoSlice";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Film,
  Image as ImageLucid,
  Music,
  Type,
} from "lucide-react";
import Image from "next/image";

export default function Preview() {
  const dispatch = useDispatch();
  const playerRef = useRef(null);
  const audioRef = useRef(null);
  const timelineRef = useRef(null);
  const { videos, activeVideoId, currentTime, isPlaying, totalDuration } =
    useSelector((state) => state.video);
  const { subtitles, images, textOverlays } = useSelector(
    (state) => state.overlays
  );
  const { audioTracks, backgroundMusic } = useSelector((state) => state.audio);
  // const audio = useSelector((state) => state.audio?.tracks) || [];

  // console.log(subtitles);

  // Find the active video
  const activeVideo = videos.find((video) => video.id === activeVideoId);
  const activeVideoURL = activeVideo?.url;

  // Track time within the current video
  const [internalVideoTime, setInternalVideoTime] = useState(0);
  // Track if timeline is being dragged
  const [isDragging, setIsDragging] = useState(false);

  // Calculate time offsets for the video sequence
  const videoTimeMap = [];
  let accumulatedTime = 0;

  videos.forEach((video) => {
    videoTimeMap.push({
      id: video.id,
      startTime: accumulatedTime,
      endTime: accumulatedTime + video.duration,
    });
    accumulatedTime += video.duration;
  });

  // Function to move videos in the sequence
  const moveVideo = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    // Create new order of video IDs
    const videoIds = videos.map((video) => video.id);
    const [movedItem] = videoIds.splice(fromIndex, 1);
    videoIds.splice(toIndex, 0, movedItem);

    // Dispatch reorder action
    dispatch(reorderVideos(videoIds));
  };

  // Find which video contains the current global time
  useEffect(() => {
    if (videos.length === 0) return;

    // Skip if user is dragging the timeline
    if (isDragging) return;

    // Find which video we should be playing based on the current time
    const currentVideoInfo = videoTimeMap.find(
      (v) => currentTime >= v.startTime && currentTime < v.endTime
    );

    if (currentVideoInfo && currentVideoInfo.id !== activeVideoId) {
      // Switch to the correct video
      dispatch(setActiveVideo(currentVideoInfo.id));
    }

    // Calculate time within the active video
    if (currentVideoInfo) {
      const videoInternalTime = currentTime - currentVideoInfo.startTime;
      setInternalVideoTime(videoInternalTime);

      // Update player time if needed
      if (
        playerRef.current &&
        Math.abs(playerRef.current.getCurrentTime() - videoInternalTime) > 0.5
      ) {
        playerRef.current.seekTo(videoInternalTime);
      }
    }
  }, [currentTime, videos, activeVideoId, dispatch, isDragging]);

  // Format time as mm:ss
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Timeline click handler
  const handleTimelineClick = (e) => {
    if (!timelineRef.current || totalDuration === 0) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * totalDuration;

    dispatch(setCurrentTime(newTime));
  };

  // Timeline drag handlers
  const handleTimelineDragStart = () => {
    setIsDragging(true);
    // Pause while dragging
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      dispatch(setIsPlaying(false));
    }
    return wasPlaying;
  };

  const handleTimelineDragEnd = (wasPlaying) => {
    setIsDragging(false);
    // Resume if was playing before drag
    if (wasPlaying) {
      dispatch(setIsPlaying(true));
    }
  };

  // Find active overlays for the current time
  const activeSubtitles = subtitles.filter(
    (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
  );

  const activeImages = images.filter(
    (img) =>
      !img.startTime ||
      !img.endTime ||
      (currentTime >= img.startTime && currentTime <= img.endTime)
  );

  const activeTextOverlays = textOverlays.filter(
    (overlay) =>
      !overlay.startTime ||
      !overlay.endTime ||
      (currentTime >= overlay.startTime && currentTime <= overlay.endTime)
  );

  const handleProgress = ({ playedSeconds }) => {
    if (!activeVideo || isDragging) return;

    // Find the current video's start time in the sequence
    const videoInfo = videoTimeMap.find((v) => v.id === activeVideo.id);
    if (!videoInfo) return;

    // Update global timeline position
    const globalTime = videoInfo.startTime + playedSeconds;
    dispatch(setCurrentTime(globalTime));
  };

  const handleDuration = (duration) => {
    if (!activeVideo) return;

    // Update this specific video's duration
    dispatch(setDuration({ id: activeVideo.id, duration }));
  };

  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleRewind = () => {
    const newTime = Math.max(currentTime - 5, 0);
    dispatch(setCurrentTime(newTime));
  };

  const handleForward = () => {
    const newTime = Math.min(currentTime + 5, totalDuration);
    dispatch(setCurrentTime(newTime));
  };

  // Handle video ended - go to next video
  const handleEnded = () => {
    if (!activeVideo) return;

    const currentIndex = videos.findIndex((v) => v.id === activeVideo.id);
    if (currentIndex < videos.length - 1) {
      // Switch to next video
      const nextVideo = videos[currentIndex + 1];
      dispatch(setActiveVideo(nextVideo.id));

      // Find start time of the next video
      const nextVideoInfo = videoTimeMap.find((v) => v.id === nextVideo.id);
      if (nextVideoInfo) {
        dispatch(setCurrentTime(nextVideoInfo.startTime));
      }
    } else {
      // End of all videos
      dispatch(setIsPlaying(false));
    }
  };

  if (videos.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
        <p className="text-gray-500">Upload a video to preview</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden flex flex-col">
      <div className="relative">
        {activeVideoURL ? (
          <ReactPlayer
            ref={playerRef}
            url={activeVideoURL}
            width="100%"
            height="auto"
            playing={isPlaying}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onEnded={handleEnded}
            progressInterval={100}
            className="aspect-video"
          />
        ) : (
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            <p className="text-gray-400">No active video selected</p>
          </div>
        )}

        {/* Audio Player */}
        {backgroundMusic && (
          <audio
            ref={audioRef}
            src={backgroundMusic.source}
            // onTimeUpdate={handleAudioProgress}
            // onDurationChange={handleAudioDuration}
            // onEnded={handleEnded}
            className="w-full h-5"
            preload="auto"
          />
        )}

        {/* Overlay container */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtitles */}
          {activeSubtitles.map((subtitle) => (
            <div
              key={subtitle.id}
              className="absolute bottom-16 left-0 right-0 text-center"
              style={{
                fontSize: subtitle.style?.fontSize || "24px",
                color: subtitle.style?.color || "white",
                textShadow: "1px 1px 2px black",
              }}
            >
              {subtitle.text}
            </div>
          ))}

          {/* Images */}
          {activeImages.map((image) => (
            <div
              key={image.id}
              className="absolute"
              style={{
                bottom: image.position?.bottom + "%" || "10%",
                right: image.position?.right + "%" || "10%",
                width: image.size?.width + "px" || "200px",
                height: image.size?.height + "px" || "200px",
                opacity: image.style?.opacity || 1,
              }}
            >
              <Image
                width={400}
                height={400}
                src={image.imageURL}
                alt="Overlay"
                className="w-full h-full object-contain"
                style={{
                  border: image.style?.border || "none",
                }}
              />
            </div>
          ))}

          {/* Text Overlays */}
          {activeTextOverlays.map((overlay) => (
            <div
              key={overlay.id}
              className="absolute"
              style={{
                top: overlay.position?.top || "20%",
                left: overlay.position?.left || "20%",
                fontSize: overlay.style?.fontSize || "32px",
                color: overlay.style?.color || "white",
                fontFamily: overlay.style?.fontFamily || "Arial",
                textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
              }}
            >
              {overlay.text}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-900 p-4">
        {/* Main controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRewind}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={handlePlayPause}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>

            <button
              onClick={handleForward}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </div>
        </div>

        {/* Timeline scrubber */}
        <div
          className="relative ml-16 h-6 bg-gray-800 rounded cursor-pointer mb-4"
          ref={timelineRef}
          onClick={handleTimelineClick}
          onMouseDown={(e) => {
            const wasPlaying = handleTimelineDragStart();

            const handleMouseMove = (e) => {
              handleTimelineClick(e);
            };

            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
              handleTimelineDragEnd(wasPlaying);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
          }}
        >
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30"
            style={{ left: `${(currentTime / totalDuration) * 100}%` }}
          >
            <div className="w-3 h-3 bg-red-500 rounded-full -ml-1 -mt-1"></div>
          </div>

          {/* Progress indicator */}
          <div
            className="absolute top-0 bottom-0 bg-gray-600 bg-opacity-30 z-0"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          ></div>
        </div>

        {/* Resource tracks */}
        <div className="space-y-2">
          {/* Video track */}
          <div className="flex items-center">
            <div className="w-16 text-white text-xs flex items-center">
              <Film size={14} className="mr-1" /> Videos
            </div>
            <div className="flex-1 h-6 bg-gray-800 rounded relative">
              {videoTimeMap.map((video, index) => {
                const startPercent = (video.startTime / totalDuration) * 100;
                const widthPercent =
                  ((video.endTime - video.startTime) / totalDuration) * 100;

                return (
                  <div
                    key={video.id}
                    className="absolute top-0 bottom-0 bg-blue-700 border-r border-blue-900"
                    style={{
                      left: `${startPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-white truncate">
                      Video {index + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audio track */}
          {backgroundMusic && (
            <div className="flex items-center">
              <div className="w-16 text-white text-xs flex items-center">
                <Music size={14} className="mr-1" /> Audio
              </div>
              <div className="flex-1 h-6 bg-gray-800 rounded relative">
                <div
                  className="absolute top-0 bottom-0 bg-green-700 border-r border-green-900"
                  style={{
                    left: `0%`,
                    width: `${totalDuration}%`,
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-white truncate">
                    {backgroundMusic.name || "Audio"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Images track */}
          {images.length > 0 && (
            <div className="flex items-center">
              <div className="w-16 text-white text-xs flex items-center">
                <ImageLucid size={14} className="mr-1" /> Images
              </div>
              <div className="flex-1 h-6 bg-gray-800 rounded relative">
                {images.map((img) => {
                  if (!img.startTime || !img.endTime) return null;

                  const startPercent = (img.startTime / totalDuration) * 100;
                  const widthPercent =
                    ((img.endTime - img.startTime) / totalDuration) * 100;

                  return (
                    <div
                      key={img.id}
                      className="absolute top-0 bottom-0 bg-purple-700 border-r border-purple-900"
                      style={{
                        left: `${startPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-white truncate">
                        Image
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Text overlays track */}
          {subtitles.length > 0 && (
            <div className="flex items-center">
              <div className="w-16 text-white text-xs flex items-center">
                <Type size={14} className="mr-1" /> Text
              </div>
              <div className="flex-1 h-6 bg-gray-800 rounded relative">
                {subtitles.map((text) => {
                  if (!text.startTime || !text.endTime) return null;

                  const startPercent = (text.startTime / totalDuration) * 100;
                  const widthPercent =
                    ((text.endTime - text.startTime) / totalDuration) * 100;

                  return (
                    <div
                      key={text.id}
                      className="absolute top-0 bottom-0 bg-yellow-700 border-r border-yellow-900"
                      style={{
                        left: `${startPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-white truncate">
                        {text.text.slice(0, 15)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
