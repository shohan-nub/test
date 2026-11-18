# Creative portfolio gallery

The gallery uses 16 supplied originals in the public folder. Each tile opens its original at full size. The two website screenshots lead separate masonry compositions, with the branding boards and standalone logos shown at their native proportions.

The WebP files here are resized gallery derivatives. The source manifest records the original filename and dimensions of each derivative. Run `node scripts/prepare-creative-portfolio.mjs` from the project root to regenerate them. The script reads the originals and writes the derivatives without cropping or color grading.
