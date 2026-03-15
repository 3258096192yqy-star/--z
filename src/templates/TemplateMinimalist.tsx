import React from 'react';
import { EditableText } from '../components/EditableText';
import { PhotoUpload } from '../components/PhotoUpload';
import { SectionWrapper } from '../components/SectionWrapper';
import { getSectionIcon } from '../utils/iconMap';
import { Contact } from 'lucide-react';

export function TemplateMinimalist({ data, updateData }: { data: any, updateData: (data: any) => void }) {
  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...data.sections];
    newSections[index][field] = value;
    updateData({ ...data, sections: newSections });
  };

  return (
    <div className="text-gray-900 font-sans">
      <div className="flex flex-col items-center mb-8 relative">
        <EditableText 
          value={data.name} 
          onChange={(val) => updateData({ ...data, name: val })} 
          className="text-4xl font-light tracking-widest mb-3"
          placeholder="姓名"
        />
        <div className="flex items-start gap-2 text-gray-500 justify-center">
          <Contact className="w-4 h-4 mt-1 shrink-0 opacity-70" />
          <EditableText 
            value={data.contact} 
            onChange={(val) => updateData({ ...data, contact: val })} 
            className="text-[13px] text-center"
            multiline
            placeholder="联系方式"
          />
        </div>
        <div className="absolute right-0 top-0">
          <PhotoUpload photo={data.photo} onChange={(val) => updateData({ ...data, photo: val })} />
        </div>
      </div>

      {data.sections.map((section: any, index: number) => (
        <SectionWrapper key={section.id} section={section} index={index} data={data} updateData={updateData}>
          <div className="flex items-center gap-3 mb-4 text-gray-800">
            {getSectionIcon(section.title, "w-5 h-5")}
            <EditableText 
              value={section.title} 
              onChange={(val) => updateSection(index, 'title', val)} 
              className="text-base font-bold uppercase tracking-wider shrink-0"
              placeholder="标题"
            />
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          <EditableText 
            value={section.content} 
            onChange={(val) => updateSection(index, 'content', val)} 
            className="text-[13px] leading-relaxed text-gray-700"
            multiline
            placeholder="内容"
          />
        </SectionWrapper>
      ))}
    </div>
  );
}
