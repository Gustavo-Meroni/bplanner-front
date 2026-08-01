'use client';

import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '@/shared/utils/format-currency';

interface InlineNumberEditProps {
  value: number;
  onSave: (val: number) => void;
  className?: string;
}

export function InlineNumberEdit({ value, onSave, className = '' }: InlineNumberEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    const parsed = parseFloat(tempValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onSave(parsed);
    } else {
      setTempValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(value.toString());
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-muted-foreground text-sm font-normal">R$</span>
        <input
          ref={inputRef}
          type="number"
          step="0.01"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-24 px-1 py-0 border-b-2 border-primary bg-transparent outline-none text-foreground font-medium"
        />
      </div>
    );
  }

  return (
    <div
      className={`cursor-pointer hover:bg-primary/10 px-1.5 py-0.5 rounded-md transition-colors ${className}`}
      onClick={() => {
        setTempValue(value.toString());
        setIsEditing(true);
      }}
    >
      {formatCurrency(value)}
    </div>
  );
}
