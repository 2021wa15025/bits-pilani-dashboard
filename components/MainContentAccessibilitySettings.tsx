import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  RotateCcw, 
  Eye, 
  Zap, 
  Palette, 
  Focus, 
  Type, 
  Brain,
  GraduationCap,
  Moon,
  Sun,
  RotateCw,
  Minus,
  Square,
  MousePointer,
  Image,
  HelpCircle,
  PauseCircle,
  Info
} from 'lucide-react';

interface AccessibilityState {
  // Accessibility Profiles
  visualImpairment: boolean;
  seizureEpileptic: boolean;
  colorVisionDeficiency: boolean;
  adhd: boolean;
  dyslexia: boolean;
  learning: boolean;
  
  // Content Adjustments
  readableFont: boolean;
  dyslexiaFont: boolean;
  highlightHeadings: boolean;
  highlightLinks: boolean;
  highlightButtons: boolean;
  hideImages: boolean;
  tooltips: boolean;
  stopAnimations: boolean;
  
  // Text Adjustments
  textSize: number; // 0, 1, 2 for +, ++, +++
  lineHeight: number; // 0, 1, 2 for +, ++, +++
  textSpacing: number; // 0, 1, 2 for +, ++, +++
  
  // Color Adjustments
  darkContrast: boolean;
  lightContrast: boolean;
  invertColors: boolean;
  changeColors: boolean;
  highContrast: boolean;
  highSaturation: boolean;
  lowSaturation: boolean;
  monochrome: boolean;
  
  // Orientation Adjustments
  readingGuide: boolean;
  readingMask: boolean;
  bigBlackCursor: boolean;
  bigWhiteCursor: boolean;
}

