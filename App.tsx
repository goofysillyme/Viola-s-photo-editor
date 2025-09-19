import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { Spinner } from './components/Spinner';
import { editImage } from './services/geminiService';
import { useLanguage } from './contexts/LanguageContext';

// Helper function to convert data URL to File object
const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const extension = blob.type.split('/')[1] || 'png';
    return new File([blob], `${filename}.${extension}`, { type: blob.type });
};

// Slider sub-component for the adjustments panel
const AdjustmentSlider: React.FC<{
    id: string;
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
}> = ({ id, label, value, onChange, min = 0, max = 10, step = 1, disabled = false }) => (
    <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
            <label htmlFor={id} className="text-sm font-medium text-gray-400">{label}</label>
            <span className="text-sm font-bold text-cyan-400 w-8 text-center" aria-live="polite">{value > 0 ? `+${value}` : value}</span>
        </div>
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(parseInt(e.target.value, 10))}
            disabled={disabled}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-label={`${label} slider`}
        />
    </div>
);

const filters = [
  { id: 'sepia', labelKey: 'filterSepia', promptKey: 'promptFilterSepia' },
  { id: 'blackAndWhite', labelKey: 'filterBlackAndWhite', promptKey: 'promptFilterBlackAndWhite' },
  { id: 'vintage', labelKey: 'filterVintage', promptKey: 'promptFilterVintage' },
  { id: 'lomo', labelKey: 'filterLomo', promptKey: 'promptFilterLomo' },
  { id: 'clarendon', labelKey: 'filterClarendon', promptKey: 'promptFilterClarendon' },
  { id: 'gingham', labelKey: 'filterGingham', promptKey: 'promptFilterGingham' },
  { id: 'moon', labelKey: 'filterMoon', promptKey: 'promptFilterMoon' },
  { id: 'cinematic', labelKey: 'filterCinematic', promptKey: 'promptFilterCinematic' },
  { id: 'warm', labelKey: 'filterWarm', promptKey: 'promptFilterWarm' },
  { id: 'cool', labelKey: 'filterCool', promptKey: 'promptFilterCool' },
  { id: 'grayscale', labelKey: 'filterGrayscale', promptKey: 'promptFilterGrayscale' },
  { id: 'invert', labelKey: 'filterInvert', promptKey: 'promptFilterInvert' },
  { id: 'solarize', labelKey: 'filterSolarize', promptKey: 'promptFilterSolarize' },
  { id: 'popArt', labelKey: 'filterPopArt', promptKey: 'promptFilterPopArt' },
  { id: 'neonPunk', labelKey: 'filterNeonPunk', promptKey: 'promptFilterNeonPunk' },
  { id: 'infrared', labelKey: 'filterInfrared', promptKey: 'promptFilterInfrared' },
  { id: 'duotone', labelKey: 'filterDuotone', promptKey: 'promptFilterDuotone' },
  { id: 'sketch', labelKey: 'filterSketch', promptKey: 'promptFilterSketch' },
  { id: 'watercolor', labelKey: 'filterWatercolor', promptKey: 'promptFilterWatercolor' },
];

type PeekState = 'off' | 'previous' | 'original';
type FaceBoundingBox = { x: number; y: number; width: number; height: number; };

const initialAdjustments = {
    smooth: 0,
    slim: 0,
    jawline: 0,
    skin_tone: 0,
    eye_size: 0,
    plump_lips: 0,
    mouth_width: 0,
    nose_bridge: 0,
    nose_width: 0,
    happy: 0,
    angry: 0,
    vignette: 0,
    hourglass: 0,
};

