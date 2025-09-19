// FIX: Removed invalid React component from this file.
const en = {
  // Header
  appTitle: "Violachik's Photo Editor",
  poweredBy: "Powered by Gemini Nano",
  settings: "Settings",
  settingsAriaLabel: "Open settings",
  exit: "Exit Application",
  exitAriaLabel: "Exit application",
  exitConfirmation: "Are you sure you want to exit the application?",

  // Settings Modal
  language: "Language",
  close: "Close",

  // Controls Panel
  controls: "Controls",
  editingInstructions: "Editing Instructions",
  promptPlaceholder: "e.g., 'Add a small, friendly robot next to the cat'",
  applyEdits: "Apply Edits",
  revertToOriginal: "Revert to Original",
  revertAriaLabel: "Revert to original image",
  undo: "Undo",
  undoAriaLabel: "Undo the last action",
  tools: "Tools",
  quickActions: "Quick Actions",
  adjustments: "Adjustments",
  applyAdjustments: "Apply Adjustments",

  // Image Uploader
  uploadOrDrop: "Click to upload or drag & drop",
  uploadHint: "PNG, JPG, WEBP, etc.",
  fileLabel: "File:",

  // Image Display
  original: "Original",
  edited: "Edited",
  previousEdit: "Previous Edit",
  generatingImage: "Generating new image",
  imagePlaceholder: (title: string) => `${title} image will appear here`,
  downloadImage: "Download Image",
  downloadAriaLabel: "Download the edited image",
  peekHint: "click to view previous or original",
  selectFaceHint: "Multiple faces detected. Click a face to select it for editing.",

  // Tools
  blemishRemover: "Blemish Remover",
  blemishRemoverAriaLabel: "Activate blemish removal tool. Click on the original image to select a blemish.",
  cancelBlemish: "Cancel",
  blemishInstruction: "Click on the original image to remove a blemish.",
  brushSize: "Brush Size",

  // Quick Action Buttons & Loading States
  enhance: "Enhance",
  enhancing: "Enhancing",
  enhanceAriaLabel: "Automatically enhance the image",
  hd: "HD",
  applyingHd: "Applying HD",
  hdAriaLabel: "Apply a high definition effect",
  light: "Light",
  lighting: "Lighting",
  lightAriaLabel: "Enhance the lighting of the photo",
  clothes: "Clothes",
  changing: "Changing",
  clothesAriaLabel: "Change the subject's clothes to a random outfit",
  randomBG: "Random BG",
  randomBGAriaLabel: "Change the background to a random intriguing scene",
  processing: "Processing",
  adjusting: "Adjusting",
  applyingFilter: "Applying",
  changingEyeColor: "Changing",
  elfEars: "Elf Ears",
  elfing: "Elfing",
  elfEarsAriaLabel: "Give the subject elf ears",

  // Adjustment Sliders & Tabs
  tabFace: "Face",
  tabBody: "Body",
  tabNose: "Nose",
  tabMouth: "Mouth",
  tabEyes: "Eyes",
  tabEffects: "Effects",
  tabFunEffects: "Fun Effects",
  tabFilters: "Filters",
  smoothLabel: "Smooth Skin",
  slimLabel: "Slim Down",
  jawlineLabel: "Define Jawline",
  skinToneLabel: "Skin Tone",
  hourglassLabel: "Hourglass Figure",
  eyeSizeLabel: "Eye Size",
  eyeColorLabel: "Eye Color",
  changeEyeColor: "Change Eye Color",
  plumpLipsLabel: "Plump Lips",
  mouthWidthLabel: "Mouth Width",
  noseBridgeLabel: "Nose Bridge Depth",
  noseWidthLabel: "Nose Width",
  vignetteLabel: "Vignette Intensity",
  happyLabel: "Happy",
  angryLabel: "Angry",
  
  // Errors
  errorUploadAndPrompt: 'Please upload an image and provide an editing prompt.',
  errorNoImage: 'The model did not return an image. Please try again.',
  errorUnknown: 'An unknown error occurred.',
  errorUpload: 'Please upload an image first.',
  errorImageFile: 'Please select an image file.',
  errorNoAdjustments: 'Please move a slider before applying adjustments.',
  
  // AI Prompts
  promptFaceSelection: (box: { x: number, y: number, width: number, height: number }) => `Critically important: Confine all of the following edits *exclusively* to the person within the rectangular region defined by the top-left corner (x=${Math.round(box.x)}, y=${Math.round(box.y)}) and dimensions (width=${Math.round(box.width)}, height=${Math.round(box.height)}). Do not alter any part of the image outside this specific region.`,
  promptBlemishRemoval: (selection: { x: number, y: number, radius: number, width: number, height: number }) => `The image is ${selection.width}x${selection.height} pixels. In the circular area with a radius of ${selection.radius} pixels centered at coordinates (${selection.x}, ${selection.y}), remove any blemish, mole, or skin imperfection. The correction must be seamless and blend perfectly with the surrounding skin texture, preserving the natural look. Do not alter any other part of the image.`,
  promptAutoEnhance: "Perform a comprehensive, professional-grade enhancement of this photograph. The goal is to make it look as if it were captured with a high-end professional camera. This involves: removing all blurriness and grain to achieve maximum clarity and sharpness; correcting any low-light issues by balancing the exposure, lifting shadows, and recovering highlights; fixing any lens distortion for a natural perspective; and performing professional color grading to make colors vibrant yet realistic. The final image must be crisp, clear, and perfectly lit.",
  promptRandomBackground: "Perform a photorealistic background replacement. Identify the main person and replace the background with an extremely realistic scene like a forest, city, or mountain range. Crucially, also subtly alter the main subject's pose—a slight head tilt, a different arm position, or a shift in posture. Throughout this transformation, ensure the subject is looking directly at the camera with a gentle, closed-mouth smile. This will make it appear as if this is an entirely new photograph taken in the new location. The final image must be indistinguishable from a real photograph. Pay meticulous attention to matching the lighting, shadows, and perspective between the subject and the new background. The integration must be seamless, with no 'cut-out' look.",
  promptEnhanceLight: "Enhance the lighting of this photo. Brighten up dark areas and balance the highlights to create a well-lit, professional-looking image. Improve the overall exposure without washing out the colors or details. The result should look natural and vibrant.",
  promptRandomClothes: "Identify the main person in the photo and change their clothes to a completely new, random outfit. The style can be anything from casual to formal to futuristic, but it should fit the person and the overall scene plausibly. Ensure the new clothing looks realistic and seamlessly integrated.",
  promptHd: "Apply a high-definition (HD) effect to this photo. Enhance the dynamic range by making the darks darker and the lights brighter, without losing detail in the shadows or highlights. Increase local contrast and sharpness to bring out fine details and textures. The final image should look crisp, clear, and more defined, similar to an HDR photo.",
  promptElfEars: "Photorealistically transform the main subject's ears into those of a fantasy elf. The ears should be elongated, raised slightly on the head, and taper to a distinct point. The transformation must look natural and seamless, blending perfectly with the subject's skin, head shape, and hair. Do not change any other facial features.",

  // Slider Prompts
  promptBase: "Apply the following photorealistic adjustments to the main subject. Blend all changes seamlessly and ensure the final result is anatomically plausible and natural-looking.",
  promptChangeEyeColor: (color: string) => `Realistically change the eye color of the main subject to the hex color ${color}. The change must be photorealistic, preserving natural reflections, shadows, and eye texture. Do not change the eye shape or size. The result should look completely natural.`,
  promptVignette: (level: number) => {
    if (level <= 3) {
      return `Apply a subtle, dark vignette effect with an intensity of ${level} out of 10. The corners should be slightly darkened with a very soft, gradual feathering to gently draw focus to the center.`;
    }
    if (level <= 7) {
      return `Apply a moderate, dark vignette effect with an intensity of ${level} out of 10. The corners and edges should be noticeably darkened, with a soft gradient, to create a clear focus on the subject.`;
    }
    return `Apply a strong and dramatic dark vignette effect with an intensity of ${level} out of 10. Significantly darken the corners and edges to create a powerful, focused, and moody atmosphere, ensuring the effect has a soft, gradual feathering to avoid a hard-edged, artificial look.`;
  },
  promptSmoothSkin: (level: number) => {
    if (level <= 3) {
      return `Subtly smooth the main subject's skin texture to reduce minor blemishes, with an intensity of ${level} out of 10. The result must be extremely natural, preserving fine pores and skin details to look like light, professional retouching.`;
    }
    if (level <= 7) {
      return `Smooth the subject's skin texture to reduce blemishes and fine lines, with an intensity of ${level} out of 10. Aim for a clear complexion but ensure you preserve realistic skin texture like pores to avoid an artificial or plastic look.`;
    }
    return `Significantly smooth the subject's skin texture for a flawless, high-fashion finish, with an intensity of ${level} out of 10. Greatly reduce blemishes, fine lines, and pores, but critically, retain a hint of natural skin texture to ensure the result looks like expert airbrushing, not a simple blur filter.`;
  },
  promptSlimDown: (level: number) => {
    if (level <= 3) {
      return `Subtly slim the subject's face and figure, with an intensity of ${level} out of 10. The change should be barely perceptible and must respect the natural bone structure.`;
    }
    if (level <= 7) {
      return `Moderately slim the subject's face and figure, with an intensity of ${level} out of 10. The effect should be noticeable but must look very natural, maintaining their identity and respecting their underlying bone structure.`;
    }
    return `Significantly slim the subject's face and figure, with an intensity of ${level} out of 10. Create a noticeably thinner appearance in the jawline, cheeks, and body, while ensuring the final result is anatomically plausible and maintains the person's core identity.`;
  },
  promptHourglass: (level: number) => {
    let magnitude;
    if (level <= 3) magnitude = 'Subtly';
    else if (level <= 7) magnitude = 'Moderately';
    else magnitude = 'Significantly';
    return `${magnitude} enhance the main subject's hourglass figure with an intensity of ${level} out of 10. This involves cinching the waist while enhancing the curves of the hips and bust. The final result must be photorealistic, anatomically plausible, and natural-looking, respecting the subject's original body type.`;
  },
  promptJawline: (level: number) => `Apply a facial geometry adjustment. Target: jawline. Action: define and sharpen. Intensity: ${level}/10. The result must be photorealistic and anatomically correct.`,
  promptSkinTone: (level: number) => {
    const intensity = Math.abs(level);
    const direction = level < 0 ? 'warmer and slightly darker' : 'cooler and slightly lighter';
    const toneDesc = level < 0 ? '(e.g., more golden/tan)' : '(e.g., more pale/ivory)';
    let magnitude;
    if (intensity <= 2) magnitude = 'subtly';
    else if (intensity <= 4) magnitude = 'moderately';
    else magnitude = 'significantly';
    return `${magnitude.charAt(0).toUpperCase() + magnitude.slice(1)} adjust the subject's skin tone to be ${direction} ${toneDesc}, with an intensity of ${intensity} out of 5. The change must look completely natural and realistic, preserving the underlying skin texture and features.`;
  },
  promptEyeSize: (level: number) => `Apply a facial geometry adjustment. Target: eyes. Action: enlarge. Intensity: ${level}/10. The result must be photorealistic and anatomically correct, maintaining realistic proportions.`,
  promptPlumpLips: (level: number) => `Apply a facial geometry adjustment. Target: lips. Action: increase volume (plumpness). Intensity: ${level}/10. The result must be photorealistic and anatomically correct, preserving natural texture.`,
  promptMouthWidth: (level: number) => `Apply a facial geometry adjustment. Target: mouth width. Action: adjust width. Value: ${level}. Min: -5, Max: 5. A positive value means wider, a negative value means narrower. The result must be photorealistic and anatomically plausible.`,
  promptNoseBridge: (level: number) => `Apply a facial geometry adjustment. Target: nose bridge. Action: adjust depth. Value: ${level}. Min: -5, Max: 5. A positive value means deeper/more defined, a negative value means shallower/less defined. The result must be photorealistic and anatomically plausible.`,
  promptNoseWidth: (level: number) => `Apply a facial geometry adjustment. Target: nose width. Action: adjust width. Value: ${level}. Min: -5, Max: 5. A positive value means wider, a negative value means narrower. The result must be photorealistic and anatomically plausible.`,
  promptMakeHappy: (level: number) => {
    if (level <= 3) {
      return `Introduce a subtle, gentle, closed-mouth smile, with an intensity of ${level} out of 10. The eyes should show a hint of warmth. The expression must be one of quiet, genuine contentment.`;
    }
    if (level <= 7) {
      return `Introduce a genuine happy expression with a clear but natural smile (perhaps showing a little teeth), with an intensity of ${level} out of 10. The eyes must crinkle slightly at the corners to create an authentic 'Duchenne smile'.`;
    }
    return `Introduce a very joyful, beaming smile, showing teeth, with an intensity of ${level} out of 10. The entire face must be engaged in the expression, with authentically happy, crinkled eyes and raised cheeks. The expression should be one of pure, unforced delight.`;
  },
  promptMakeAngry: (level: number) => {
    if (level <= 3) {
      return `Introduce a subtle, realistic expression of annoyance or concentration, with an intensity of ${level} out of 10. Slightly furrow the brows and tighten the mouth. The change should be very minimal and natural.`;
    }
    if (level <= 7) {
      return `Introduce a clear but realistic angry expression, with an intensity of ${level} out of 10. Lower and draw the eyebrows together, and set the mouth in a firm line or a slight downturn. The look should be one of definite, authentic displeasure.`;
    }
    return `Introduce a strong but realistic angry expression, with an intensity of ${level} out of 10. Deeply furrow the brows, create a hard stare in the eyes, and show a snarl or a tightly pressed mouth. The entire facial musculature should be engaged to reflect genuine rage or fury.`;
  },
  promptEmotionBalance: (happy: number, angry: number) => {
    const totalIntensity = Math.round((happy + angry) / 2);
    let description: string;

    if (happy > angry) {
      description = `Create a complex, realistic facial expression that is primarily happy with an undercurrent of anger or determination, like a triumphant smirk or a look of confident defiance. Blend happiness (intensity ${happy}/10) with anger (intensity ${angry}/10).`
    } else if (angry > happy) {
      description = `Create a complex, realistic facial expression that is primarily angry but with a hint of pleasure or satisfaction, like a look of vengeful glee or scornful superiority. Blend anger (intensity ${angry}/10) with happiness (intensity ${happy}/10).`
    } else { // they are equal
      description = `Create a complex, balanced, and realistic facial expression that equally blends happiness and anger, resulting in a look of intense rivalry, determined challenge, or mischievous defiance. Blend happiness (intensity ${happy}/10) with anger (intensity ${angry}/10).`
    }
    
    if (totalIntensity >= 8) {
      description += " The expression should be strong and dramatic, but still look authentic.";
    } else if (totalIntensity >= 4) {
      description += " The expression should be clear and noticeable, but still look authentic.";
    } else {
      description += " The expression should be subtle and authentic.";
    }
    
    return description;
  },
  
  // Filter Labels
  filterSepia: "Sepia",
  filterBlackAndWhite: "B & W",
  filterVintage: "Vintage",
  filterLomo: "Lomo",
  filterClarendon: "Clarendon",
  filterGingham: "Gingham",
  filterMoon: "Moon",
  filterCinematic: "Cinematic",
  filterWarm: "Warm",
  filterCool: "Cool",
  filterGrayscale: "Grayscale",
  filterInvert: "Invert",
  filterSolarize: "Solarize",
  filterPopArt: "Pop Art",
  filterNeonPunk: "Neon Punk",
  filterInfrared: "Infrared",
  filterDuotone: "Duotone",
  filterSketch: "Sketch",
  filterWatercolor: "Watercolor",

  // Filter Prompts
  promptFilterSepia: "Apply a classic sepia filter to the image, giving it a warm, brownish monochrome tone reminiscent of old photographs.",
  promptFilterBlackAndWhite: "Convert the image to a high-contrast black and white. Make the blacks deep and the whites bright to create a dramatic, punchy monochrome effect.",
  promptFilterVintage: "Give the image a vintage film look. Desaturate the colors slightly, add a subtle yellow or warm tint, and apply a light, fine grain. The result should feel like a photo from the 1970s.",
  promptFilterLomo: "Apply a Lomo effect, characterized by high saturation, boosted contrast, noticeable vignetting, and slightly unpredictable color shifts. The image should look vibrant and stylized.",
  promptFilterClarendon: "Apply a Clarendon-style filter: boost the saturation and contrast, and add a distinct cyan tint to the lighter areas of the image, making colors pop.",
  promptFilterGingham: "Apply a Gingham-style filter: give the image a washed-out, slightly desaturated look with a subtle warm, hazy feel. The result should be soft and nostalgic.",
  promptFilterMoon: "Apply a Moon-style filter: convert the image to a cool-toned, desaturated black and white, giving it a somber and moody atmosphere.",
  promptFilterCinematic: "Apply a cinematic, teal and orange color grade. Shift the shadows and darker tones towards teal/blue and the highlights and skin tones towards orange for a modern movie look.",
  promptFilterWarm: "Enhance the image with a warm, sunny glow. Boost the yellow and orange tones to make the scene feel brighter and more inviting, like it was shot during a golden hour.",
  promptFilterCool: "Give the image a cool, blueish tint. Enhance the blues and cyans to create a calm, moody, or cold atmosphere.",
  promptFilterGrayscale: "Convert the image to a standard, balanced grayscale with a full range of tones from pure black to pure white.",
  promptFilterInvert: "Invert all the colors in the image, creating a photo-negative effect.",
  promptFilterSolarize: "Apply a solarization effect, inverting the tones of the image for pixels above a certain brightness threshold, creating a surreal, metallic look.",
  promptFilterPopArt: "Transform the image into a Pop Art style reminiscent of Andy Warhol. Use a limited palette of bright, blocky, highly saturated colors and strong outlines.",
  promptFilterNeonPunk: "Give the image a vibrant, futuristic Neon Punk or Cyberpunk aesthetic. Drench the scene in saturated neon colors, especially pinks, cyans, and purples, and boost the contrast.",
  promptFilterInfrared: "Simulate the look of infrared photography. Make green foliage (trees, grass) appear white or very light, and darken the sky. The result should be surreal and dreamlike.",
  promptFilterDuotone: "Convert the image to a duotone. Replace the shadows with a deep purple color and the highlights with a bright yellow color, creating a bold, graphic effect.",
  promptFilterSketch: "Transform the photo into a realistic-looking pencil sketch. The result should appear hand-drawn, with clear outlines, shading, and texture.",
  promptFilterWatercolor: "Convert the image into a watercolor painting. The colors should bleed slightly into each other, and the overall texture should resemble paint on paper.",
};

