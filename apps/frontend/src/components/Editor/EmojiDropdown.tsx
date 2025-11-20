/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";

export default function EmojiDropdown({
  editor,
  onClose,
}: {
  editor: any;
  onClose: () => void;
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(true);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emojiData: any) => {
    editor.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmojiPicker(false);
    onClose();
  };

  // 👇 Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={emojiPickerRef}
      className="absolute z-50 mt-2 bg-transparent text-white rounded shadow-lg border border-white"
      style={{ left: "90%", transform: "translateX(-50%)" }}
    >
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          theme={Theme.DARK}
          searchDisabled
          skinTonesDisabled
          previewConfig={{ showPreview: false }}
        />
      )}
    </div>
  );
}
