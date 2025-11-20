import { useState } from 'react'

interface Props {
  onSelect: (rows: number, cols: number) => void
  maxRows?: number
  maxCols?: number
}

export default function TableGridPicker({ onSelect, maxRows = 10, maxCols = 10 }: Props) {
  const [hovered, setHovered] = useState<[number, number]>([0, 0])

  return (
    <div className="inline-block border border-base-300 bg-base-100 p-1">
      {Array.from({ length: maxRows }).map((_, rowIdx) => (
        <div className="flex" key={`row-${rowIdx}`}>
          {Array.from({ length: maxCols }).map((_, colIdx) => {
            const isActive = rowIdx <= hovered[0] && colIdx <= hovered[1]
            return (
              <div
                key={`cell-${rowIdx}-${colIdx}`}
                className={`w-5 h-5 border border-base-200 ${
                  isActive ? 'bg-white' : 'bg-grey'
                } cursor-pointer`}
                onMouseEnter={() => setHovered([rowIdx, colIdx])}
                onClick={() => onSelect(rowIdx + 1, colIdx + 1)}
              />
            )
          })}
        </div>
      ))}
      <div className="text-xs text-gray-500 mt-1">
        {hovered[0] + 1} × {hovered[1] + 1}
      </div>
    </div>
  )
}
