// Custom hooks for the BITS Pilani Student Dashboard
export { useLocalStorage } from './useLocalStorage';
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useApi, useFetch, useFormSubmit } from './useApi';
export { useTheme } from './useTheme';
export { useKeyboard, useKeyboardShortcut, useCommonShortcuts } from './useKeyboard';

// Context hooks (re-exported for convenience)
export { useAuth } from '../contexts/AuthContext';
export { useData } from '../contexts/DataContext';
export { useNavigation } from '../contexts/NavigationContext';
export { useToast } from '../contexts/ToastContext';