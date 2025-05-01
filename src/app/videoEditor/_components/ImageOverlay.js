"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addImage,
  removeImage,
  updateImage,
} from "../../../store/overlaysSlice";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Slider } from "../../../components/ui/slider";
import { Image as ImageIcon, Upload, Trash2, Move } from "lucide-react";

export default function ImageOverlay() {
  const dispatch = useDispatch();
  const { images } = useSelector((state) => state.overlays);
  const { currentTime, totalDuration } = useSelector((state) => state.video);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageOpacity, setImageOpacity] = useState(100);
  const [imageBorderWidth, setImageBorderWidth] = useState(0);
  const [imageBorderColor, setImageBorderColor] = useState("#000000");
  // New state for position and size
  const [imagePosition, setImagePosition] = useState({
    bottom: "10",
    right: "10",
  });
  const [imageSize, setImageSize] = useState({ width: "200", height: "100" });
  // New state for timing
  const [imageStartTime, setImageStartTime] = useState(0);
  const [imageEndTime, setImageEndTime] = useState(5);

  // console.log(imagePosition, imageSize);
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageURL = URL.createObjectURL(file);

      const defaultStartTime = currentTime;
      const defaultEndTime = Math.min(currentTime + 5, totalDuration);

      const newImage = {
        id: crypto.randomUUID(),
        imageURL,
        name: file.name,
        position: imagePosition,
        size: imageSize,
        style: {
          opacity: imageOpacity / 100,
          border:
            imageBorderWidth > 0
              ? `${imageBorderWidth}px solid ${imageBorderColor}`
              : "none",
        },
        startTime: defaultStartTime,
        endTime: defaultEndTime,
      };

      dispatch(addImage(newImage));
      setSelectedImage(newImage.id);
      setImagePosition(newImage.position);
      setImageSize(newImage.size);
      setImageStartTime(defaultStartTime);
      setImageEndTime(defaultEndTime);
    }
  };

  const handleRemoveImage = (id) => {
    dispatch(removeImage(id));
    if (selectedImage === id) {
      setSelectedImage(null);
    }
  };

  const handleSelectImage = (id) => {
    setSelectedImage(id);

    // Load the current image settings
    const image = images.find((img) => img.id === id);
    if (image) {
      setImageOpacity(image.style?.opacity ? image.style.opacity * 100 : 100);

      // Parse border width if it exists
      if (image.style?.border && image.style.border !== "none") {
        const borderMatch = image.style.border.match(/^(\d+)px/);
        if (borderMatch) {
          setImageBorderWidth(parseInt(borderMatch[1]));
        }

        // Parse border color if it exists
        const colorMatch = image.style.border.match(/solid\s+([^;]+)$/);
        if (colorMatch) {
          setImageBorderColor(colorMatch[1]);
        }
      } else {
        setImageBorderWidth(0);
      }

      // Set position and size from selected image
      setImagePosition(image.position || { bottom: "10", right: "10" });
      setImageSize(image.size || { width: "200", height: "100" });

      // Set timing from selected image
      setImageStartTime(image.startTime || 0);
      setImageEndTime(image.endTime || totalDuration);
    }
  };

  const handleUpdateImageStyle = () => {
    if (!selectedImage) return;

    dispatch(
      updateImage({
        id: selectedImage,
        style: {
          opacity: imageOpacity / 100,
          border:
            imageBorderWidth > 0
              ? `${imageBorderWidth}px solid ${imageBorderColor}`
              : "none",
        },
        // Update position and size
        position: imagePosition,
        size: imageSize,
        // Update timing
        startTime: parseFloat(imageStartTime),
        endTime: parseFloat(imageEndTime),
      })
    );
  };

  const handlePositionChange = (property, value) => {
    setImagePosition((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const handleSizeChange = (property, value) => {
    setImageSize((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const parseTimeInput = (timeStr) => {
    // Allow decimal input directly
    if (!isNaN(parseFloat(timeStr))) {
      return parseFloat(timeStr);
    }

    // Try to parse MM:SS format
    const match = timeStr.match(/^(\d+):(\d{2})$/);
    if (match) {
      const mins = parseInt(match[1]);
      const secs = parseInt(match[2]);
      return mins * 60 + secs;
    }

    return 0;
  };

  const selectedImageData = selectedImage
    ? images.find((img) => img.id === selectedImage)
    : null;

  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center">
        <ImageIcon size={16} className="mr-2" />
        Image Overlays
      </h3>

      {/* Image Upload */}
      <div>
        <Label htmlFor="image-upload" className="block mb-2">
          Upload Image
        </Label>
        <div className="flex">
          <Label
            htmlFor="image-upload"
            className="flex items-center justify-center h-12 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 flex-1"
          >
            <div className="flex items-center">
              <Upload size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-500">Select Image File</span>
            </div>
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Current Images */}
      <div>
        <Label className="block mb-2">Current Images</Label>

        {images.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No images added yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {images.map((image) => (
              <div
                key={image.id}
                className={`relative border rounded-md overflow-hidden cursor-pointer ${
                  selectedImage === image.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleSelectImage(image.id)}
              >
                <img
                  src={image.imageURL}
                  alt={image.name || "Overlay image"}
                  className="w-full h-20 object-cover"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(image.id);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <Trash2 size={12} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                  <span className="text-white text-xs truncate block">
                    {image.name || "Image"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Settings */}
      {selectedImageData && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Image Settings</h4>

          <div className="space-y-3">
            <div>
              <Label className="text-xs">Opacity</Label>
              <div className="flex items-center mt-1">
                <Slider
                  value={[imageOpacity]}
                  onValueChange={(value) => setImageOpacity(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="ml-2 text-sm w-8 text-right">
                  {imageOpacity}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Border Width</Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={imageBorderWidth}
                  onChange={(e) =>
                    setImageBorderWidth(parseInt(e.target.value) || 0)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Border Color</Label>
                <div className="flex mt-1">
                  <Input
                    type="color"
                    value={imageBorderColor}
                    onChange={(e) => setImageBorderColor(e.target.value)}
                    className="w-10 p-1 mr-2"
                  />
                  <Input
                    type="text"
                    value={imageBorderColor}
                    onChange={(e) => setImageBorderColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* New Position Controls */}
            <div>
              <h5 className="text-xs font-medium mb-2">Position (px)</h5>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Bottom</Label>
                  <Input
                    type="number"
                    min="0"
                    value={imagePosition.bottom}
                    onChange={(e) =>
                      handlePositionChange("bottom", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Right</Label>
                  <Input
                    type="number"
                    min="0"
                    value={imagePosition.right}
                    onChange={(e) =>
                      handlePositionChange("right", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* New Size Controls */}
            <div>
              <h5 className="text-xs font-medium mb-2">Size (px)</h5>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    min="10"
                    value={imageSize.width}
                    onChange={(e) => handleSizeChange("width", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    min="10"
                    value={imageSize.height}
                    onChange={(e) => handleSizeChange("height", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Timing Controls */}
            <div>
              <h5 className="text-xs font-medium mb-2">Timing (seconds)</h5>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Start Time</Label>
                  <Input
                    type="number"
                    min="0"
                    max={totalDuration}
                    step="0.1"
                    value={imageStartTime}
                    onChange={(e) => setImageStartTime(e.target.value)}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-500">
                    {formatTime(imageStartTime)}
                  </span>
                </div>
                <div>
                  <Label className="text-xs">End Time</Label>
                  <Input
                    type="number"
                    min={imageStartTime}
                    max={totalDuration}
                    step="0.1"
                    value={imageEndTime}
                    onChange={(e) => setImageEndTime(e.target.value)}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-500">
                    {formatTime(imageEndTime)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button size="sm" onClick={handleUpdateImageStyle}>
                Apply Changes
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center">
              <Move size={16} className="mr-2" />
              <span className="text-sm">
                Use the controls above to position and resize the image
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              You can manually adjust the position and size values for precise
              placement
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
