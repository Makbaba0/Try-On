const imageCache = new Map<string, HTMLImageElement>();

export function getCachedClothingImage(src: string): HTMLImageElement {
  const cachedImage = imageCache.get(src);

  if (cachedImage) {
    return cachedImage;
  }

  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  imageCache.set(src, image);

  return image;
}
