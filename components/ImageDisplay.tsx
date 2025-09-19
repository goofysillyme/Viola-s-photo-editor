import React, { useRef, useState } from 'react';
import { Spinner } from './Spinner';
import { useLanguage } from '../contexts/LanguageContext';

type BlemishSelection = {
  x: number;
  y: number;
  radius: number;
  width: number;
  height: number;
};

type FaceBoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
  isDownloadable?: boolean;
  originalFileType?: string | null;
  isBlemishModeActive?: boolean;
  onBlemishSelect?: (selection: BlemishSelection) => void;
  blemishBrushRadius?: number;
  isPeeking?: boolean;
  isPeekingEnabled?: boolean;
  onPeekToggle?: () => void;
  detectedFaces?: FaceBoundingBox[];
  selectedFaceIndex?: number | null;
  onFaceSelect?: (index: number) => void;
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  title, 
  imageUrl, 
  isLoading = false, 
  isDownloadable = false, 
  originalFileType = null,
  isBlemishModeActive = false,
  onBlemishSelect,
  blemishBrushRadius = 15,
  isPeeking = false,
  isPeekingEnabled = false,
  onPeekToggle,
  detectedFaces = [],
  selectedFaceIndex = null,
  onFaceSelect,
}) => {
  const { t } = useLanguage();
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverPos, setHoverPos] = useState<{x: number, y: number} | null>(null);


  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;

    let extension = 'png';
    
    if (originalFileType) {
      extension = originalFileType.split('/')[1] || 'png';
    } else {
      const mimeType = imageUrl.split(';')[0].split(':')[1];
      extension = mimeType ? mimeType.split('/')[1] : 'png';
    }
    
    if (extension === 'jpeg') {
      extension = 'jpg';
    }

    link.download = `edited-image.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isBlemishModeActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoverPos(null);
  };
  
  const handleBlemishClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isBlemishModeActive || !imgRef.current || !onBlemishSelect || !containerRef.current) return;
    
    const img = imgRef.current;
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    const imgRect = img.getBoundingClientRect();
    const imgDisplayX = imgRect.left - containerRect.left;
    const imgDisplayY = imgRect.top - containerRect.top;
    const imgDisplayWidth = imgRect.width;
    const imgDisplayHeight = imgRect.height;
    
    if ( mouseX < imgDisplayX || mouseX > imgDisplayX + imgDisplayWidth ||
         mouseY < imgDisplayY || mouseY > imgDisplayY + imgDisplayHeight ) {
        return;
    }

    const clickXOnDisplay = mouseX - imgDisplayX;
    const clickYOnDisplay = mouseY - imgDisplayY;
    
    const { naturalWidth, naturalHeight } = img;
    const scaleX = naturalWidth / imgDisplayWidth;
    const scaleY = naturalHeight / imgDisplayHeight;

    const finalX = Math.round(clickXOnDisplay * scaleX);
    const finalY = Math.round(clickYOnDisplay * scaleY);

    const scale = Math.max(scaleX, scaleY);
    const finalRadius = Math.round(blemishBrushRadius * scale);

    onBlemishSelect({
      x: finalX,
      y: finalY,
      radius: finalRadius,
      width: naturalWidth,
      height: naturalHeight,
    });

    setHoverPos(null);
  };
  
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isBlemishModeActive) {
      handleBlemishClick(e);
    } else if (isPeekingEnabled) {
      onPeekToggle?.();
    }
  };
  
  const getFaceBoxStyle = (faceBox: FaceBoundingBox): React.CSSProperties => {
    if (!imgRef.current || !containerRef.current) return { display: 'none' };

    const img = imgRef.current;
    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const imgDisplayX = imgRect.left - containerRect.left;
    const imgDisplayY = imgRect.top - containerRect.top;
    const imgDisplayWidth = imgRect.width;
    const imgDisplayHeight = imgRect.height;

    const { naturalWidth, naturalHeight } = img;
    const scaleX = imgDisplayWidth / naturalWidth;
    const scaleY = imgDisplayHeight / naturalHeight;
    
    return {
        position: 'absolute',
        left: `${faceBox.x * scaleX + imgDisplayX}px`,
        top: `${faceBox.y * scaleY + imgDisplayY}px`,
        width: `${faceBox.width * scaleX}px`,
        height: `${faceBox.height * scaleY}px`,
    };
  };

  const containerClasses = [
    'relative', 'w-full', 'aspect-square', 'bg-gray-800/50',
    'rounded-xl', 'shadow-lg', 'flex', 'items-center', 'justify-center',
    'p-4', 'overflow-hidden', 'transition-all',
    isBlemishModeActive ? 'cursor-none' : '',
    (isPeekingEnabled && !isBlemishModeActive) ? 'cursor-pointer' : ''
  ].join(' ');


  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-xl font-semibold text-center text-cyan-400">{title}</h3>
      <div 
        ref={containerRef}
        className={containerClasses}
        onMouseMove={isBlemishModeActive ? handleMouseMove : undefined}
        onMouseLeave={isBlemishModeActive ? handleMouseLeave : undefined}
        onClick={handleContainerClick}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Spinner />
            <p className="mt-2 text-sm">{t.generatingImage}...</p>
          </div>
        ) : imageUrl ? (
          <>
            <img ref={imgRef} src={imageUrl} alt={title} className="max-w-full max-h-full object-contain rounded-lg" />
             {/* Face Detection Boxes */}
            {!isBlemishModeActive && detectedFaces.map((face, index) => {
                const isSelected = index === selectedFaceIndex;
                const boxStyle = getFaceBoxStyle(face);
                return (
                    <div
                        key={index}
                        style={boxStyle}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent container click
                            onFaceSelect?.(index);
                        }}
                        className={`absolute border-2 rounded-md transition-all duration-200 cursor-pointer hover:bg-white/20 ${
                            isSelected ? 'border-cyan-400 shadow-lg' : 'border-white/50'
                        }`}
                        aria-label={`Select face ${index + 1}`}
                    />
                );
            })}
            {isDownloadable && (
                 <button
                    onClick={handleDownload}
                    className="absolute top-3 right-3 p-2 bg-gray-900/50 hover:bg-cyan-600/70 text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
                    title={t.downloadImage}
                    aria-label={t.downloadAriaLabel}
                >
                    <DownloadIcon />
                </button>
            )}
            {isBlemishModeActive && hoverPos && (
                <div
                    className="absolute border-2 border-cyan-400 bg-cyan-400/30 rounded-full pointer-events-none"
                    style={{
                        left: `${hoverPos.x}px`,
                        top: `${hoverPos.y}px`,
                        width: `${blemishBrushRadius * 2}px`,
                        height: `${blemishBrushRadius * 2}px`,
                        transform: 'translate(-50%, -50%)',
                    }}
                    aria-hidden="true"
                />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm">{t.imagePlaceholder(title)}</p>
          </div>
        )}
      </div>
    </div>
  );
};