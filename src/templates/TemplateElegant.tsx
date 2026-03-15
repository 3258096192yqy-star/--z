import React from 'react';
import { EditableText } from '../components/EditableText';
import { PhotoUpload } from '../components/PhotoUpload';
import { SectionWrapper } from '../components/SectionWrapper';
import { getSectionIcon } from '../utils/iconMap';
import { Contact } from 'lucide-react';

export function TemplateElegant({ data, updateData }: { data: any, updateData: (data: any) => void }) {
  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...data.sections];
    newSections[index][field] = value;
    updateData({ ...data, sections: newSections });
  };

  return (
    <div className="text-gray-900 font-serif">
      <div className="flex justify-between items-end mb-8 border-b border-gray-400 pb-6">
        <div className="flex-1 pr-4">
          <EditableText 
            value={data.name} 
            onChange={(val) => updateData({ ...data, name: val })} 
            className="text-4xl font-bold mb-3 tracking-wide"
            placeholder="姓名"
          />
          <div className="flex items-start gap-2 text-gray-600">
            <Contact className="w-4 h-4 mt-1 shrink-0 opacity-70" />
            <EditableText 
              value={data.contact} 
              onChange={(val) => updateData({ ...data, contact: val })} 
              className="text-[13px] flex-1"
              multiline
              placeholder="联系方式"
            />
          </div>
        </div>
        <div className="shrink-0">
          <PhotoUpload photo={data.photo} onChange={(val) => updateData({ ...data, photo: val })} />
        </div>
      </div>

      {data.sections.map((section: any, index: number) => (
        <SectionWrapper key={section.id} section={section} index={index} data={data} updateData={updateData}>
          <div className="flex items-center justify-center gap-2 mb-4 text-gray-800">
            {getSectionIcon(section.title, "w-5 h-5")}
            <EditableText 
              value={section.title} 
              onChange={(val) => updateSection(index, 'title', val)} 
              className="text-lg font-bold uppercase tracking-widest"
              placeholder="标题"
            />
          </div>
          <EditableText 
            value={section.content} 
            onChange={(val) => updateSection(index, 'content', val)} 
            className="text-[13px] leading-relaxed text-gray-800"
            multiline
            placeholder="内容"
          />
        </SectionWrapper>
      ))}
    </div>
  );
}
