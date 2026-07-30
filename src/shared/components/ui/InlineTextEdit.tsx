'use client';

import React, { useState, useEffect, useRef } from 'react';

interface InlineTextEditProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  placeholder?: string;
}

export function InlineTextEdit({
  value,
  onSave,
  className = '',
  placeholder = 'Nome',
}: InlineTextEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (tempValue.trim()) {
      onSave(tempValue.trim());
    } else {
      setTempValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(value);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 min-w-0 px-1 py-0 border-b-2 border-[#2E6F40] bg-white outline-none text-[#253D2C] font-medium"
      />
    );
  }

  return (
    <div
      className={`cursor-pointer hover:bg-slate-100 px-1 py-0.5 rounded-md transition-colors truncate ${className}`}
      onClick={() => {
        setTempValue(value);
        setIsEditing(true);
      }}
      title="Clique para editar"
    >
      {value || <span className="text-slate-400 italic">{placeholder}</span>}
    </div>
  );
}
