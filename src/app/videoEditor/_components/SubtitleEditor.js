// app/components/SubtitleEditor.jsx
"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addSubtitle,
  removeSubtitle,
  updateSubtitle,
} from "../../../store/overlaysSlice";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Trash2, Type, Clock, Edit } from "lucide-react";

export default function SubtitleEditor() {
  const dispatch = useDispatch();
  const { currentTime, totalDuration } = useSelector((state) => state.video);
  const { subtitles } = useSelector((state) => state.overlays);

  const [newSubtitleText, setNewSubtitleText] = useState("");
  const [fontColor, setFontColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState("24px");

  const [subtitleStartTime, setSubtitleStartTime] = useState(currentTime);
  const [subtitleEndTime, setSubtitleEndTime] = useState(currentTime + 5);

  // Track which subtitle is being edited (if any)
  const [editingSubtitleId, setEditingSubtitleId] = useState(null);
  const [editStartTime, setEditStartTime] = useState(0);
  const [editEndTime, setEditEndTime] = useState(0);

  const handleAddSubtitle = () => {
    if (!newSubtitleText.trim()) return;

    const newSubtitle = {
      id: crypto.randomUUID(),
      text: newSubtitleText,
      startTime: subtitleStartTime, // Fixed from imageStartTime
      endTime: Math.min(subtitleEndTime, totalDuration),
      style: {
        fontSize,
        color: fontColor,
      },
    };

    dispatch(addSubtitle(newSubtitle));
    setNewSubtitleText("");
  };

  const handleRemoveSubtitle = (id) => {
    dispatch(removeSubtitle(id));
    // If we're editing this subtitle, cancel editing
    if (editingSubtitleId === id) {
      setEditingSubtitleId(null);
    }
  };

  const handleUpdateSubtitleTime = (id, field, value) => {
    dispatch(updateSubtitle({ id, [field]: value }));
  };

  const handleUpdateSubtitleStyle = (id, styleField, value) => {
    const subtitle = subtitles.find((sub) => sub.id === id);
    if (!subtitle) return;

    dispatch(
      updateSubtitle({
        id,
        style: { ...subtitle.style, [styleField]: value },
      })
    );
  };

  // Begin editing subtitle times
  const startEditingTimes = (subtitle) => {
    setEditingSubtitleId(subtitle.id);
    setEditStartTime(subtitle.startTime);
    setEditEndTime(subtitle.endTime);
  };

  // Save edited subtitle times
  const saveEditedTimes = () => {
    if (!editingSubtitleId) return;

    // Ensure startTime is not greater than endTime
    const startTime = parseFloat(editStartTime);
    const endTime = parseFloat(editEndTime);

    if (startTime >= endTime) {
      alert("Start time must be before end time");
      return;
    }

    dispatch(
      updateSubtitle({
        id: editingSubtitleId,
        startTime,
        endTime,
      })
    );

    setEditingSubtitleId(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSubtitleId(null);
  };

  // Format time in MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center">
        <Type size={16} className="mr-2" />
        Subtitles & Text
      </h3>

      <div className="space-y-3">
        <div>
          <Label>New Subtitle Text</Label>
          <div className="flex mt-1">
            <Input
              value={newSubtitleText}
              onChange={(e) => setNewSubtitleText(e.target.value)}
              placeholder="Enter subtitle text"
              className="flex-1 mr-2"
            />
            <Button onClick={handleAddSubtitle}>Add</Button>
          </div>
        </div>

        {/* Add time controls for new subtitle */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Start Time (seconds)</Label>
            <Input
              type="number"
              min="0"
              max={totalDuration}
              step="0.1"
              value={subtitleStartTime}
              onChange={(e) => setSubtitleStartTime(parseFloat(e.target.value))}
              className="mt-1"
            />
            <span className="text-xs text-gray-500">
              {formatTime(subtitleStartTime)}
            </span>
          </div>
          <div>
            <Label>End Time (seconds)</Label>
            <Input
              type="number"
              min={subtitleStartTime}
              max={totalDuration}
              step="0.1"
              value={subtitleEndTime}
              onChange={(e) => setSubtitleEndTime(parseFloat(e.target.value))}
              className="mt-1"
            />
            <span className="text-xs text-gray-500">
              {formatTime(subtitleEndTime)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Font Color</Label>
            <div className="flex mt-1">
              <Input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="w-10 p-1 mr-2"
              />
              <Input
                type="text"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label>Font Size</Label>
            <Input
              type="text"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Current Subtitles</h4>

        {subtitles.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No subtitles added yet</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {subtitles.map((subtitle) => (
              <div key={subtitle.id} className="border rounded-md p-3">
                <div className="flex justify-between">
                  <p
                    className="font-medium"
                    style={{
                      color: subtitle.style?.color || "inherit",
                      fontSize: subtitle.style?.fontSize
                        ? `calc(${subtitle.style.fontSize} * 0.5)`
                        : "inherit",
                    }}
                  >
                    {subtitle.text}
                  </p>

                  <div className="flex space-x-2">
                    {editingSubtitleId !== subtitle.id && (
                      <button
                        onClick={() => startEditingTimes(subtitle)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveSubtitle(subtitle.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {editingSubtitleId === subtitle.id ? (
                  <div className="mt-2">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <Label className="text-xs">Start Time (seconds)</Label>
                        <Input
                          type="number"
                          min="0"
                          max={totalDuration}
                          step="0.1"
                          value={editStartTime}
                          onChange={(e) => setEditStartTime(e.target.value)}
                          className="mt-1"
                        />
                        <span className="text-xs text-gray-500">
                          {formatTime(editStartTime)}
                        </span>
                      </div>
                      <div>
                        <Label className="text-xs">End Time (seconds)</Label>
                        <Input
                          type="number"
                          min={editStartTime}
                          max={totalDuration}
                          step="0.1"
                          value={editEndTime}
                          onChange={(e) => setEditEndTime(e.target.value)}
                          className="mt-1"
                        />
                        <span className="text-xs text-gray-500">
                          {formatTime(editEndTime)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveEditedTimes}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Label className="text-xs">Start Time</Label>
                      <div className="flex items-center mt-1">
                        <Clock size={12} className="mr-1 text-gray-500" />
                        <span className="text-sm">
                          {formatTime(subtitle.startTime)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">End Time</Label>
                      <div className="flex items-center mt-1">
                        <Clock size={12} className="mr-1 text-gray-500" />
                        <span className="text-sm">
                          {formatTime(subtitle.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
