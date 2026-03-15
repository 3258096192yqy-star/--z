/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Download, Plus, ExternalLink, Save, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { initialData } from './data/initialData';
import { TemplateProfessional } from './templates/TemplateProfessional';
import { TemplateMinimalist } from './templates/TemplateMinimalist';
import { TemplateElegant } from './templates/TemplateElegant';

export default function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved resume data", e);
      }
    }
    return initialData;
  });
  
  const [template, setTemplate] = useState('professional');
  const [fontSize, setFontSize] = useState('normal');
  const [showExportModal, setShowExportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const resumeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(data));
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePrintClick = () => {
    let inIframe = false;
    try {
      inIframe = window.self !== window.top;
    } catch (e) {
      inIframe = true;
    }

    if (inIframe) {
      setShowExportModal(true);
    } else {
      window.print();
    }
  };

  const handleExportJson = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Sanitize filename: remove HTML tags and invalid OS characters
      const rawName = data.name ? data.name.replace(/<[^>]*>?/gm, '') : 'resume';
      const safeName = rawName.replace(/[\\/:*?"<>|\n\r]/g, '_').trim() || 'resume';
      
      a.download = `${safeName}-data.json`;
      document.body.appendChild(a); // Required for some browsers like Firefox
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('简历数据已保存到电脑');
    } catch (err) {
      console.error("Export error:", err);
      alert("保存数据失败，请重试。");
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      alert('抱歉，不能直接导入 PDF 文件。\n\nPDF 就像是“打印出来的照片”，已经失去了可编辑的结构。\n\n请导入您之前通过“保存数据”按钮下载的 .json 格式的数据文件。');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      let text = event.target?.result as string;
      if (!text) return;
      
      // Clean up BOM (Byte Order Mark) and trim whitespace that might break JSON.parse
      text = text.replace(/^\uFEFF/, '').trim();

      try {
        const importedData = JSON.parse(text);
        if (importedData && Array.isArray(importedData.sections)) {
          setData(importedData);
          showToast('简历数据导入成功！');
        } else {
          alert('无效的简历数据文件：文件中找不到 sections 数据。\n请确保上传的是本系统导出的 .json 文件。');
        }
      } catch (error: any) {
        const preview = text.substring(0, 100).replace(/\n/g, ' ');
        alert(`导入失败！您上传的文件似乎不是正确的 JSON 格式。\n\n文件名: ${file.name}\n错误原因: ${error.message}\n\n文件内容预览:\n${preview}...\n\n请确认您点击的是“保存数据”按钮下载的 .json 文件，而不是导出的 PDF。`);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      alert("读取文件时发生错误，请重试。");
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleReset = () => {
    if (confirm('确定要清空当前简历吗？未保存的数据将丢失。')) {
      setData({
        name: '',
        contact: '',
        photo: '',
        sections: []
      });
      showToast('简历已清空');
    }
  };

  const addSection = () => {
    setData({
      ...data,
      sections: [
        ...data.sections,
        {
          id: `s${Date.now()}`,
          title: '新模块',
          content: '点击编辑内容...',
          pageBreak: false
        }
      ]
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white flex flex-col font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300 no-print">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Topbar */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-50 no-print">
        <h1 className="text-xl font-bold text-gray-800">简历制作器</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-gray-200 pr-4 mr-2">
            <button 
              onClick={handleReset}
              className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md hover:bg-red-50 flex items-center gap-2 text-sm font-medium transition-colors"
              title="清空当前简历"
            >
              <Trash2 className="w-4 h-4" />
              清空
            </button>
            <button 
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.value = '';
                fileInputRef.current?.click();
              }}
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-blue-50 flex items-center gap-2 text-sm font-medium transition-colors"
              title="导入之前保存的简历数据"
            >
              <Upload className="w-4 h-4" />
              导入数据
            </button>
            <button 
              onClick={handleExportJson}
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-blue-50 flex items-center gap-2 text-sm font-medium transition-colors"
              title="将当前简历数据保存为文件，方便下次导入"
            >
              <Save className="w-4 h-4" />
              保存数据
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportJson} 
              accept=".json" 
              className="hidden" 
            />
          </div>
          
          <select 
            value={fontSize} 
            onChange={(e) => setFontSize(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="调整字体大小"
          >
            <option value="small">小号字体</option>
            <option value="normal">标准字体</option>
            <option value="large">大号字体</option>
          </select>

          <select 
            value={template} 
            onChange={(e) => setTemplate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="professional">专业蓝</option>
            <option value="minimalist">极简黑白</option>
            <option value="elegant">优雅衬线</option>
          </select>
          <button 
            onClick={handlePrintClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            导出 PDF
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 overflow-auto p-8 flex flex-col items-center print:p-0 print:block print:overflow-visible">
        <div 
          ref={resumeRef}
          className={`a4-page w-[210mm] min-h-[297mm] bg-white shadow-xl p-[15mm] relative text-size-${fontSize}`}
        >
           {template === 'professional' && <TemplateProfessional data={data} updateData={setData} />}
           {template === 'minimalist' && <TemplateMinimalist data={data} updateData={setData} />}
           {template === 'elegant' && <TemplateElegant data={data} updateData={setData} />}
           
           <button 
             onClick={addSection}
             className="w-full py-3 mt-4 border-2 border-dashed border-gray-300 text-gray-500 rounded-md hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2 transition-colors no-print add-section-btn"
           >
             <Plus className="w-4 h-4" />
             添加新模块
           </button>
        </div>
      </main>

      {/* Export Modal for Iframe */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm no-print">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">需要全屏打开以导出</h3>
            
            <div className="space-y-4">
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900">文本型 PDF (推荐)</h4>
                    <p className="text-sm text-blue-800 mt-1 mb-3">
                      为了生成文字可复制、超高清的完美 PDF，并且由于当前预览窗口的限制，您需要在一个独立的新网页中打开应用才能进行导出。
                    </p>
                    <button 
                      onClick={() => window.open(window.location.href, '_blank')}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      点击这里：在新网页中打开
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
