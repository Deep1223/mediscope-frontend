"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

export default function TagPicker({ 
  tags = [], 
  onTagsChange, 
  placeholder = "Type and press Enter to add tags...", 
  maxTags = 10,
  className = "",
  error = false 
}) {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const addTag = (tagText) => {
    const trimmedTag = tagText.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedTag])
    }
  }

  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
        setInputValue("")
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (inputValue.trim()) {
      addTag(inputValue)
      setInputValue("")
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          min-h-[48px] w-full px-3 py-2 border rounded-lg transition-all duration-200
          ${isFocused ? 'ring-2 ring-blue-500/50 border-blue-500' : 'border-gray-300'}
          ${error ? 'border-red-500 ring-2 ring-red-500/50' : ''}
          bg-white hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50
        `}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap items-center gap-2 min-h-[24px]">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full border border-purple-200"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(tag)
                }}
                className="ml-1 text-purple-600 hover:text-purple-800 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 placeholder-gray-500"
            disabled={tags.length >= maxTags}
          />
        </div>
      </div>
      {tags.length >= maxTags && (
        <p className="text-xs text-gray-500 mt-1">
          Maximum {maxTags} tags allowed
        </p>
      )}
    </div>
  )
}
