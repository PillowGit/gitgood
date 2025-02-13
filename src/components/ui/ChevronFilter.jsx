"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react"; // Ensure you're using Lucide React for icons

export function ChevronFilter({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-[#1a1a1a] text-white border border-gray-700 rounded-lg hover:bg-[#282828] transition"
      >
        <span>{selectedOption}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg z-10">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className="w-full text-left px-4 py-2 text-white hover:bg-[#282828] transition"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
