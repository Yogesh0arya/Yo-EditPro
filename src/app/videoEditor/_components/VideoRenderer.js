"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../components/ui/button";
import { Loader2, Download } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { toast } from "../../../components/ui/sonner";
import { Progress } from "../../../components/ui/progress";

export default function VideoRenderer() {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState(null);
  const [renderLog, setRenderLog] = useState([]);
  const [showLog, setShowLog] = useState(false);

  // Get all media from redux store
  const { videos, totalDuration } = useSelector((state) => state.video);
  const { subtitles } = useSelector((state) => state.overlays);
  const { images } = useSelector((state) => state.overlays);
  const { textOverlays } = useSelector((state) => state.overlays);
  const { backgroundMusic } = useSelector((state) => state.audio);

  // Add log entry
  const addLog = (message) => {
    console.log(message); // Also log to console for debugging
    setRenderLog((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  // Load FFmpeg on component mount
  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        const ffmpegInstance = new FFmpeg();

        ffmpegInstance.on("log", ({ message }) => {
          console.log(message);
          addLog(message);
        });

        ffmpegInstance.on("progress", ({ progress }) => {
          const percentage = Math.round(progress * 100);
          setProgress(percentage);
          if (percentage % 10 === 0) {
            // Only log every 10%
            addLog(`Rendering progress: ${percentage}%`);
          }
        });

        // Directly use the URLs without toBlobURL
        await ffmpegInstance.load({
          coreURL: `${baseURL}/ffmpeg-core.js`,
          wasmURL: `${baseURL}/ffmpeg-core.wasm`,
        });

        setFfmpeg(ffmpegInstance);
        setIsReady(true);
        addLog("FFmpeg loaded successfully");
      } catch (error) {
        console.error("Error loading FFmpeg:", error);
        addLog(`Error loading FFmpeg: ${error.message || "Unknown error"}`);
        toast.error("Failed to load FFmpeg. Please refresh and try again.");
      }
    };

    loadFFmpeg();
  }, []);

  // Helper function to safely get file listing
  const safeListFiles = async () => {
    try {
      const files = await ffmpeg.listDir("/");
      return Array.isArray(files) ? files : [];
    } catch (error) {
      addLog(`Error listing files: ${error?.message || "Unknown error"}`);
      return [];
    }
  };

  // Helper function to safely delete a file
  const safeDeleteFile = async (filename) => {
    try {
      await ffmpeg.deleteFile(filename);
      return true;
    } catch (error) {
      addLog(
        `Warning: Could not delete ${filename}: ${
          error?.message || "Unknown error"
        }`
      );
      return false;
    }
  };

  // Safe file writing with error handling
  const safeWriteFile = async (filename, data) => {
    try {
      await ffmpeg.writeFile(filename, data);
      return true;
    } catch (error) {
      addLog(
        `Error writing file ${filename}: ${error?.message || "Unknown error"}`
      );
      return false;
    }
  };

  // Render the final video
  const renderVideo = async () => {
    if (!ffmpeg || !isReady) {
      toast.error("FFmpeg is not ready yet. Please wait.");
      return;
    }

    if (videos.length === 0) {
      toast.error("No videos to render.");
      return;
    }

    try {
      setIsRendering(true);
      setOutputUrl(null);
      setProgress(0);
      setRenderLog([]);
      addLog("Starting new render job");

      // Clean up old files first
      const existingFiles = await safeListFiles();
      for (const file of existingFiles) {
        if (typeof file === "string" && file !== "." && file !== "..") {
          await safeDeleteFile(file);
        }
      }
      addLog("Cleaned up previous files");

      // Load all videos
      let allFilesLoaded = true;
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const fileName = `video${i}.mp4`;

        try {
          const videoData = await fetchFile(video.url);
          addLog(`Fetched video ${i + 1}: ${videoData.byteLength} bytes`);

          const success = await safeWriteFile(fileName, videoData);
          if (!success) {
            allFilesLoaded = false;
            addLog(`Failed to write video file ${fileName}`);
          } else {
            addLog(`Successfully wrote video ${i + 1} to memory`);
          }
        } catch (error) {
          allFilesLoaded = false;
          addLog(
            `Error fetching video ${i + 1}: ${
              error?.message || "Unknown error"
            }`
          );
        }

        setProgress((i / videos.length) * 30); // First 30% is for loading videos
      }

      if (!allFilesLoaded) {
        addLog(
          "WARNING: Some video files failed to load. Continuing with what we have."
        );
      }

      // Check loaded files
      const loadedFiles = await safeListFiles();
      addLog(
        `Files in memory: ${loadedFiles
          .filter((f) => typeof f === "string")
          .join(", ")}`
      );

      if (
        !loadedFiles.some((f) => typeof f === "string" && f.startsWith("video"))
      ) {
        throw new Error("No video files were loaded successfully");
      }

      // For testing, use a very basic approach - just copy first video
      addLog("Attempting basic video processing");

      // Create concat file if multiple videos
      let command = [];
      if (videos.length > 1) {
        let concatText = "";
        loadedFiles.forEach((file) => {
          if (typeof file === "string" && file.startsWith("video")) {
            concatText += `file '${file}'\n`;
          }
        });

        await safeWriteFile("concat.txt", concatText);
        addLog("Created concat file");

        command = [
          "-f",
          "concat",
          "-safe",
          "0",
          "-i",
          "concat.txt",
          "-c",
          "copy",
          "output.mp4",
        ];
      } else {
        // Simple copy for single video
        command = ["-i", "video0.mp4", "-c", "copy", "output.mp4"];
      }

      addLog(`Executing command: ffmpeg ${command.join(" ")}`);

      // Execute the command
      try {
        await ffmpeg.exec(command);
        addLog("FFmpeg command executed successfully");
      } catch (execError) {
        addLog(
          `FFmpeg execution error: ${execError?.message || "Unknown error"}`
        );
        throw new Error("FFmpeg execution failed");
      }

      // Verify output file exists
      const filesAfter = await safeListFiles();
      addLog(
        `Files after rendering: ${filesAfter
          .filter((f) => typeof f === "string")
          .join(", ")}`
      );

      if (!filesAfter.some((f) => f === "output.mp4")) {
        throw new Error("Output file was not created");
      }

      // Read the output file
      addLog("Reading output file");
      try {
        const outputData = await ffmpeg.readFile("output.mp4");

        if (
          !outputData ||
          !outputData.buffer ||
          outputData.buffer.byteLength === 0
        ) {
          throw new Error("Output file is empty");
        }

        addLog(`Output file size: ${outputData.buffer.byteLength} bytes`);

        // Create the blob URL for download
        const blob = new Blob([outputData.buffer], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        setOutputUrl(url);

        addLog("Video rendering completed successfully");
        setProgress(100);
        toast.success("Your video has been rendered successfully!");
      } catch (readError) {
        addLog(
          `Error reading output file: ${readError?.message || "Unknown error"}`
        );
        throw new Error("Failed to read output file");
      }
    } catch (error) {
      console.error("Error during rendering:", error);
      addLog(`Fatal error: ${error?.message || "Unknown error"}`);
      toast.error(`Rendering failed: ${error?.message || "Unknown error"}`);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Render Video</h2>
        <p className="text-sm text-gray-600 mb-4">
          Combine all videos, audio, images, and text overlays into a final
          video file.
        </p>

        {isRendering ? (
          <>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              {Math.round(progress)}% - Rendering your video...
            </p>
            <Button disabled className="w-full mb-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Rendering in progress...
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={renderVideo}
              className="w-full mb-2"
              disabled={!isReady || videos.length === 0}
            >
              {!isReady ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading FFmpeg...
                </>
              ) : (
                "Render Video"
              )}
            </Button>

            {outputUrl && (
              <div className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <a href={outputUrl} download="rendered-video.mp4">
                    <Download className="mr-2 h-4 w-4" />
                    Download Rendered Video
                  </a>
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Render log */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Render Log</h3>
          <button
            onClick={() => setShowLog(!showLog)}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            {showLog ? "Hide Log" : "Show Log"}
          </button>
        </div>

        {showLog && (
          <div className="bg-gray-900 text-gray-200 p-2 rounded text-xs font-mono h-48 overflow-y-auto">
            {renderLog.length === 0 ? (
              <p className="text-gray-400">No rendering activity yet</p>
            ) : (
              renderLog.map((log, i) => (
                <div key={i} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
