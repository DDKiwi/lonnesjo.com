import path from "node:path";
import Image from "@11ty/eleventy-img";

/**
 * Generates responsive images with LQIP placeholder
 * @param {string} src - source filename in src/assets/images/source
 * @param {string} alt - alt text
 * @param {string} className - "small" | "regular" | "medium" | "large"
 */
const responsiveImage = async (src, alt = "", className = "regular") => {
  // Map CSS classes to widths and sizes
  const presets = {
    small: {
      widths: [270, 400, 600],
      sizes: "(max-width: 600px) 90vw, (max-width: 1040px) 30vw, 230px"
    },
    regular: {
      widths: [505, 800, 1200],
      sizes: "(max-width: 700px) 90vw, (max-width: 1040px) 50vw, 505px"
    },
    medium: {
      widths: [600, 900, 1200],
      sizes: "(max-width: 700px) 90vw, (max-width: 1040px) 60vw, 600px"
    },
    large: {
      widths: [1010, 1400, 1600],
      sizes: "(max-width: 700px) 90vw, (max-width: 1600px) 70vw, 1010px"
    }
  };

  const preset = presets[className] || presets.regular;
  const inputPath = path.join("src/assets/images/source", src);

  // Generate main images (WebP + JPEG)
  const metadata = await Image(inputPath, {
    widths: preset.widths,
    formats: ["webp", "jpeg"],
    outputDir: "./_site/assets/images/optimised/",
    urlPath: "assets/images/optimised/",
    sharpWebpOptions: { quality: 70, effort: 4 },
    sharpJpegOptions: { quality: 80 }
  });

  // Generate tiny blurred placeholder (LQIP)
  const placeholderMetadata = await Image(inputPath, {
    widths: [20], // tiny width for blur
    formats: ["webp"],
    outputDir: "./_site/assets/images/optimised/lqip/",
    urlPath: "assets/images/optimised/lqip/",
    sharpWebpOptions: { quality: 20 }
  });

  const lqip = placeholderMetadata.webp[0].url;

  // Build srcsets
  const webpSrcset = metadata.webp.map(img => `${img.url} ${img.width}w`).join(", ");
  const jpegSrcset = metadata.jpeg.map(img => `${img.url} ${img.width}w`).join(", ");

  // Use largest WebP for width/height
  const largest = metadata.webp[metadata.webp.length - 1];

  // Return <picture> with LQIP as inline background blur
  return `
    <picture class="${className}" style="background: url('${lqip}') center/cover no-repeat;">
      <source type="image/webp" srcset="${webpSrcset}" sizes="${preset.sizes}">
      <source type="image/jpeg" srcset="${jpegSrcset}" sizes="${preset.sizes}">
      <img src="${metadata.jpeg[0].url}"
           width="${largest.width}"
           height="${largest.height}"
           alt="${alt}"
           loading="lazy"
           decoding="async"
           class="${className}"
           style="background: none;" />
    </picture>
  `;
};

export default responsiveImage;
