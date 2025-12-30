import React, { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const DropdownCheckbox = ({ title, options = [], selectedOptions = [], onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAll = (e) => {
    e.stopPropagation()
    if (selectedOptions.length === options.length) {
      onSelectionChange([])
    } else {
      onSelectionChange([...options])
    }
  }

  const toggleOption = (option, e) => {
    e.stopPropagation()
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter(o => o !== option)
      : [...selectedOptions, option]
    onSelectionChange(newSelection)
  }

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex justify-between items-center"
      >
        <span className="truncate">
          {selectedOptions.length === 0
            ? title
            : selectedOptions.length === options.length
            ? 'Semua dipilih'
            : `${selectedOptions.length} dipilih`}
        </span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOptions.length === options.length && options.length > 0}
                onChange={toggleAll}
                className="rounded"
              />
              <span className="ml-2 text-sm font-medium">Semua</span>
            </label>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {options.map(option => (
              <label key={option} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={(e) => toggleOption(option, e)}
                  className="rounded"
                />
                <span className="ml-2 text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default DropdownCheckbox
