import React from 'react';
import { Scissors, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

interface SectionWrapperProps {
  key?: React.Key;
  section: any;
  index: number;
  data: any;
  updateData: (data: any) => void;
  children: React.ReactNode;
}

export function SectionWrapper({ section, index, data, updateData, children }: SectionWrapperProps) {
  const togglePageBreak = () => {
    const newSections = [...data.sections];
    newSections[index].pageBreak = !newSections[index].pageBreak;
    updateData({ ...data, sections: newSections });
  };

  const moveUp = () => {
    if (index === 0) return;
    const newSections = [...data.sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    updateData({ ...data, sections: newSections });
  };

  const moveDown = () => {
    if (index === data.sections.length - 1) return;
    const newSections = [...data.sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    updateData({ ...data, sections: newSections });
  };

  const deleteSection = () => {
    const newSections = data.sections.filter((_: any, i: number) => i !== index);
    updateData({ ...data, sections: newSections });
  };

  return (
    <div className={`mb-6 relative group ${section.pageBreak ? 'break-before-page' : ''}`}>
      {/* Controls */}
      <div className="absolute -left-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity no-print z-10">
        <button 
          onClick={togglePageBreak}
          className={`p-1.5 rounded shadow-sm ${section.pageBreak ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500 hover:text-blue-600 hover:bg-gray-50'}`}
          title={section.pageBreak ? "取消分页" : "在此处分页"}
        >
          <Scissors className="w-3.5 h-3.5" />
        </button>
        <button onClick={moveUp} className="p-1.5 rounded shadow-sm bg-white text-gray-500 hover:text-blue-600 hover:bg-gray-50" title="上移">
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button onClick={moveDown} className="p-1.5 rounded shadow-sm bg-white text-gray-500 hover:text-blue-600 hover:bg-gray-50" title="下移">
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
        <button onClick={deleteSection} className="p-1.5 rounded shadow-sm bg-white text-gray-500 hover:text-red-600 hover:bg-gray-50" title="删除">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Page break indicator */}
      {section.pageBreak && (
        <div className="absolute -top-4 left-0 right-0 border-t-2 border-dashed border-blue-300 no-print flex justify-center">
          <span className="bg-white px-2 text-[10px] text-blue-400 -mt-2">分页线 (导出时生效)</span>
        </div>
      )}

      {children}
    </div>
  );
}