const ru: typeof en = {
  // Header
  appTitle: "Фоторедактор Violachik",
  poweredBy: "На базе Gemini Nano",
  settings: "Настройки",
  settingsAriaLabel: "Открыть настройки",
  exit: "Выйти из приложения",
  exitAriaLabel: "Выйти из приложения",
  exitConfirmation: "Вы уверены, что хотите выйти из приложения?",

  // Settings Modal
  language: "Язык",
  close: "Закрыть",

  // Controls Panel
  controls: "Управление",
  editingInstructions: "Инструкции по редактированию",
  promptPlaceholder: "Например, 'Добавь маленького робота рядом с кошкой'",
  applyEdits: "Применить",
  revertToOriginal: "Вернуть оригинал",
  revertAriaLabel: "Вернуть оригинальное изображение",
  undo: "Отменить",
  undoAriaLabel: "Отменить последнее действие",
  tools: "Инструменты",
  quickActions: "Быстрые действия",
  adjustments: "Регулировки",
  applyAdjustments: "Применить регулировки",

  // Image Uploader
  uploadOrDrop: "Нажмите или перетащите файл для загрузки",
  uploadHint: "PNG, JPG, WEBP и т.д.",
  fileLabel: "Файл:",

  // Image Display
  original: "Оригинал",
  edited: "Отредактировано",
  previousEdit: "Предыдущее изменение",
  generatingImage: "Создание изображения",
  imagePlaceholder: (title: string) => `Изображение «${title.toLowerCase()}» появится здесь`,
  downloadImage: "Скачать",
  downloadAriaLabel: "Скачать отредактированное изображение",
  peekHint: "нажмите, чтобы просмотреть предыдущее или оригинальное",
  selectFaceHint: "Обнаружено несколько лиц. Нажмите на лицо, чтобы выбрать его для редактирования.",

  // Tools
  blemishRemover: "Удаление дефектов",
  blemishRemoverAriaLabel: "Активировать инструмент для удаления дефектов. Нажмите на оригинальное изображение, чтобы выбрать дефект.",
  cancelBlemish: "Отмена",
  blemishInstruction: "Нажмите на оригинальное изображение, чтобы удалить дефект.",
  brushSize: "Размер кисти",

  // Quick Action Buttons & Loading States
  enhance: "Улучшить",
  enhancing: "Улучшение",
  enhanceAriaLabel: "Автоматически улучшить изображение",
  hd: "HD",
  applyingHd: "Применение HD",
  hdAriaLabel: "Применить эффект высокого разрешения",
  light: "Свет",
  lighting: "Освещение",
  lightAriaLabel: "Улучшить освещение на фото",
  clothes: "Одежда",
  changing: "Изменение",
  clothesAriaLabel: "Сменить одежду объекта на случайный наряд",
  randomBG: "Случ. фон",
  randomBGAriaLabel: "Сменить фон на случайную интригующую сцену",
  processing: "Обработка",
  adjusting: "Регулировка",
  applyingFilter: "Применение",
  changingEyeColor: "Изменение",
  elfEars: "Эльфийские уши",
  elfing: "Создание ушей",
  elfEarsAriaLabel: "Сделать уши как у эльфа",

  // Adjustment Sliders & Tabs
  tabFace: "Лицо",
  tabBody: "Тело",
  tabNose: "Нос",
  tabMouth: "Рот",
  tabEyes: "Глаза",
  tabEffects: "Эффекты",
  tabFunEffects: "Забавные эффекты",
  tabFilters: "Фильтры",
  smoothLabel: "Гладкая кожа",
  slimLabel: "Сделать стройнее",
  jawlineLabel: "Очертить челюсть",
  skinToneLabel: "Тон кожи",
  hourglassLabel: "Фигура 'Песочные часы'",
  eyeSizeLabel: "Размер глаз",
  eyeColorLabel: "Цвет глаз",
  changeEyeColor: "Изменить цвет глаз",
  plumpLipsLabel: "Увеличить губы",
  mouthWidthLabel: "Ширина рта",
  noseBridgeLabel: "Глубина переносицы",
  noseWidthLabel: "Ширина носа",
  vignetteLabel: "Интенсивность виньетки",
  happyLabel: "Счастливый",
  angryLabel: "Злой",

  // Errors
  errorUploadAndPrompt: 'Пожалуйста, загрузите изображение и введите запрос для редактирования.',
  errorNoImage: 'Модель не вернула изображение. Пожалуйста, попробуйте снова.',
  errorUnknown: 'Произошла неизвестная ошибка.',
  errorUpload: 'Пожалуйста, сначала загрузите изображение.',
  errorImageFile: 'Пожалуйста, выберите файл изображения.',
  errorNoAdjustments: 'Пожалуйста, передвиньте ползунок перед применением регулировок.',

  // AI Prompts (Kept in English for the model)
  ...{
    promptFaceSelection: en.promptFaceSelection,
    promptBlemishRemoval: en.promptBlemishRemoval,
    promptAutoEnhance: en.promptAutoEnhance,
    promptRandomBackground: en.promptRandomBackground,
    promptEnhanceLight: en.promptEnhanceLight,
    promptRandomClothes: en.promptRandomClothes,
    promptHd: en.promptHd,
    promptElfEars: en.promptElfEars,
    promptBase: en.promptBase,
    promptChangeEyeColor: en.promptChangeEyeColor,
    promptVignette: en.promptVignette,
    promptSmoothSkin: en.promptSmoothSkin,
    promptSlimDown: en.promptSlimDown,
    promptHourglass: en.promptHourglass,
    promptJawline: en.promptJawline,
    promptSkinTone: en.promptSkinTone,
    promptEyeSize: en.promptEyeSize,
    promptPlumpLips: en.promptPlumpLips,
    promptMouthWidth: en.promptMouthWidth,
    promptNoseBridge: en.promptNoseBridge,
    promptNoseWidth: en.promptNoseWidth,
    promptMakeHappy: en.promptMakeHappy,
    promptMakeAngry: en.promptMakeAngry,
    promptEmotionBalance: en.promptEmotionBalance,
    promptFilterSepia: en.promptFilterSepia,
    promptFilterBlackAndWhite: en.promptFilterBlackAndWhite,
    promptFilterVintage: en.promptFilterVintage,
    promptFilterLomo: en.promptFilterLomo,
    promptFilterClarendon: en.promptFilterClarendon,
    promptFilterGingham: en.promptFilterGingham,
    promptFilterMoon: en.promptFilterMoon,
    promptFilterCinematic: en.promptFilterCinematic,
    promptFilterWarm: en.promptFilterWarm,
    promptFilterCool: en.promptFilterCool,
    promptFilterGrayscale: en.promptFilterGrayscale,
    promptFilterInvert: en.promptFilterInvert,
    promptFilterSolarize: en.promptFilterSolarize,
    promptFilterPopArt: en.promptFilterPopArt,
    promptFilterNeonPunk: en.promptFilterNeonPunk,
    promptFilterInfrared: en.promptFilterInfrared,
    promptFilterDuotone: en.promptFilterDuotone,
    promptFilterSketch: en.promptFilterSketch,
    promptFilterWatercolor: en.promptFilterWatercolor,
  },
  
  // Filter Labels
  filterSepia: "Сепия",
  filterBlackAndWhite: "Ч/Б",
  filterVintage: "Винтаж",
  filterLomo: "Ломо",
  filterClarendon: "Clarendon",
  filterGingham: "Gingham",
  filterMoon: "Луна",
  filterCinematic: "Кино",
  filterWarm: "Теплый",
  filterCool: "Холодный",
  filterGrayscale: "Оттенки серого",
  filterInvert: "Инверсия",
  filterSolarize: "Соляризация",
  filterPopArt: "Поп-арт",
  filterNeonPunk: "Неон-панк",
  filterInfrared: "Инфракрасный",
  filterDuotone: "Дуотон",
  filterSketch: "Набросок",
  filterWatercolor: "Акварель",
};


export const translations = { en, ru };
export type TranslationKeys = keyof typeof en;