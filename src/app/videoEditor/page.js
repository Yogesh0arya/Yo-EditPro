// "use client";

// import { useState } from "react";
// import { Provider } from "react-redux";
// import { store } from "../../store/store";
// import VideoUploader from "./_components/VideoUploader";
// import Timeline from "./_components/Timeline";
// import Preview from "./_components/Preview";
// import AudioManager from "./_components/AudioManager";
// import SubtitleEditor from "./_components/SubtitleEditor";
// import ImageOverlay from "./_components/ImageOverlay";
// import VideoRenderer from "./_components/VideoRenderer"; // Import the new component
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";
// import { Button } from "../../components/ui/button";
// import { Video, Plus } from "lucide-react";
// import { toast } from "../../components/ui/sonner";
// import { useSelector } from "react-redux";

// // Separate component for the editor to access Redux state
// function VideoEditorContent() {
//   const [showUploader, setShowUploader] = useState(false);

//   const { videos } = useSelector((state) => state.video);
//   const hasVideos = videos.length > 0;

//   const handleVideoUpload = (file) => {
//     // Hide uploader after video is added
//     setShowUploader(false);
//     // toast({
//     //   title: "Video added successfully",
//     //   description: `File: ${file.file.name}`,
//     // });
//   };

//   const handleAddMoreVideos = () => {
//     setShowUploader(true);
//   };

//   return (
//     <main className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Video Editor</h1>

//       {!hasVideos || showUploader ? (
//         <VideoUploader onUpload={handleVideoUpload} />
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <div className="lg:col-span-2">
//             <Preview />
//             <div className="mt-4">
//               <Timeline />
//             </div>
//             <div className="mt-2 flex justify-end">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleAddMoreVideos}
//                 className="flex items-center"
//               >
//                 <Plus size={16} className="mr-1" />
//                 Add More Videos
//               </Button>
//             </div>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-lg">
//             <Tabs defaultValue="audio">
//               <TabsList className="w-full">
//                 <TabsTrigger value="audio" className="flex-1">
//                   Audio
//                 </TabsTrigger>
//                 <TabsTrigger value="subtitles" className="flex-1">
//                   Subtitles
//                 </TabsTrigger>
//                 <TabsTrigger value="images" className="flex-1">
//                   Images
//                 </TabsTrigger>
//                 <TabsTrigger value="render" className="flex-1">
//                   Render
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="audio">
//                 <AudioManager />
//               </TabsContent>

//               <TabsContent value="subtitles">
//                 <SubtitleEditor />
//               </TabsContent>

//               <TabsContent value="images">
//                 <ImageOverlay />
//               </TabsContent>

//               <TabsContent value="render">
//                 <VideoRenderer />
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

// export default function VideoEditor() {
//   return (
//     <Provider store={store}>
//       <VideoEditorContent />
//     </Provider>
//   );
// }

// app/page.js
"use client";

