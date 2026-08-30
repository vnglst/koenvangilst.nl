export const rhinePalettes = {
  light: ['#0b3558', '#087ca8', '#3e6f91', '#8c586d', '#d85b32', '#7b1e1e'],
  dark: ['#d8f3ff', '#39b8e2', '#397aa5', '#8b5f7c', '#f0784f', '#ffd166']
} as const;

export type RhinePalette = (typeof rhinePalettes)[keyof typeof rhinePalettes];
