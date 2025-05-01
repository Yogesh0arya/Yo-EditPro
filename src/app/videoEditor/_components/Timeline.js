// app/components/Timeline.jsx
"use client";

import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  setCurrentTime,
  removeVideo,
  reorderVideos,
  setActiveVideo,
  updateVideoTrim,
} from "../../../store/videoSlice";
import { Scissors, Move, Trash2, Video } from "lucide-react";

// Helper function to format time in MM:SS format
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// Timeline item
const TimelineItem = ({ video, index }) => {
  const dispatch = useDispatch();
  const { activeVideoId } = useSelector((state) => state.video);

  const handleDelete = () => {
    dispatch(removeVideo(video.id));
  };

  const handleSelectVideo = () => {
    dispatch(setActiveVideo(video.id));
  };

  return (
    <div
      onClick={handleSelectVideo}
      className={`relative flex-shrink-0 w-32 h-20 rounded-md overflow-hidden border-2 ${
        activeVideoId === video.id ? "border-blue-500" : "border-transparent"
      } mr-2 cursor-pointer bg-white`}
    >
      {video.thumbnail && (
        <img
          src={video.thumbnail}
          alt={`Video ${index + 1}`}
          className="w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
        <span className="text-white font-medium">{index + 1}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 px-1 py-0.5">
        <span className="text-xs text-white truncate block">
          {video.file.name}
        </span>
      </div>

      <div className="absolute top-0 right-0 p-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="p-1 bg-red-500 rounded text-white hover:bg-red-600"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="absolute top-0 left-0 p-1">
        <div className="p-1 bg-gray-500 rounded text-white cursor-move">
          <Move size={12} />
        </div>
      </div>
    </div>
  );
};

export default function Timeline() {
  const dispatch = useDispatch();
  const { videos, totalDuration, currentTime } = useSelector(
    (state) => state.video
  );
  const [showTrimModal, setShowTrimModal] = useState(true);

  const moveVideo = useCallback(
    (fromIndex, toIndex) => {
      dispatch(reorderVideos({ fromIndex, toIndex }));
    },
    [dispatch]
  );

  const handleTimelineClick = (e) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = offsetX / rect.width;
    const newTime = percent * totalDuration;

    dispatch(setCurrentTime(newTime));
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.index !== destination.index) {
      moveVideo(source.index, destination.index);
    }
  };

  const markerPosition = totalDuration
    ? (currentTime / totalDuration) * 100
    : 0;

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="flex items-center mb-4">
        <h3 className="font-medium flex-1">Timeline</h3>
        <button className="flex items-center text-sm mr-2">
          <Scissors size={16} className="mr-1" />
          Split Video
        </button>
        <button className="flex items-center text-sm">
          <Video size={16} className="mr-1" />
          Add Video
        </button>
      </div>

      {/* Time markers */}
      <div className="mb-1 flex justify-between text-xs text-gray-500">
        <span>00:00</span>
        <span>{formatTime(totalDuration)}</span>
      </div>

      {/* Click area to seek */}
      <div
        className="h-2 bg-gray-300 rounded-full mb-4 relative cursor-pointer"
        onClick={handleTimelineClick}
      >
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ width: `${markerPosition}%` }}
        />
        <div
          className="absolute w-4 h-4 bg-blue-600 rounded-full top-1/2 transform -translate-y-1/2 -ml-2"
          style={{ left: `${markerPosition}%` }}
        />
      </div>

      {/* Video thumbnails */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="videos" direction="horizontal">
          {(provided) => (
            <div
              className="flex overflow-x-auto py-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {videos.length > 0 ? (
                videos.map((video, index) => (
                  <Draggable
                    key={video.id}
                    draggableId={video.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-opacity ${
                          snapshot.isDragging ? "opacity-50" : "opacity-100"
                        }`}
                      >
                        <TimelineItem video={video} index={index} />
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div className="w-full text-center py-8 text-gray-500">
                  No videos added yet. Upload videos to your project.
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
