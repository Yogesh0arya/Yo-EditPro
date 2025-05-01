// app/components/VideoUploader.jsx
"use client";

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { addVideo } from "../../../store/videoSlice";
import { Progress } from "../../../components/ui/progress";
import { Button } from "../../../components/ui/button";
import { Upload, X, Plus } from "lucide-react";

export default function VideoUploader({ onUpload }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const dispatch = useDispatch();
  const { videos } = useSelector((state) => state.video);

  const hasVideos = videos.length > 0;

  const processVideo = (file) => {
    setFileName(file.name);

    // Create a video thumbnail
    const reader = new FileReader();
    reader.onload = () => {
      const video = document.createElement("video");
      video.src = reader.result;
      video.addEventListener("loadeddata", () => {
        // Create a canvas to capture a frame
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailURL = canvas.toDataURL("image/jpeg");
        setFilePreview(thumbnailURL);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            // Create new video object
            const fileURL = URL.createObjectURL(file);
            const newVideo = {
              id: crypto.randomUUID(),
              url: fileURL,
              file: {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
              },
              thumbnail: thumbnailURL,
              duration: video.duration || 0,
            };

            dispatch(addVideo(newVideo));
            onUpload(newVideo);

            // Reset upload state for next file
            setUploadProgress(0);
            if (!hasVideos) {
              setFilePreview(null);
              setFileName(null);
            }
          }
        }, 100);
      });
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      processVideo(file);
    },
    [dispatch, onUpload, hasVideos]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
    },
    maxFiles: 1,
  });

  const handleCancelUpload = () => {
    setUploadProgress(0);
    setFilePreview(null);
    setFileName(null);
  };

  const handleAddMore = () => {
    setFilePreview(null);
    setFileName(null);
    setUploadProgress(0);
  };

  return (
    <div className="border-dashed border-2 border-gray-300 rounded-lg p-8 text-center">
      {!filePreview ? (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center h-64 cursor-pointer ${
            isDragActive ? "bg-blue-50" : "bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={48} className="text-gray-400 mb-4" />
          <p className="text-lg font-medium">
            {isDragActive
              ? "Drop the video file here"
              : hasVideos
              ? "Add another video to your project"
              : "Drag & drop a video file here, or click to select"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports MP4, MOV, AVI, WebM
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="relative flex-1">
              <img
                src={filePreview}
                alt="Video thumbnail"
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                onClick={handleCancelUpload}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="text-left">
            <p className="font-medium">{fileName}</p>
            <div className="flex items-center mt-2">
              <Progress value={uploadProgress} className="flex-1" />
              <span className="ml-2 text-sm">{uploadProgress}%</span>
            </div>
          </div>

          {hasVideos && uploadProgress === 100 && (
            <Button onClick={handleAddMore} variant="outline" className="mt-2">
              <Plus className="mr-1 h-4 w-4" />
              Add Another Video
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