const MainContentAccessibilitySettings: React.FC = () => {
  const [settings, setSettings] = useState<AccessibilityState>({
    // Accessibility Profiles
    visualImpairment: false,
    seizureEpileptic: false,
    colorVisionDeficiency: false,
    adhd: false,
    dyslexia: false,
    learning: false,
    
    // Content Adjustments
    readableFont: false,
    dyslexiaFont: false,
    highlightHeadings: false,
    highlightLinks: false,
    highlightButtons: false,
    hideImages: false,
    tooltips: false,
    stopAnimations: false,
    
    // Text Adjustments
    textSize: 0,
    lineHeight: 0,
    textSpacing: 0,
    
    // Color Adjustments
    darkContrast: false,
    lightContrast: false,
    invertColors: false,
    changeColors: false,
    highContrast: false,
    highSaturation: false,
    lowSaturation: false,
    monochrome: false,
    
    // Orientation Adjustments
    readingGuide: false,
    readingMask: false,
    bigBlackCursor: false,
    bigWhiteCursor: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('mainContentAccessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Apply settings to main content only
  useEffect(() => {
    applyMainContentSettings(settings);
    localStorage.setItem('mainContentAccessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  const applyMainContentSettings = (newSettings: AccessibilityState) => {
    // Target only the main content area, not the entire page
    const mainContent = document.querySelector('.university-content');
    if (!mainContent) return;

    // Remove all existing accessibility classes from main content
    mainContent.classList.remove(
      'main-readable-font', 'main-dyslexia-font', 'main-highlight-headings', 
      'main-highlight-links', 'main-highlight-buttons', 'main-hide-images', 
      'main-show-tooltips', 'main-stop-animations', 'main-dark-contrast', 
      'main-light-contrast', 'main-invert-colors', 'main-high-contrast',
      'main-high-saturation', 'main-low-saturation', 'main-monochrome', 
      'main-reading-guide', 'main-reading-mask', 'main-big-black-cursor', 
      'main-big-white-cursor', 'visual-impairment', 'seizure-epileptic', 
      'color-vision-deficiency', 'adhd', 'dyslexia', 'learning', 
      'accessibility-text-large', 'accessibility-text-xlarge', 'accessibility-line-height',
      'accessibility-letter-spacing'
    );

    // Apply accessibility profiles
    if (newSettings.visualImpairment) {
      mainContent.classList.add('visual-impairment', 'main-high-contrast', 'main-highlight-buttons');
    }
    if (newSettings.seizureEpileptic) {
      mainContent.classList.add('seizure-epileptic', 'main-stop-animations');
    }
    if (newSettings.colorVisionDeficiency) {
      mainContent.classList.add('color-vision-deficiency', 'main-high-contrast');
    }
    if (newSettings.adhd) {
      mainContent.classList.add('adhd', 'main-stop-animations', 'main-highlight-buttons');
    }
    if (newSettings.dyslexia) {
      mainContent.classList.add('dyslexia', 'main-dyslexia-font');
    }
    if (newSettings.learning) {
      mainContent.classList.add('learning', 'main-highlight-headings', 'main-show-tooltips');
    }

    // Apply content adjustments to main content only
    if (newSettings.readableFont) mainContent.classList.add('main-readable-font');
    if (newSettings.dyslexiaFont) mainContent.classList.add('main-dyslexia-font');
    if (newSettings.highlightHeadings) mainContent.classList.add('main-highlight-headings');
    if (newSettings.highlightLinks) mainContent.classList.add('main-highlight-links');
    if (newSettings.highlightButtons) mainContent.classList.add('main-highlight-buttons');
    if (newSettings.hideImages) mainContent.classList.add('main-hide-images');
    if (newSettings.tooltips) mainContent.classList.add('main-show-tooltips');
    if (newSettings.stopAnimations) mainContent.classList.add('main-stop-animations');

    // Apply color adjustments to main content only
    if (newSettings.darkContrast) mainContent.classList.add('main-dark-contrast');
    if (newSettings.lightContrast) mainContent.classList.add('main-light-contrast');
    if (newSettings.invertColors) mainContent.classList.add('main-invert-colors');
    if (newSettings.highContrast) mainContent.classList.add('main-high-contrast');
    if (newSettings.highSaturation) mainContent.classList.add('main-high-saturation');
    if (newSettings.lowSaturation) mainContent.classList.add('main-low-saturation');
    if (newSettings.monochrome) mainContent.classList.add('main-monochrome');

    // Apply orientation adjustments to main content only
    if (newSettings.readingGuide) mainContent.classList.add('main-reading-guide');
    if (newSettings.readingMask) mainContent.classList.add('main-reading-mask');
    if (newSettings.bigBlackCursor) mainContent.classList.add('main-big-black-cursor');
    if (newSettings.bigWhiteCursor) mainContent.classList.add('main-big-white-cursor');

    // Apply text size adjustments only when user specifically enables them
    if (newSettings.textSize === 1) {
      mainContent.classList.add('accessibility-text-large');
    } else if (newSettings.textSize === 2) {
      mainContent.classList.add('accessibility-text-xlarge');
    }

    // Apply line height adjustments
    if (newSettings.lineHeight > 0) {
      mainContent.classList.add('accessibility-line-height');
      const mainContentElement = mainContent as HTMLElement;
      mainContentElement.style.setProperty('--line-height-multiplier', `${1.4 + newSettings.lineHeight * 0.3}`);
    }

    // Apply letter spacing adjustments
    if (newSettings.textSpacing > 0) {
      mainContent.classList.add('accessibility-letter-spacing');
      const mainContentElement = mainContent as HTMLElement;
      mainContentElement.style.setProperty('--letter-spacing-value', `${newSettings.textSpacing * 0.05}em`);
    }
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilityState = {
      visualImpairment: false,
      seizureEpileptic: false,
      colorVisionDeficiency: false,
      adhd: false,
      dyslexia: false,
      learning: false,
      readableFont: false,
      dyslexiaFont: false,
      highlightHeadings: false,
      highlightLinks: false,
      highlightButtons: false,
      hideImages: false,
      tooltips: false,
      stopAnimations: false,
      textSize: 0,
      lineHeight: 0,
      textSpacing: 0,
      darkContrast: false,
      lightContrast: false,
      invertColors: false,
      changeColors: false,
      highContrast: false,
      highSaturation: false,
      lowSaturation: false,
      monochrome: false,
      readingGuide: false,
      readingMask: false,
      bigBlackCursor: false,
      bigWhiteCursor: false,
    };
    setSettings(defaultSettings);
  };

  const updateSetting = (key: keyof AccessibilityState, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const SizePicker: React.FC<{ value: number; onChange: (value: number) => void; label: string; description: string }> = 
    ({ value, onChange, label, description }) => (
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                <Info className="h-3 w-3 text-gray-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm max-w-xs">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex gap-1">
          {[0, 1, 2].map((size) => (
            <Button
              key={size}
              variant={value === size ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(size)}
              className="flex-1 text-xs h-8"
            >
              {size === 0 ? 'Normal' : size === 1 ? '+' : '++'}
            </Button>
          ))}
        </div>
      </div>
    );

  const AccessibilityCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    description: string;
    active: boolean; 
    onClick: () => void;
    size?: 'sm' | 'md';
  }> = ({ icon, title, description, active, onClick, size = 'md' }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={active ? "default" : "outline"}
            className={`h-auto ${size === 'sm' ? 'p-2' : 'p-3'} flex flex-col items-center gap-2 w-full text-center relative group transition-all`}
            onClick={onClick}
          >
            <div className="flex items-center justify-center">
              <div className={size === 'sm' ? 'text-sm' : 'text-base'}>
                {icon}
              </div>
            </div>
            <span className={`font-medium leading-tight ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
              {title}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">
              Accessibility Settings
            </h2>
            <p className="text-sm text-[#475569] dark:text-gray-300">
              These settings only affect the main content area. Navigation and header remain unchanged.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetSettings}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </Button>
        </div>

        <Card>
          <CardContent className="p-6 space-y-8">
            {/* Accessibility Profiles */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Accessibility Profiles</h3>
                <Badge variant="secondary" className="text-xs">Quick Setup</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <AccessibilityCard
                  icon={<Eye className="h-5 w-5" />}
                  title="Visual Impairment"
                  description="Enhances contrast, text size, and focus indicators for better visibility"
                  active={settings.visualImpairment}
                  onClick={() => updateSetting('visualImpairment', !settings.visualImpairment)}
                />
                <AccessibilityCard
                  icon={<Zap className="h-5 w-5" />}
                  title="Seizure Safe"
                  description="Removes flashing animations and reduces motion to prevent seizures"
                  active={settings.seizureEpileptic}
                  onClick={() => updateSetting('seizureEpileptic', !settings.seizureEpileptic)}
                />
                <AccessibilityCard
                  icon={<Palette className="h-5 w-5" />}
                  title="Color Blind"
                  description="Adjusts colors and adds patterns for color vision deficiency"
                  active={settings.colorVisionDeficiency}
                  onClick={() => updateSetting('colorVisionDeficiency', !settings.colorVisionDeficiency)}
                />
                <AccessibilityCard
                  icon={<Focus className="h-5 w-5" />}
                  title="ADHD"
                  description="Reduces distractions and enhances focus with simplified interface"
                  active={settings.adhd}
                  onClick={() => updateSetting('adhd', !settings.adhd)}
                />
                <AccessibilityCard
                  icon={<Type className="h-5 w-5" />}
                  title="Dyslexia"
                  description="Uses dyslexia-friendly fonts and improves text readability"
                  active={settings.dyslexia}
                  onClick={() => updateSetting('dyslexia', !settings.dyslexia)}
                />
                <AccessibilityCard
                  icon={<GraduationCap className="h-5 w-5" />}
                  title="Learning"
                  description="Simplifies content and adds helpful tooltips for better understanding"
                  active={settings.learning}
                  onClick={() => updateSetting('learning', !settings.learning)}
                />
              </div>
            </div>

            <Separator />

            {/* Text Adjustments */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Text Adjustments</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SizePicker
                  value={settings.textSize}
                  onChange={(value) => updateSetting('textSize', value)}
                  label="Text Size"
                  description="Increase text size for better readability. Normal size is recommended for most users."
                />
                <SizePicker
                  value={settings.lineHeight}
                  onChange={(value) => updateSetting('lineHeight', value)}
                  label="Line Height"
                  description="Increase spacing between lines to improve reading comprehension."
                />
                <SizePicker
                  value={settings.textSpacing}
                  onChange={(value) => updateSetting('textSpacing', value)}
                  label="Letter Spacing"
                  description="Add space between letters to help with dyslexia and reading difficulties."
                />
              </div>
            </div>

            <Separator />

            {/* Content Adjustments */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content Adjustments</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <AccessibilityCard
                  size="sm"
                  icon={<Type className="h-4 w-4" />}
                  title="Readable Font"
                  description="Switch to a clean, highly readable font family"
                  active={settings.readableFont}
                  onClick={() => updateSetting('readableFont', !settings.readableFont)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<Brain className="h-4 w-4" />}
                  title="Dyslexia Font"
                  description="Use OpenDyslexic font designed specifically for dyslexic readers"
                  active={settings.dyslexiaFont}
                  onClick={() => updateSetting('dyslexiaFont', !settings.dyslexiaFont)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<Type className="h-4 w-4" />}
                  title="Highlight Headings"
                  description="Add background colors to headings for better structure recognition"
                  active={settings.highlightHeadings}
                  onClick={() => updateSetting('highlightHeadings', !settings.highlightHeadings)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<Type className="h-4 w-4" />}
                  title="Highlight Links"
                  description="Make links more visible with underlines and bold styling"
                  active={settings.highlightLinks}
                  onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<Square className="h-4 w-4" />}
                  title="Highlight Buttons"
                  description="Add borders and background colors to buttons for better visibility"
                  active={settings.highlightButtons}
                  onClick={() => updateSetting('highlightButtons', !settings.highlightButtons)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<Image className="h-4 w-4" />}
                  title="Hide Images"
                  description="Hide decorative images to reduce visual distractions"
                  active={settings.hideImages}
                  onClick={() => updateSetting('hideImages', !settings.hideImages)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<HelpCircle className="h-4 w-4" />}
                  title="Show Tooltips"
                  description="Display helpful tooltips and descriptions for UI elements"
                  active={settings.tooltips}
                  onClick={() => updateSetting('tooltips', !settings.tooltips)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<PauseCircle className="h-4 w-4" />}
                  title="Stop Animations"
                  description="Disable all animations and transitions for seizure safety"
                  active={settings.stopAnimations}
                  onClick={() => updateSetting('stopAnimations', !settings.stopAnimations)}
                />
              </div>
            </div>

            <Separator />

            {/* Color Adjustments */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Color & Contrast</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <AccessibilityCard
                  size="sm"
                  icon={<Moon className="h-4 w-4" />}
                  title="Dark Contrast"
                  description="Switch to dark theme with high contrast for reduced eye strain"
                  active={settings.darkContrast}
                  onClick={() => updateSetting('darkContrast', !settings.darkContrast)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<Sun className="h-4 w-4" />}
                  title="Light Contrast"
                  description="Use high contrast light theme for better text visibility"
                  active={settings.lightContrast}
                  onClick={() => updateSetting('lightContrast', !settings.lightContrast)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<RotateCw className="h-4 w-4" />}
                  title="Invert Colors"
                  description="Invert all colors which can help with light sensitivity"
                  active={settings.invertColors}
                  onClick={() => updateSetting('invertColors', !settings.invertColors)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<Focus className="h-4 w-4" />}
                  title="High Contrast"
                  description="Maximize contrast between text and background colors"
                  active={settings.highContrast}
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<Palette className="h-4 w-4" />}
                  title="High Saturation"
                  description="Increase color intensity for better color perception"
                  active={settings.highSaturation}
                  onClick={() => updateSetting('highSaturation', !settings.highSaturation)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<Palette className="h-4 w-4" />}
                  title="Low Saturation"
                  description="Reduce color intensity for sensitive eyes"
                  active={settings.lowSaturation}
                  onClick={() => updateSetting('lowSaturation', !settings.lowSaturation)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<Focus className="h-4 w-4" />}
                  title="Monochrome"
                  description="Remove all colors and display content in grayscale"
                  active={settings.monochrome}
                  onClick={() => updateSetting('monochrome', !settings.monochrome)}
                />
              </div>
            </div>

            <Separator />

            {/* Navigation & Cursor */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Navigation & Cursor</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <AccessibilityCard
                  size="sm"
                  icon={<Minus className="h-4 w-4" />}
                  title="Reading Guide"
                  description="Add a horizontal line to help track reading position"
                  active={settings.readingGuide}
                  onClick={() => updateSetting('readingGuide', !settings.readingGuide)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<Square className="h-4 w-4" />}
                  title="Reading Mask"
                  description="Dim surrounding text to focus on current paragraph"
                  active={settings.readingMask}
                  onClick={() => updateSetting('readingMask', !settings.readingMask)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<MousePointer className="h-4 w-4" />}
                  title="Big Black Cursor"
                  description="Use a larger black cursor for better visibility"
                  active={settings.bigBlackCursor}
                  onClick={() => updateSetting('bigBlackCursor', !settings.bigBlackCursor)}
                />
                <AccessibilityCard
                  size="sm"
                  icon={<MousePointer className="h-4 w-4" />}
                  title="Big White Cursor"
                  description="Use a larger white cursor with black outline"
                  active={settings.bigWhiteCursor}
                  onClick={() => updateSetting('bigWhiteCursor', !settings.bigWhiteCursor)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default MainContentAccessibilitySettings;