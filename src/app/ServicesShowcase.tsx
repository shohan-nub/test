"use client";

import { useEffect, useRef, useState } from "react";
import "./services-showcase.css";

const images = [
  { name: "gallery-01", alt: "Sculptural cosmetic packaging in jewel colors", width: 1120, height: 1400 },
  { name: "gallery-02", alt: "Orange and yellow sculptural digital artwork", width: 1200, height: 675 },
  { name: "gallery-03", alt: "Makeup collection art directed against violet", width: 1200, height: 1200 },
  { name: "gallery-04", alt: "Oversized black and red poster typography", width: 935, height: 1400 },
  { name: "gallery-05", alt: "Iridescent glass forms against turquoise", width: 1200, height: 960 },
  { name: "gallery-06", alt: "Blue sneaker styled on a bright yellow background", width: 1029, height: 1400 },
  { name: "gallery-07", alt: "Skincare packaging in an orange studio composition", width: 1050, height: 1400 },
  { name: "gallery-08", alt: "Vintage illustrated posters with bold lettering", width: 1200, height: 960 },
  { name: "gallery-09", alt: "Perfume bottle and yellow flowers against deep blue", width: 1200, height: 960 },
  { name: "gallery-10", alt: "Reflective geometric digital sculpture", width: 1200, height: 1200 },
  { name: "gallery-11", alt: "Playful yellow letter tiles on blue", width: 1200, height: 800 },
  { name: "gallery-12", alt: "Orange skincare packaging and pink flowers", width: 1050, height: 1400 },
  { name: "gallery-13", alt: "Blue ice cream styled against vivid yellow", width: 1200, height: 900 },
  { name: "gallery-14", alt: "Floating purple and pink three-dimensional shapes", width: 1200, height: 675 },
  { name: "gallery-15", alt: "Minimal cosmetic bottle in a red studio setting", width: 787, height: 1400 },
  { name: "gallery-16", alt: "Mobile app presentation with vibrant blue and violet lighting", width: 875, height: 1400 },
  { name: "gallery-17", alt: "Desktop dashboard displayed on a laptop beside a mobile interface", width: 640, height: 480 },
  { name: "gallery-18", alt: "Smartphone displaying a real ordering and rewards app interface", width: 1400, height: 933 },
];

const rows = [
  [0, 16, 1, 3, 5, 6, 8, 10, 13].map((index) => images[index]),
  [2, 4, 7, 9, 11, 12, 14, 15, 17].map((index) => images[index]),
];

export default function ServicesShowcase() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <section ref={section} className="services-showcase" data-visible={visible} aria-labelledby="gallery-heading">
    {rows.map((row, rowIndex) => <div className="gallery-row-group" key={rowIndex}>
      {rowIndex === 1 && <h2 className="gallery-heading" id="gallery-heading">Where <em>Creativity</em><br />Meets Technology</h2>}
      <div className={`gallery-row${rowIndex === 1 ? " gallery-row-reverse" : ""}`} tabIndex={0} role="group" aria-label={`Creative gallery row ${rowIndex + 1}. Hover or focus to pause movement.`}>
        <div className="gallery-track">
          {[0, 1].map((copy) => <div className="gallery-sequence" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {row.map((image) => <div className="gallery-image" key={image.name} style={{ width: `calc(var(--gallery-height) * ${image.width / image.height})` }}>
              <img src={`/web-app-gallery/${image.name}.webp`} alt={copy === 0 ? image.alt : ""} width={image.width} height={image.height} decoding="async" draggable={false} />
            </div>)}
          </div>)}
        </div>
      </div>
    </div>)}
  </section>;
}
