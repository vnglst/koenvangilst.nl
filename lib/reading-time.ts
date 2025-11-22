/**
 * Calculate reading time for text content
 * @param text The text content to analyze
 * @param wordsPerMinute Average reading speed (default: 200 wpm)
 * @returns Reading time estimation
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200) {
  const trimmed = text.trim();
  const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
  const minutes = words / wordsPerMinute;
  const readingTime = Math.ceil(minutes);

  return {
    text: `${readingTime} min read`,
    minutes: readingTime,
    time: readingTime * 60 * 1000, // milliseconds
    words
  };
}