import { useState, useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import VideoUploader from "./_components/VideoUploader";
import Timeline from "./_components/Timeline";
import Preview from "./_components/Preview";
import AudioManager from "./_components/AudioManager";
import SubtitleEditor from "./_components/SubtitleEditor";
import ImageOverlay from "./_components/ImageOverlay";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Loader2, Video, Plus } from "lucide-react";
import { toast } from "../../components/ui/sonner";
import { useSelector } from "react-redux";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Separate component for the editor to access Redux state
function VideoEditorContent() {
  const [isRendering, setIsRendering] = useState(false);
  const [isExportReady, setIsExportReady] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const ffmpegRef = useRef(null);

  // Initialize FFmpeg
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure we're in the browser
      const loadFfmpeg = async () => {
        const ffmpeg = new FFmpeg();
        ffmpeg.on("log", ({ message }) => {
          console.log("[ffmpeg]", message);
        });

        ffmpegRef.current = ffmpeg;

        ffmpeg.on("log", ({ message }) => {
          console.log(message);
        });

        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript"
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
          ),
        });

        setFfmpegLoaded(true);
      };

      loadFfmpeg();
    }
  }, []);

  const { videos } = useSelector((state) => state.video);
  const { subtitles, images } = useSelector((state) => state.overlays);
  const { backgroundMusic } = useSelector((state) => state.audio);
  const hasVideos = videos.length > 0;

  const loadFFmpeg = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  };

  const handleVideoUpload = (file) => {
    setShowUploader(false);
  };

  const handleAddMoreVideos = () => {
    setShowUploader(true);
  };

  const handleRender = async () => {
    if (!ffmpegLoaded) {
      // toast.error("FFmpeg is still loading. Please wait.");
      return;
    }

    setIsRendering(true);

    try {
      const ffmpeg = ffmpegRef.current;

      // Generate filter complex command
      let inputArgs = [];
      let filterComplex = [];
      let inputCount = 0;
      let outputMap = [];
      let currentVideoLabel = "vid";
      let mapArgs = [];

      // 1. Prepare input files
      // const videoResponse = await fetch(videos[0].url);
      // const videoBlob = await videoResponse.blob();
      // await ffmpeg.writeFile("input.mp4", await fetchFile(videoBlob));

      // // Base video input
      // filterComplex.push(`[0:v] scale=1920:1080 [vid]`);
      // inputArgs.push("-i", "input.mp4");
      // inputCount++;

      for (let i = 0; i < videos.length; i++) {
        const response = await fetch(videos[i].url);
        const blob = await response.blob();
        await ffmpeg.writeFile(`input${i}.mp4`, await fetchFile(blob));
      }
      for (let i = 0; i < videos.length; i++) {
        await ffmpeg.exec([
          "-i",
          `input${i}.mp4`,
          "-c",
          "copy",
          "-bsf:v",
          "h264_mp4toannexb",
          "-f",
          "mpegts",
          `intermediate${i}.ts`,
        ]);
      }
      const concatInputs = videos
        .map((_, i) => `intermediate${i}.ts`)
        .join("|");

      await ffmpeg.exec([
        "-i",
        `concat:${concatInputs}`,
        "-c",
        "copy",
        "-bsf:a",
        "aac_adtstoasc",
        "merged.mp4",
      ]);
      inputArgs.push("-i", "merged.mp4");
      filterComplex.push(`[0:v] scale=1920:1080 [vid]`);
      inputCount++;

      // REFERENCE
      // filterComplex.push(`[0:v] scale=200:200 [vid]`);
      // filterComplex.push(`[1:v] scale=200:200 [img]`);
      // filterComplex.push(`[vid][img] overlay=W-w-10:H-h-10`);

      // 2. Image files
      for (let i = 0; i < images.length; i++) {
        const imgResponse = await fetch(images[i].imageURL);
        await ffmpeg.writeFile(
          `image${i}.png`,
          await fetchFile(await imgResponse.blob())
        );
      }

      // Image
      images.forEach((img, i) => {
        const { bottom = "50", right = "20" } = img.position || {};
        const { width = "200", height = "200" } = img.size || {};
        const opacity = img.style?.opacity || 1;

        const imageLabel = `img${i}`;
        const outLabel = `vout${i}`;

        filterComplex.push(
          `[${inputCount}:v] scale=${width}:${height},format=rgba,colorchannelmixer=aa=${opacity}[${imageLabel}]`
        );
        filterComplex.push(
          `[${currentVideoLabel}][${imageLabel}]overlay=W-w-${right}:H-h-${bottom}:enable='between(t\\,${img.startTime}\\,${img.endTime})'[${outLabel}]`
        );
        currentVideoLabel = outLabel;
        inputArgs.push("-i", `image${i}.png`);
        inputCount++;
      });

      // 3. Subtitle files
      const subtitle = [
        { text: "Hello, world!", start: 0, end: 3 },
        { text: "This is a test subtitle.", start: 4, end: 7 },
      ];
      if (subtitle.length > 0) {
        const fontResponse = await fetch("/fonts/OpenSans-Regular.ttf");
        console.log(fontResponse);
        await ffmpeg.writeFile(
          "OpenSans-Regular.ttf",
          await fetchFile(await fontResponse.blob())
        );

        subtitles.forEach((sub, i) => {
          const { text, startTime, endTime, style } = sub;
          const fontSize =
            parseInt(style.fontSize?.replace("px", "").trim()) || 24;
          const fontColor = style.color?.startsWith("#")
            ? `0x${style.color.slice(1)}`
            : style.color || "black";

          // Escape single quotes in subtitle text
          const escapedText = text.replace(/'/g, "\\'");

          const drawTextFilter = `drawtext=fontfile=OpenSans-Regular.ttf:text='${escapedText}':fontsize=${fontSize}:fontcolor=${fontColor}:x=(w-text_w)/2:y=h-100:enable='between(t\\,${startTime}\\,${endTime})'`;

          const label = `subtitled${i}`;
          filterComplex.push(
            `[${currentVideoLabel}]${drawTextFilter}[${label}]`
          );
          currentVideoLabel = label; // Chain the output to next one
        });
      }

      // 4. Background audio
      if (backgroundMusic?.source) {
        const audioResponse = await fetch(backgroundMusic.source);
        await ffmpeg.writeFile(
          "audio.mp3",
          await fetchFile(await audioResponse.blob())
        );
        inputArgs.push("-i", "audio.mp3");

        // Audio processing

        filterComplex.push(
          `[0:a][${inputCount}:a]amix=inputs=2:duration=first:dropout_transition=3[mixed]`
        );
        mapArgs.push("-map", `[${currentVideoLabel}]`, "-map", "[mixed]");
      } else {
        // Map original video + audio only
        mapArgs.push("-map", `[${currentVideoLabel}]`, "-map", "0:a?");
      }

      // 2. Process video (simplified example)
      await ffmpeg.exec([
        ...inputArgs,
        "-filter_complex",
        filterComplex.join(";"),

        ...mapArgs,
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "23",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-movflags",
        "+faststart",
        "-y",
        "output.mp4",
      ]);

      // 3. Get output
      const data = await ffmpeg.readFile("output.mp4");

      // 4. Create download link
      const blob = new Blob([data], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited-video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsRendering(false);
      setIsExportReady(true);
      // toast.success("Video rendered successfully!");
    } catch (error) {
      console.error("Error:", error);
      setIsRendering(false);
      // toast.error("Failed to render video");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds - Math.floor(seconds)) * 1000);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  };

  const handleExport = () => {
    // In a real app, this would trigger the download of the processed video
    console.log("Exporting video...");
    // toast({
    //   title: "Video exported",
    //   description: "Download started",
    // });
  };

  return (
    <main className="container mx-auto p-4 pt-24">
      <h1 className="text-3xl font-bold mb-6">Video Editor</h1>

      {!hasVideos || showUploader ? (
        <VideoUploader onUpload={handleVideoUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Preview />
            <div className="mt-4">
              <Timeline />
            </div>
            <div className="mt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddMoreVideos}
                className="flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add More Videos
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <Tabs defaultValue="audio">
              <TabsList className="w-full">
                <TabsTrigger value="audio" className="flex-1">
                  Audio
                </TabsTrigger>
                <TabsTrigger value="subtitles" className="flex-1">
                  Subtitles
                </TabsTrigger>
                <TabsTrigger value="images" className="flex-1">
                  Images
                </TabsTrigger>
              </TabsList>

              <TabsContent value="audio">
                <AudioManager />
              </TabsContent>

              <TabsContent value="subtitles">
                <SubtitleEditor />
              </TabsContent>

              <TabsContent value="images">
                <ImageOverlay />
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex space-x-4">
              {isRendering ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rendering...
                </Button>
              ) : (
                <Button onClick={handleRender} className="w-full">
                  Render Video
                </Button>
              )}

              {/* {isExportReady && (
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full"
                >
                  Export & Download
                </Button>
              )} */}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function VideoEditor() {
  return (
    <Provider store={store}>
      <VideoEditorContent />
    </Provider>
  );
}
