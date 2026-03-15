import React, { useRef, useState, useCallback } from 'react';
import { Camera, X, Check } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

interface PhotoUploadProps {
  photo: string;
  onChange: (photo: string) => void;
}

export function PhotoUpload({ photo, onChange }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // reset input
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onChange(croppedImage);
        setImageSrc(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, onChange]);

  return (
    <>
      <div 
        className={`flex items-center justify-center cursor-pointer overflow-hidden relative group bg-gray-50 print:bg-transparent transition-colors resize print:resize-none ${
          photo 
            ? 'w-[25mm] h-[35mm] border border-gray-200' 
            : 'w-[25mm] h-[35mm] border-2 border-dashed border-gray-300 hover:border-blue-500'
        }`}
        style={{ minWidth: '20mm', minHeight: '20mm', maxWidth: '80mm', maxHeight: '100mm' }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          // 忽略右下角 20x20 像素区域的点击（原生 resize 拖拽手柄的位置），防止拖拽时触发上传
          if (x > rect.width - 20 && y > rect.height - 20) {
            return;
          }
          fileInputRef.current?.click();
        }}
      >
        {photo ? (
          <>
            <img src={photo} alt="Profile" className="w-full h-full object-cover pointer-events-none" />
            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs no-print transition-opacity pointer-events-none">
              更换照片
            </div>
          </>
        ) : (
          <div className="text-gray-400 text-[10px] text-center no-print pointer-events-none">
            <Camera className="w-5 h-5 mx-auto mb-1 opacity-50" />
            点击上传
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 no-print">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">裁剪头像</h3>
              <button onClick={() => setImageSrc(null)} className="text-gray-500 hover:text-gray-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full h-80 bg-gray-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={25 / 35}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                objectFit="contain"
              />
            </div>
            <div className="p-5 flex flex-col gap-5 bg-white">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">缩放</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.05}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setImageSrc(null)}
                  className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={showCroppedImage}
                  className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  确认裁剪
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
