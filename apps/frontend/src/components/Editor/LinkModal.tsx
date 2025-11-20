/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

interface LinkModalProps {
  editor: any;
  onClose: () => void;
}

export default function LinkModal({ editor, onClose }: LinkModalProps) {
  const [text, setText] = useState(
    editor.view.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    )
  );
  const [url, setUrl] = useState(editor.getAttributes("link").href || "");

  const applyLink = () => {
    if (url) {
      const finalText = text || url;
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${finalText}</a>`
        )
        .run();
    }
    onClose();
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div className="w-96 bg-white text-black border border-white rounded-lg p-4 shadow-[0_0_40px_rgba(255,255,255,0.4)] ring-2 ring-white/30">
        <label className="block text-sm font-medium mb-1">Text</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded px-2 py-1 mb-3"
        />
        <label className="block text-sm font-medium mb-1">URL</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full border rounded px-2 py-1 mb-3"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={removeLink}
            className="btn btn-sm btn-ghost"
          >
            Remove
          </button>
          <button
            type="button"
            onClick={applyLink}
            className="btn btn-primary btn-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
