import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Italic, Underline } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({ value, onChange, className = '', multiline = false, placeholder = '' }: EditableTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const handleBlur = () => {
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      ref.current?.blur();
    }
    // Ctrl+B, Ctrl+I, Ctrl+U are handled natively by contentEditable
    // We just need to ensure the HTML is saved on blur
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleSelect = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && ref.current?.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbarPosition({
        top: rect.top - 40,
        left: rect.left + rect.width / 2,
      });
      setToolbarVisible(true);
    } else {
      setToolbarVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelect);
    return () => {
      document.removeEventListener('selectionchange', handleSelect);
    };
  }, []);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  };

  return (
    <>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={`outline-none hover:bg-gray-100/50 focus:bg-white focus:ring-2 focus:ring-blue-500/50 rounded transition-colors empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 ${className} ${multiline ? 'whitespace-pre-wrap' : ''}`}
        data-placeholder={placeholder}
      />
      {toolbarVisible && createPortal(
        <div 
          className="fixed z-[100] flex items-center gap-1 bg-gray-800 text-white px-2 py-1 rounded shadow-lg -translate-x-1/2 no-print animate-in fade-in zoom-in duration-150"
          style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
          onMouseDown={(e) => e.preventDefault()} // Prevent losing focus on the text
        >
          <button 
            onClick={() => executeCommand('bold')}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="加粗 (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button 
            onClick={() => executeCommand('italic')}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="斜体 (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button 
            onClick={() => executeCommand('underline')}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="下划线 (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <div className="w-px h-4 bg-gray-600 mx-1" />
          
          <button 
            onClick={() => executeCommand('fontSize', '1')}
            className="px-2 py-1 hover:bg-gray-700 rounded transition-colors text-[10px] font-medium"
            title="极小字号"
          >
            小
          </button>
          <button 
            onClick={() => executeCommand('fontSize', '2')}
            className="px-2 py-1 hover:bg-gray-700 rounded transition-colors text-xs font-medium"
            title="较小字号"
          >
            中
          </button>
          <button 
            onClick={() => executeCommand('fontSize', '4')}
            className="px-2 py-1 hover:bg-gray-700 rounded transition-colors text-sm font-medium"
            title="较大字号"
          >
            大
          </button>
          <button 
            onClick={() => executeCommand('fontSize', '6')}
            className="px-2 py-1 hover:bg-gray-700 rounded transition-colors text-base font-medium"
            title="特大字号"
          >
            特大
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
