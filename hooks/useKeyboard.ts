import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  callback: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
  enabled?: boolean;
}

export function useKeyboard(shortcuts: KeyboardShortcut[]) {
  const shortcutsRef = useRef(shortcuts);
  
  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    shortcutsRef.current.forEach((shortcut) => {
      if (shortcut.enabled === false) return;

      const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
      const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
      const altMatches = !!shortcut.altKey === event.altKey;
      const metaMatches = !!shortcut.metaKey === event.metaKey;

      if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.callback(event);
      }
    });
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Hook for single shortcut
export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    preventDefault?: boolean;
    enabled?: boolean;
  } = {}
) {
  useKeyboard([
    {
      key,
      callback,
      ...options,
    },
  ]);
}

// Common keyboard shortcuts
export function useCommonShortcuts({
  onSave,
  onCopy,
  onPaste,
  onUndo,
  onRedo,
  onSearch,
  onEscape,
  enabled = true,
}: {
  onSave?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSearch?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}) {
  const shortcuts: KeyboardShortcut[] = [];

  if (onSave) {
    shortcuts.push({
      key: 's',
      ctrlKey: true,
      callback: onSave,
      enabled,
    });
  }

  if (onCopy) {
    shortcuts.push({
      key: 'c',
      ctrlKey: true,
      callback: onCopy,
      enabled,
    });
  }

  if (onPaste) {
    shortcuts.push({
      key: 'v',
      ctrlKey: true,
      callback: onPaste,
      enabled,
    });
  }

  if (onUndo) {
    shortcuts.push({
      key: 'z',
      ctrlKey: true,
      callback: onUndo,
      enabled,
    });
  }

  if (onRedo) {
    shortcuts.push({
      key: 'y',
      ctrlKey: true,
      callback: onRedo,
      enabled,
    });
  }

  if (onSearch) {
    shortcuts.push({
      key: 'f',
      ctrlKey: true,
      callback: onSearch,
      enabled,
    });
  }

  if (onEscape) {
    shortcuts.push({
      key: 'Escape',
      callback: onEscape,
      enabled,
    });
  }

  useKeyboard(shortcuts);
}