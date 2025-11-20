"use client";

import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { useState } from "react";
import "../../styles/TipTapEditor.css";
import LinkModal from "./LinkModal";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontSize } from "./FontSize";
import TextAlign from "@tiptap/extension-text-align";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import { CustomTableCell } from "./CustomTableCell";
import TableGridPicker from "./TableGridPicker";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EmojiDropdown from "./EmojiDropdown";
import Strike from "@tiptap/extension-strike";
import { List } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function TiptapEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "my-paragraph",
          },
        },
      }),
      Strike,
      Bold,
      Italic,
      Underline,
      TextStyle,
      FontSize,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-600 underline",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      Image,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      HorizontalRule,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    // ✅ SSR fix should go here
    immediatelyRender: false,
  });

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!editor) return null;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-2 bg-base-200 rounded">
        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Bold"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive("bold") ? "btn btn-xs btn-active" : "btn btn-xs"
            }
            type="button"
          >
            <b>B</b>
          </button>
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Italic"
        >
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive("italic") ? "btn btn-xs btn-active" : "btn btn-xs"
            }
            type="button"
          >
            <i>I</i>
          </button>
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Underline"
        >
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={
              editor.isActive("underline")
                ? "btn btn-xs btn-active"
                : "btn btn-xs"
            }
            type="button"
          >
            <u>U</u>
          </button>
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="strikethrough"
        >
          {editor && (
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`btn btn-xs ${
                editor.isActive("strike") ? "bg-blue-500 text-white" : ""
              }`}
              title="Strikethrough"
            >
              <s>S</s>
            </button>
          )}
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Font Size"
        >
          <select
            className="select select-xs border-base-300 bg-base-100 text-sm"
            defaultValue="default"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const size = e.target.value;
              if (size === "default") {
                editor.chain().focus().unsetFontSize().run();
              } else {
                editor.chain().focus().setFontSize(size).run();
              }
            }}
          >
            <option value="default">Size</option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="24px">24px</option>
            <option value="32px">32px</option>
          </select>
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Align left"
        >
          <button
            className={
              editor.isActive({ textAlign: "left" })
                ? "btn btn-xs btn-active"
                : "btn btn-xs"
            }
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            type="button"
          >
            <AlignLeft size={16} />
          </button>
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Align Center"
        >
          <button
            className={
              editor.isActive({ textAlign: "center" })
                ? "btn btn-xs btn-active"
                : "btn btn-xs"
            }
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            type="button"
          >
            <AlignCenter size={16} />
          </button>
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Align Right"
        >
          <button
            className={
              editor.isActive({ textAlign: "right" })
                ? "btn btn-xs btn-active"
                : "btn btn-xs"
            }
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            type="button"
          >
            <AlignRight size={16} />
          </button>
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Justify"
        >
          <button
            className={
              editor.isActive({ textAlign: "justify" })
                ? "btn btn-xs btn-active"
                : "btn btn-xs"
            }
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            type="button"
          >
            <AlignJustify size={16} />
          </button>
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Insert Link"
        >
          {editor && (
            <>
              <div className="mb-2 flex gap-2">
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="btn btn-xs"
                >
                  <div className="text-md">🔗</div>
                </button>
              </div>
            </>
          )}

          {showLinkModal && editor && (
            <LinkModal
              editor={editor}
              onClose={() => setShowLinkModal(false)}
            />
          )}
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Insert Emoji"
        >
          <div className="relative">
            <button
              className="btn btn-xs"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <div>😀</div>
            </button>

            {showEmojiPicker && (
              <EmojiDropdown
                editor={editor}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </div>
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Unordered list"
        >
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList")
                ? "btn btn-xs btn-active"
                : "btn btn-xs"
            }
            type="button"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Ordered list"
        >
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive("orderedList")
                ? "btn btn-xs btn-active"
                : "btn btn-xs"
            }
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <text x="2" y="7" fontSize="4">
                1.
              </text>
              <text x="2" y="13" fontSize="4">
                2.
              </text>
              <text x="2" y="19" fontSize="4">
                3.
              </text>

              <line x1="8" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="20" y2="12" />
              <line x1="8" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>

        <div
          className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
          data-tip="Insert Table"
        >
          {editor && (
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-xs">
                <TableCellsIcon className="w-4 h-4" />
              </label>
              <div
                tabIndex={0}
                className="dropdown-content z-50 !p-0 !m-0 absolute top-full left-0 shadow bg-base-100 border border-base-300 rounded-none mt-0"
              >
                <TableGridPicker
                  onSelect={(rows, cols) => {
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows, cols, withHeaderRow: true })
                      .run();

                    // Wait for the table to fully render before inserting paragraph
                    setTimeout(() => {
                      const { state, view } = editor;
                      const { doc } = state;
                      const pos = doc.content.size - 1; // Position at end of doc

                      // Insert paragraph if last node is a table
                      const lastNode = doc.lastChild;
                      if (lastNode?.type.name === "table") {
                        editor
                          .chain()
                          .focus()
                          .insertContentAt(pos + 1, {
                            type: "paragraph",
                            content: [{ type: "text", text: "" }],
                          })
                          .run();

                        // Move cursor into the new paragraph
                        const newPos = editor.state.doc.content.size - 2;
                        editor.commands.setTextSelection(newPos);
                      }
                    }, 50);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Table Actions (only visible inside a table) */}
        {editor && editor.isActive("table") && (
          <div className="flex gap-1">
            <div
              className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
              data-tip="Add Row"
            >
              <button
                className="btn btn-xs"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                type="button"
              >
                ➕ Row
              </button>
            </div>
            <div
              className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
              data-tip="Add Column"
            >
              <button
                className="btn btn-xs"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                type="button"
              >
                ➕ Col
              </button>
            </div>
            <div
              className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
              data-tip="Delete Row"
            >
              <button
                className="btn btn-xs"
                onClick={() => editor.chain().focus().deleteRow().run()}
                type="button"
              >
                ❌ Row
              </button>
            </div>
            <div
              className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
              data-tip="Delete Column"
            >
              <button
                className="btn btn-xs"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                type="button"
              >
                ❌ Col
              </button>
            </div>
            <div
              className="tooltip tooltip-top before:!rounded before:!border before:!border-base-300 before:!bg-base-100 before:!text-base-content before:!p-1 before:!text-sm"
              data-tip="Delete Table"
            >
              <button
                className="btn btn-xs"
                onClick={() => editor.chain().focus().deleteTable().run()}
                type="button"
              >
                🗑️ Table
              </button>
            </div>
          </div>
        )}

        <EditorContent
          editor={editor}
          className={`
    w-full min-h-[160px]
    bg-base-100 rounded-lg border border-base-300
    px-1 py-1 shadow-sm
    text-base placeholder:text-base-content/40
    transition
    focus:outline-none focus:ring-0 focus:border-none
  `}
        />
      </div>
    </div>
  );
}
