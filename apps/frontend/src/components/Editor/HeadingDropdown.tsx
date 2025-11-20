
import type { Editor } from '@tiptap/react'
import { useState, useRef, useEffect } from 'react'

export function HeadingDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (btnRef.current && event.target && !btnRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const setHeading = (level: number) => {
    editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
    setOpen(false)
  }
return (
    <div className="relative" ref={btnRef}>
      <button
        type="button"
        className={`
          btn btn-xs flex items-center gap-1
          px-2 rounded-md transition
          ${editor.isActive('heading') ? 'btn-active border-primary ring-2 ring-primary/30' : ''}
        `}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        {/* Heading SVG */}
        <svg width="15" height="15" className="text-base-content" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 3C6.55228 3 7 3.44772 7 4V11H17V4C17 3.44772 17.4477 3 18 3C18.5523 3 19 3.44772 19 4V20C19 20.5523 18.5523 21 18 21C17.4477 21 17 20.5523 17 20V13H7V20C7 20.5523 6.55228 21 6 21C5.44772 21 5 20.5523 5 20V4C5 3.44772 5.44772 3 6 3Z" />
        </svg>
        {/* Dropdown chevron */}
        <svg width="15" height="15" className="text-base-content" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 z-50 mt-2 w-14 bg-base-100 border border-base-300 rounded-lg shadow-xl">
          {[1, 2, 3].map(level => (
            <button
              key={level}
              className={`
                w-full text-left px-3 py-1 rounded-md
                hover:bg-primary/10 transition
                ${editor.isActive('heading', { level }) ? 'bg-primary/20 font-bold text-primary' : ''}
              `}
              onClick={() => setHeading(level)}
              tabIndex={0}
            >
              <span className={`text-base`}>
                H{level}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

