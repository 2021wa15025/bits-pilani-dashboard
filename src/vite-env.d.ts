/// <reference types="vite/client" />

// Type declarations for CSS imports
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.sass' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.less' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.styl' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.stylus' {
  const content: Record<string, string>;
  export default content;
}

// Type declarations for image imports
declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.tiff' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}