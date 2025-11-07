import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
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
  Info
} from 'lucide-react';

interface AccessibilityState {
  visualImpairment: boolean;
  seizureEpileptic: boolean;
  colorVisionDeficiency: boolean;
  adhd: boolean;
  dyslexia: boolean;
  learning: boolean;
  readableFont: boolean;
  dyslexiaFont: boolean;
  highlightHeadings: boolean;
  highlightLinks: boolean;
  highlightButtons: boolean;
  hideImages: boolean;
  tooltips: boolean;
  stopAnimations: boolean;
  textSize: number;
  lineHeight: number;
  textSpacing: number;
  darkContrast: boolean;
  lightContrast: boolean;
  invertColors: boolean;
  changeColors: boolean;
  highContrast: boolean;
  highSaturation: boolean;
  lowSaturation: boolean;
  monochrome: boolean;
  readingGuide: boolean;
  readingMask: boolean;
  bigBlackCursor: boolean;
  bigWhiteCursor: boolean;
}

const AccessibilitySettings: React.FC = () => {
  const [settings, setSettings] = useState<AccessibilityState>({
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
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    applyAccessibilitySettings(settings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  const applyAccessibilitySettings = (newSettings: AccessibilityState) => {
    const mainContent = document.querySelector('.university-content');
    if (!mainContent) return;

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

    if (newSettings.readableFont) mainContent.classList.add('main-readable-font');
    if (newSettings.dyslexiaFont) mainContent.classList.add('main-dyslexia-font');
    if (newSettings.highlightHeadings) mainContent.classList.add('main-highlight-headings');
    if (newSettings.highlightLinks) mainContent.classList.add('main-highlight-links');
    if (newSettings.highlightButtons) mainContent.classList.add('main-highlight-buttons');
    if (newSettings.hideImages) mainContent.classList.add('main-hide-images');
    if (newSettings.tooltips) mainContent.classList.add('main-show-tooltips');
    if (newSettings.stopAnimations) mainContent.classList.add('main-stop-animations');

    if (newSettings.darkContrast) mainContent.classList.add('main-dark-contrast');
    if (newSettings.lightContrast) mainContent.classList.add('main-light-contrast');
    if (newSettings.invertColors) mainContent.classList.add('main-invert-colors');
    if (newSettings.highContrast) mainContent.classList.add('main-high-contrast');
    if (newSettings.highSaturation) mainContent.classList.add('main-high-saturation');
    if (newSettings.lowSaturation) mainContent.classList.add('main-low-saturation');
    if (newSettings.monochrome) mainContent.classList.add('main-monochrome');

    if (newSettings.readingGuide) mainContent.classList.add('main-reading-guide');
    if (newSettings.readingMask) mainContent.classList.add('main-reading-mask');
    if (newSettings.bigBlackCursor) mainContent.classList.add('main-big-black-cursor');
    if (newSettings.bigWhiteCursor) mainContent.classList.add('main-big-white-cursor');

    if (newSettings.textSize === 1) {
      mainContent.classList.add('accessibility-text-large');
    } else if (newSettings.textSize === 2) {
      mainContent.classList.add('accessibility-text-xlarge');
    }

    if (newSettings.lineHeight > 0) {
      mainContent.classList.add('accessibility-line-height');
      const mainContentElement = mainContent as HTMLElement;
      mainContentElement.style.setProperty('--line-height-multiplier', '1.7');
    }

    if (newSettings.textSpacing > 0) {
      mainContent.classList.add('accessibility-letter-spacing');
      const mainContentElement = mainContent as HTMLElement;
      mainContentElement.style.setProperty('--letter-spacing-value', '0.05em');
    }
  };

  const resetSettings = () => {
    setSettings({
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
    });
  };

  const updateSetting = (key: keyof AccessibilityState, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

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
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Accessibility Profiles</h3>
                <Badge variant="secondary" className="text-xs">Quick Setup</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { key: 'visualImpairment', icon: Eye, title: 'Visual Impairment', desc: 'Enhances contrast and visibility' },
                  { key: 'seizureEpileptic', icon: Zap, title: 'Seizure Safe', desc: 'Removes animations and motion' },
                  { key: 'colorVisionDeficiency', icon: Palette, title: 'Color Blind', desc: 'Adjusts colors for accessibility' },
                  { key: 'adhd', icon: Focus, title: 'ADHD', desc: 'Reduces distractions' },
                  { key: 'dyslexia', icon: Type, title: 'Dyslexia', desc: 'Uses dyslexia-friendly fonts' },
                  { key: 'learning', icon: GraduationCap, title: 'Learning', desc: 'Simplifies content and adds tooltips' }
                ].map(({ key, icon: Icon, title, desc }) => (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={settings[key as keyof AccessibilityState] ? "default" : "outline"}
                        className="h-auto p-3 flex flex-col items-center gap-2 w-full"
                        onClick={() => updateSetting(key as keyof AccessibilityState, !settings[key as keyof AccessibilityState])}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{title}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">{desc}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Text Adjustments</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'textSize', label: 'Text Size', desc: 'Increase text size for better readability' },
                  { key: 'lineHeight', label: 'Line Height', desc: 'Increase spacing between lines' },
                  { key: 'textSpacing', label: 'Letter Spacing', desc: 'Add space between letters' }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <label className="text-sm font-medium">{label}</label>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">{desc}</p>
                      </TooltipContent>
                    </Tooltip>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((size) => (
                        <Button
                          key={size}
                          variant={settings[key as keyof AccessibilityState] === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSetting(key as keyof AccessibilityState, size)}
                          className="flex-1 text-xs h-8"
                        >
                          {size === 0 ? 'Normal' : size === 1 ? '+' : '++'}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Options</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: 'dyslexiaFont', title: 'Dyslexia Font' },
                  { key: 'highlightHeadings', title: 'Highlight Headings' },
                  { key: 'highlightLinks', title: 'Highlight Links' },
                  { key: 'stopAnimations', title: 'Stop Animations' },
                  { key: 'darkContrast', title: 'Dark Contrast' },
                  { key: 'lightContrast', title: 'Light Contrast' },
                  { key: 'highContrast', title: 'High Contrast' },
                  { key: 'monochrome', title: 'Monochrome' }
                ].map(({ key, title }) => (
                  <Button
                    key={key}
                    variant={settings[key as keyof AccessibilityState] ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting(key as keyof AccessibilityState, !settings[key as keyof AccessibilityState])}
                    className="h-auto p-2"
                  >
                    <span className="text-xs">{title}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default AccessibilitySettings;