const App: React.FC = () => {
  const { t } = useLanguage();
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [preAdjustmentImageUrl, setPreAdjustmentImageUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [loadingAction, setLoadingAction] = useState<'edit' | 'auto' | 'background' | 'light' | 'clothes' | 'hd' | 'adjust' | 'blemish' | 'filter' | 'eye_color' | 'elf_ears' | null>(null);
  const [loadingFilter, setLoadingFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBlemishModeActive, setIsBlemishModeActive] = useState(false);
  const [blemishBrushSize, setBlemishBrushSize] = useState(15);
  const [peekState, setPeekState] = useState<PeekState>('off');
  const [eyeColor, setEyeColor] = useState<string>('#4682B4');
  const [detectedFaces, setDetectedFaces] = useState<FaceBoundingBox[]>([]);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(null);
  const [adjustments, setAdjustments] = useState(initialAdjustments);
  const [activeTab, setActiveTab] = useState<'face' | 'nose' | 'mouth' | 'eyes' | 'fun_effects' | 'filters'>('face');

  const isLoading = loadingAction !== null;

  useEffect(() => {
    if (originalImage) {
      const url = URL.createObjectURL(originalImage);
      setOriginalImageUrl(url);
      setHistory([url]);
      setIsBlemishModeActive(false);

      // --- Face Detection ---
      const detectFaces = async () => {
        if (!('FaceDetector' in window)) {
            console.warn('Face Detection API not supported in this browser.');
            setDetectedFaces([]);
            setSelectedFaceIndex(null);
            return;
        }
        
        try {
            const faceDetector = new (window as any).FaceDetector({ fastMode: true });
            const img = document.createElement('img');
            img.src = url;
            await img.decode();
            const faces = await faceDetector.detect(img);
            const faceBoxes = faces.map((face: { boundingBox: FaceBoundingBox }) => face.boundingBox);
            setDetectedFaces(faceBoxes);
            setSelectedFaceIndex(faceBoxes.length > 0 ? 0 : null);
        } catch (err) {
            console.error("Face detection failed:", err);
            setDetectedFaces([]);
            setSelectedFaceIndex(null);
        }
      };

      detectFaces();
      
      return () => URL.revokeObjectURL(url);
    } else {
      setOriginalImageUrl(null);
      setHistory([]);
      setDetectedFaces([]);
      setSelectedFaceIndex(null);
    }
  }, [originalImage]);

  const handleImageSelect = (file: File | null) => {
    setOriginalImage(file);
    setEditedImageUrl(null);
    setPreAdjustmentImageUrl(null);
    setPeekState('off');
    setError(null);
    setAdjustments(initialAdjustments);
    setPrompt('');
    setEyeColor('#4682B4');
  };
  
  const performEdit = useCallback(async (promptText: string, action: typeof loadingAction, sourceUrl: string | null) => {
    if (!originalImage || !sourceUrl) {
      setError(t.errorUpload);
      return;
    }

    setLoadingAction(action);
    setError(null);
    setIsBlemishModeActive(false);

    let finalPrompt = promptText;
    // Prepend face selection prompt if a face is selected
    if (selectedFaceIndex !== null && detectedFaces[selectedFaceIndex]) {
        finalPrompt = t.promptFaceSelection(detectedFaces[selectedFaceIndex]) + "\n\n" + promptText;
    }

    try {
      const imageToEdit = await dataUrlToFile(sourceUrl, 'source-image');

      const editedImage = await editImage(imageToEdit, finalPrompt);
      if (editedImage) {
        const newUrl = `data:${editedImage.mimeType};base64,${editedImage.data}`;
        setEditedImageUrl(newUrl);
        setHistory(prev => [...prev, newUrl]);
        setPeekState('off');
      } else {
        setError(t.errorNoImage);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t.errorUnknown);
    } finally {
      setLoadingAction(null);
      setLoadingFilter(null);
    }
  }, [originalImage, t, selectedFaceIndex, detectedFaces]);

  const handleEditRequest = useCallback(() => {
    if (!prompt) {
      setError(t.errorUploadAndPrompt);
      return;
    }
    setPreAdjustmentImageUrl(null);
    const sourceUrl = editedImageUrl || originalImageUrl;
    performEdit(prompt, 'edit', sourceUrl);
  }, [prompt, performEdit, t, editedImageUrl, originalImageUrl]);
  
  const handleQuickAction = useCallback((action: typeof loadingAction, promptText: string) => {
    setPreAdjustmentImageUrl(null);
    const sourceUrl = editedImageUrl || originalImageUrl;
    performEdit(promptText, action, sourceUrl);
  }, [performEdit, editedImageUrl, originalImageUrl]);

  const handleFilterRequest = useCallback((promptText: string, filterId: string) => {
    setPreAdjustmentImageUrl(null);
    setLoadingFilter(filterId);
    const sourceUrl = editedImageUrl || originalImageUrl;
    performEdit(promptText, 'filter', sourceUrl);
  }, [performEdit, editedImageUrl, originalImageUrl]);
  
  const handleBlemishSelect = useCallback((selection: { x: number, y: number, radius: number, width: number, height: number }) => {
    const blemishPrompt = t.promptBlemishRemoval(selection);
    setPreAdjustmentImageUrl(null);
    const sourceUrl = editedImageUrl || originalImageUrl;
    performEdit(blemishPrompt, 'blemish', sourceUrl);
  }, [performEdit, t, editedImageUrl, originalImageUrl]);

  const handleEyeColorRequest = useCallback(() => {
    if (!eyeColor) return;
    setPreAdjustmentImageUrl(null);
    const sourceUrl = editedImageUrl || originalImageUrl;
    performEdit(t.promptChangeEyeColor(eyeColor), 'eye_color', sourceUrl);
  }, [eyeColor, performEdit, t, editedImageUrl, originalImageUrl]);

  const handleAutoEnhanceRequest = () => handleQuickAction('auto', t.promptAutoEnhance);
  const handleRandomBackgroundRequest = () => handleQuickAction('background', t.promptRandomBackground);
  const handleEnhanceLightRequest = () => handleQuickAction('light', t.promptEnhanceLight);
  const handleRandomClothesRequest = () => handleQuickAction('clothes', t.promptRandomClothes);
  const handleHdRequest = () => handleQuickAction('hd', t.promptHd);
  const handleElfEarsRequest = () => handleQuickAction('elf_ears', t.promptElfEars);

  const handleAdjustmentChange = (adjustment: keyof typeof adjustments, value: number) => {
    setAdjustments(prev => ({ ...prev, [adjustment]: value }));
  };

  const handleApplyAdjustments = useCallback(() => {
    const activeAdjustments = Object.entries(adjustments).filter(([, value]) => value !== 0);
    if (activeAdjustments.length === 0) {
        setError(t.errorNoAdjustments);
        return;
    }

    const baselineUrl = preAdjustmentImageUrl || editedImageUrl || originalImageUrl;

    if (!preAdjustmentImageUrl) {
        setPreAdjustmentImageUrl(baselineUrl);
    }

    let promptParts: string[] = [];

    if (adjustments.smooth > 0) promptParts.push(t.promptSmoothSkin(adjustments.smooth));
    if (adjustments.slim > 0) promptParts.push(t.promptSlimDown(adjustments.slim));
    if (adjustments.jawline > 0) promptParts.push(t.promptJawline(adjustments.jawline));
    if (adjustments.skin_tone !== 0) promptParts.push(t.promptSkinTone(adjustments.skin_tone));
    if (adjustments.hourglass > 0) promptParts.push(t.promptHourglass(adjustments.hourglass));
    if (adjustments.eye_size > 0) promptParts.push(t.promptEyeSize(adjustments.eye_size));
    if (adjustments.plump_lips > 0) promptParts.push(t.promptPlumpLips(adjustments.plump_lips));
    if (adjustments.mouth_width !== 0) promptParts.push(t.promptMouthWidth(adjustments.mouth_width));
    if (adjustments.nose_bridge !== 0) promptParts.push(t.promptNoseBridge(adjustments.nose_bridge));
    if (adjustments.nose_width !== 0) promptParts.push(t.promptNoseWidth(adjustments.nose_width));
    if (adjustments.vignette > 0) promptParts.push(t.promptVignette(adjustments.vignette));

    if (adjustments.happy > 0 && adjustments.angry > 0) {
        promptParts.push(t.promptEmotionBalance(adjustments.happy, adjustments.angry));
    } else {
        if (adjustments.happy > 0) promptParts.push(t.promptMakeHappy(adjustments.happy));
        if (adjustments.angry > 0) promptParts.push(t.promptMakeAngry(adjustments.angry));
    }

    const combinedPrompt = t.promptBase + "\n- " + promptParts.join("\n- ");

    performEdit(combinedPrompt.trim(), 'adjust', baselineUrl);

  }, [adjustments, performEdit, t, editedImageUrl, originalImageUrl, preAdjustmentImageUrl]);

  const handleRevert = () => {
    // Reset image state
    setEditedImageUrl(null);
    setPreAdjustmentImageUrl(null);
    setHistory(prev => prev.length > 0 ? [prev[0]] : []);
    
    // Reset UI state
    setError(null);
    setPeekState('off');
    setAdjustments(initialAdjustments);
    setPrompt('');
    setIsBlemishModeActive(false);
    setEyeColor('#4682B4');
    setSelectedFaceIndex(detectedFaces.length > 0 ? 0 : null);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;

    const newHistory = history.slice(0, -1);
    setHistory(newHistory);

    if (newHistory.length === 1) {
      setEditedImageUrl(null);
    } else {
      setEditedImageUrl(newHistory[newHistory.length - 1]);
    }
    
    setPreAdjustmentImageUrl(null);
    setError(null);
    setPeekState('off');
  };
  
  const handlePeekToggle = () => {
    const canShowPrevious = history.length >= 2;
    
    setPeekState(prev => {
        if (prev === 'off') {
            return canShowPrevious ? 'previous' : 'original';
        }
        if (prev === 'previous') {
            return 'original';
        }
        return 'off';
    });
  };

  const handleFaceSelect = (index: number) => {
    setSelectedFaceIndex(index);
  };

  const hasAdjustments = Object.values(adjustments).some(v => v !== 0);
  const canUndo = history.length > 1;

  let imageUrlForDisplay;
  let titleForDisplay;

  if (isBlemishModeActive) {
      imageUrlForDisplay = originalImageUrl;
      titleForDisplay = t.original;
  } else {
      switch (peekState) {
          case 'original':
              imageUrlForDisplay = originalImageUrl;
              titleForDisplay = t.original;
              break;
          case 'previous':
              imageUrlForDisplay = history.length >= 2 ? history[history.length - 2] : originalImageUrl;
              titleForDisplay = t.previousEdit;
              break;
          case 'off':
          default:
              imageUrlForDisplay = editedImageUrl || originalImageUrl;
              titleForDisplay = editedImageUrl ? t.edited : t.original;
              break;
      }
  }


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col landscape:flex-row md:flex-row landscape:items-start md:items-start gap-8">
        
        <div className="w-full landscape:w-1/2 md:w-1/2 landscape:sticky md:sticky landscape:top-24 md:top-24 flex flex-col gap-4">
           <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleUndo}
                disabled={!canUndo || isLoading || isBlemishModeActive}
                className="w-full flex justify-center items-center py-3 px-4 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none"
                aria-label={t.undoAriaLabel}
              >
                ↶ {t.undo}
              </button>
              <button
                onClick={handleRevert}
                disabled={!editedImageUrl || isLoading || isBlemishModeActive}
                className="w-full flex justify-center items-center py-3 px-4 bg-slate-600 hover:bg-slate-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none"
                aria-label={t.revertAriaLabel}
              >
                ↩️ {t.revertToOriginal}
              </button>
            </div>
            {!!editedImageUrl && !isLoading && !isBlemishModeActive && (
              <p className="text-center text-xs text-gray-400 animate-pulse -mb-2">{t.peekHint}</p>
            )}
            {detectedFaces.length > 1 && !isBlemishModeActive && (
                 <p className="text-center text-xs text-cyan-300 -mb-2">{t.selectFaceHint}</p>
            )}
           <ImageDisplay 
            title={titleForDisplay}
            imageUrl={imageUrlForDisplay}
            isLoading={isLoading}
            isDownloadable={!!editedImageUrl && !isLoading && !isBlemishModeActive && peekState === 'off'}
            originalFileType={originalImage?.type ?? null}
            isBlemishModeActive={isBlemishModeActive}
            onBlemishSelect={handleBlemishSelect}
            blemishBrushRadius={blemishBrushSize}
            isPeeking={peekState !== 'off'}
            isPeekingEnabled={history.length > 1 && !isLoading && !isBlemishModeActive}
            onPeekToggle={handlePeekToggle}
            detectedFaces={detectedFaces}
            selectedFaceIndex={selectedFaceIndex}
            onFaceSelect={handleFaceSelect}
          />
        </div>
        
        <div className="w-full landscape:w-1/2 md:w-1/2">
            <div className="w-full bg-gray-800 rounded-xl shadow-2xl p-6">
               <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">{t.controls}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                 <div className="flex flex-col space-y-6">
                   <ImageUploader onImageSelect={handleImageSelect} />
                   <div className="w-full">
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
                      {t.editingInstructions}
                    </label>
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={t.promptPlaceholder}
                      className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                      disabled={isLoading || isBlemishModeActive}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleEditRequest}
                      disabled={!originalImage || !prompt || isLoading || isBlemishModeActive}
                      className="w-full flex justify-center items-center py-3 px-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none"
                    >
                      {loadingAction === 'edit' ? <><Spinner /> {t.processing}...</> : t.applyEdits}
                    </button>
                  </div>
                 </div>

                 <div className="flex flex-col space-y-6">
                    <div>
                      <h3 className="text-center text-sm text-gray-400 font-semibold mb-3">{t.tools}</h3>
                       <button
                        onClick={() => setIsBlemishModeActive(prev => !prev)}
                        disabled={!originalImage || isLoading}
                        className={`w-full flex justify-center items-center py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none ${
                          isBlemishModeActive
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } disabled:bg-gray-600 disabled:cursor-not-allowed`}
                        aria-pressed={isBlemishModeActive}
                        aria-label={t.blemishRemoverAriaLabel}
                      >
                        {loadingAction === 'blemish' ? <><Spinner /> {t.processing}...</> : (isBlemishModeActive ? `🚫 ${t.cancelBlemish}` : `✨ ${t.blemishRemover}`)}
                      </button>
                      {isBlemishModeActive && (
                          <div className="mt-4 space-y-2 bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-center text-sm text-cyan-300 animate-pulse">{t.blemishInstruction}</p>
                              <AdjustmentSlider 
                                  id="blemish-brush-size-slider" 
                                  label={t.brushSize} 
                                  value={blemishBrushSize} 
                                  onChange={setBlemishBrushSize}
                                  min={5}
                                  max={50}
                                  step={1}
                              />
                          </div>
                      )}
                    </div>

                    <div>
                       <h3 className="text-center text-sm text-gray-400 font-semibold mb-3">{t.quickActions}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm font-semibold rounded-lg overflow-hidden">
                           <button onClick={handleAutoEnhanceRequest} disabled={!originalImage || isLoading || isBlemishModeActive} className="flex justify-center items-center py-3 px-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600" aria-label={t.enhanceAriaLabel}>
                            {loadingAction === 'auto' ? <><Spinner /> {t.enhancing}...</> : `🪄 ${t.enhance}`}
                          </button>
                          <button onClick={handleHdRequest} disabled={!originalImage || isLoading || isBlemishModeActive} className="flex justify-center items-center py-3 px-2 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-600" aria-label={t.hdAriaLabel}>
                            {loadingAction === 'hd' ? <><Spinner /> {t.applyingHd}...</> : `💎 ${t.hd}`}
                          </button>
                          <button onClick={handleEnhanceLightRequest} disabled={!originalImage || isLoading || isBlemishModeActive} className="flex justify-center items-center py-3 px-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600" aria-label={t.lightAriaLabel}>
                            {loadingAction === 'light' ? <><Spinner /> {t.lighting}...</> : `💡 ${t.light}`}
                          </button>
                          <button onClick={handleRandomClothesRequest} disabled={!originalImage || isLoading || isBlemishModeActive} className="flex justify-center items-center py-3 px-2 bg-slate-500 hover:bg-slate-600 disabled:bg-gray-600" aria-label={t.clothesAriaLabel}>
                            {loadingAction === 'clothes' ? <><Spinner /> {t.changing}...</> : `👕 ${t.clothes}`}
                          </button>
                          <button onClick={handleRandomBackgroundRequest} disabled={!originalImage || isLoading || isBlemishModeActive} className="col-span-2 flex justify-center items-center py-3 px-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600" aria-label={t.randomBGAriaLabel}>
                            {loadingAction === 'background' ? <><Spinner /> {t.changing}...</> : `🌌 ${t.randomBG}`}
                          </button>
                        </div>
                    </div>

                 </div>

                 <div className="md:col-span-2 flex flex-col space-y-6">
                    <div>
                       <h3 className="text-center text-sm text-gray-400 font-semibold mb-3">{t.adjustments}</h3>
                       
                        {/* Tab Navigation */}
                        <div className="flex flex-wrap border-b border-gray-700 mb-4">
                            <button onClick={() => setActiveTab('face')} className={`flex-1 py-2 text-xs sm:text-sm font-medium transition-colors ${ activeTab === 'face' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white' }`} aria-pressed={activeTab === 'face'}>{t.tabFace}</button>
                            <button onClick={() => setActiveTab('nose')} className={`flex-1 py-2 text-xs sm:text-sm font-medium transition-colors ${ activeTab === 'nose' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white' }`} aria-pressed={activeTab === 'nose'}>{t.tabNose}</button>
                            <button onClick={() => setActiveTab('mouth')} className={`flex-1 py-2 text-xs sm:text-sm font-medium transition-colors ${ activeTab === 'mouth' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white' }`} aria-pressed={activeTab === 'mouth'}>{t.tabMouth}</button>
                            <button onClick={() => setActiveTab('eyes')} className={`flex-1 py-2 text-xs sm:text-sm font-medium transition-colors ${ activeTab === 'eyes' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white' }`} aria-pressed={activeTab === 'eyes'}>{t.tabEyes}</button>
                            <button onClick={() => setActiveTab('fun_effects')} className={`flex-1 py-2 text-xs sm:text-sm font-medium transition-colors ${ activeTab === 'fun_effects' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white' }`} aria-pressed={activeTab === 'fun_effects'}>{t.tabFunEffects}</button>
                            <button onClick={() => setActiveTab('filters')} className={`flex-1 py-2 text-xs sm:text-sm font-medium transition-colors ${ activeTab === 'filters' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white' }`} aria-pressed={activeTab === 'filters'}>{t.tabFilters}</button>
                        </div>

                        <div className="space-y-4">
                            {activeTab === 'face' && (
                                <>
                                    <AdjustmentSlider id="smooth-slider" label={t.smoothLabel} value={adjustments.smooth} onChange={v => handleAdjustmentChange('smooth', v)} disabled={!originalImage || isLoading || isBlemishModeActive} />
                                    <AdjustmentSlider id="slim-slider" label={t.slimLabel} value={adjustments.slim} onChange={v => handleAdjustmentChange('slim', v)} disabled={!originalImage || isLoading || isBlemishModeActive} />
                                    <AdjustmentSlider id="jawline-slider" label={t.jawlineLabel} value={adjustments.jawline} onChange={v => handleAdjustmentChange('jawline', v)} disabled={!originalImage || isLoading || isBlemishModeActive} />
                                    <AdjustmentSlider id="skin-tone-slider" label={t.skinToneLabel} value={adjustments.skin_tone} onChange={v => handleAdjustmentChange('skin_tone', v)} disabled={!originalImage || isLoading || isBlemishModeActive} min={-5} max={5} />
                                </>
                            )}
                            {activeTab === 'nose' && (
                                <>
                                    <AdjustmentSlider id="nose-bridge-slider" label={t.noseBridgeLabel} value={adjustments.nose_bridge} onChange={v => handleAdjustmentChange('nose_bridge', v)} disabled={!originalImage || isLoading || isBlemishModeActive} min={-5} max={5} />
                                    <AdjustmentSlider id="nose-width-slider" label={t.noseWidthLabel} value={adjustments.nose_width} onChange={v => handleAdjustmentChange('nose_width', v)} disabled={!originalImage || isLoading || isBlemishModeActive} min={-5} max={5} />
                                </>
                            )}
                            {activeTab === 'mouth' && (
                                <>
                                    <AdjustmentSlider id="lips-slider" label={t.plumpLipsLabel} value={adjustments.plump_lips} onChange={v => handleAdjustmentChange('plump_lips', v)} disabled={!originalImage || isLoading || isBlemishModeActive} />
                                    <AdjustmentSlider id="mouth-width-slider" label={t.mouthWidthLabel} value={adjustments.mouth_width} onChange={v => handleAdjustmentChange('mouth_width', v)} disabled={!originalImage || isLoading || isBlemishModeActive} min={-5} max={5} />
                                </>
                            )}
                             {activeTab === 'eyes' && (
                                <div className="space-y-4">
                                    <AdjustmentSlider id="eye-size-slider" label={t.eyeSizeLabel} value={adjustments.eye_size} onChange={v => handleAdjustmentChange('eye_size', v)} disabled={!originalImage || isLoading || isBlemishModeActive} />
                                    <div className="border-t border-gray-700 my-4"></div>
                                    <div className="flex flex-col space-y-3">
                                      <label htmlFor="eye-color-picker" className="text-sm font-medium text-gray-400">{t.eyeColorLabel}</label>
                                      <div className="flex items-center gap-4">
                                        <input
                                            id="eye-color-picker"
                                            type="color"
                                            value={eyeColor}
                                            onChange={e => setEyeColor(e.target.value)}
                                            disabled={!originalImage || isLoading || isBlemishModeActive}
                                            className="w-12 h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label={t.eyeColorLabel}
                                        />
                                        <div 
                                            className="w-full h-10 rounded-md border border-gray-600"
                                            style={{ backgroundColor: eyeColor }}
                                            aria-hidden="true"
                                        ></div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={handleEyeColorRequest}
                                      disabled={!originalImage || isLoading || isBlemishModeActive}
                                      className="w-full flex justify-center items-center py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-300"
                                    >
                                      {loadingAction === 'eye_color' ? <><Spinner /> {t.changingEyeColor}...</> : `🎨 ${t.changeEyeColor}`}
                                    </button>
                                </div>
                            )}
                            {activeTab === 'fun_effects' && (
                                <div className="space-y-4">
                                    <AdjustmentSlider id="hourglass-slider" label={t.hourglassLabel} value={adjustments.hourglass} onChange={v => handleAdjustmentChange('hourglass', v)} disabled={!originalImage || isLoading || isBlemishModeActive} />
                                    <div className="border-t border-gray-700 my-4"></div>
                                    <AdjustmentSlider id="happy-slider" label={t.happyLabel} value={adjustments.happy} onChange={v => handleAdjustmentChange('happy', v)} disabled={!originalImage || isLoading || isBlemishModeActive} />
                                    <AdjustmentSlider id="angry-slider" label={t.angryLabel} value={adjustments.angry} onChange={v => handleAdjustmentChange('angry', v)} disabled={!originalImage || isLoading || isBlemishModeActive} />
                                    <div className="border-t border-gray-700 my-4"></div>
                                    <button
                                      onClick={handleElfEarsRequest}
                                      disabled={!originalImage || isLoading || isBlemishModeActive}
                                      aria-label={t.elfEarsAriaLabel}
                                      className="w-full flex justify-center items-center py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-300"
                                    >
                                      {loadingAction === 'elf_ears' ? <><Spinner /> {t.elfing}...</> : `🧝 ${t.elfEars}`}
                                    </button>
                                </div>
                            )}
                            {activeTab === 'filters' && (
                                <div className="space-y-4">
                                    <AdjustmentSlider id="vignette-slider" label={t.vignetteLabel} value={adjustments.vignette} onChange={v => handleAdjustmentChange('vignette', v)} disabled={!originalImage || isLoading || isBlemishModeActive} />
                                    <div className="border-t border-gray-700 my-4"></div>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
                                        {filters.map(filter => (
                                            <button
                                                key={filter.id}
                                                onClick={() => handleFilterRequest(t[filter.promptKey as keyof typeof t], filter.id)}
                                                disabled={!originalImage || isLoading || isBlemishModeActive}
                                                className="text-xs sm:text-sm px-2 py-3 bg-gray-700 hover:bg-cyan-700 disabled:bg-gray-600 rounded-md transition-colors flex justify-center items-center"
                                            >
                                                {loadingAction === 'filter' && loadingFilter === filter.id ? 
                                                    <><Spinner /> <span className="ml-2 hidden sm:inline">{t.applyingFilter}...</span></> : 
                                                    t[filter.labelKey as keyof typeof t]
                                                }
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                     <button
                      onClick={handleApplyAdjustments}
                      disabled={!originalImage || !hasAdjustments || isLoading || isBlemishModeActive}
                      className="w-full flex justify-center items-center py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none"
                    >
                      {loadingAction === 'adjust' ? <><Spinner /> {t.adjusting}...</> : t.applyAdjustments}
                    </button>
                 </div>
               </div>
               {error && <p className="mt-6 text-red-400 bg-red-900/50 p-3 rounded-lg text-sm text-center md:col-span-2">{error}</p>}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;