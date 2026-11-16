"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import worldLand from "../world-land.json";
import styles from "./FooterGlobe.module.css";

type Position = { x: number; y: number; z: number };
const turn = Math.PI * 2;
const radius = 151;

export default function FooterGlobe() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = root.current;
    const surface = canvas.current;
    const context = surface?.getContext("2d");
    if (!element || !surface || !context) return;
    let disposed = false;
    let visible = false;
    const phase = { angle: 0 };
    const land: Array<{ lon: number; lat: number }> = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tilt = -.18;

    const project = (lon: number, lat: number): Position => {
      const longitude = lon - Math.PI / 2 + phase.angle;
      const x = Math.cos(lat) * Math.sin(longitude) * radius;
      const y = -Math.sin(lat) * radius;
      return { x: 250 + x * Math.cos(tilt) - y * Math.sin(tilt), y: 250 + x * Math.sin(tilt) + y * Math.cos(tilt), z: Math.cos(lat) * Math.cos(longitude) };
    };
    const orbit = (angle: number, second = false): Position => {
      const x = Math.cos(angle) * (second ? 208 : 226);
      const y = Math.sin(angle) * (second ? 82 : 55);
      const rotation = second ? .82 : -.48;
      return { x: 250 + x * Math.cos(rotation) - y * Math.sin(rotation), y: 250 + x * Math.sin(rotation) + y * Math.cos(rotation), z: Math.sin(angle) };
    };
    const drawOrbit = (front: boolean, second: boolean) => {
      context.beginPath();
      let drawing = false;
      for (let i = 0; i <= 180; i++) {
        const p = orbit(i / 180 * turn, second);
        if ((p.z >= 0) !== front) { drawing = false; continue; }
        if (drawing) context.lineTo(p.x, p.y); else context.moveTo(p.x, p.y);
        drawing = true;
      }
      context.strokeStyle = front ? "rgba(212,150,111,.35)" : "rgba(212,150,111,.12)";
      context.lineWidth = .7;
      context.stroke();
    };
    const drawGrid = () => {
      const stroke = (points: Position[]) => {
        context.beginPath();
        let drawing = false;
        points.forEach(p => {
          if (p.z < 0) { drawing = false; return; }
          if (drawing) context.lineTo(p.x, p.y); else context.moveTo(p.x, p.y);
          drawing = true;
        });
        context.strokeStyle = "rgba(238,224,205,.12)";
        context.lineWidth = .5;
        context.stroke();
      };
      for (let lat = -60; lat <= 60; lat += 30) stroke(Array.from({ length: 121 }, (_, i) => project(i / 120 * turn, lat * Math.PI / 180)));
      for (let lon = 0; lon < 360; lon += 30) stroke(Array.from({ length: 61 }, (_, i) => project(lon * Math.PI / 180, (i / 60 * 180 - 90) * Math.PI / 180)));
    };
    const drawNodes = (front: boolean) => {
      [0, 1, 2].forEach(index => {
        const p = orbit(phase.angle * (index === 1 ? -2 : 3) + index * 2.1, index === 1);
        if ((p.z >= 0) !== front) return;
        context.beginPath(); context.arc(p.x, p.y, 3, 0, turn);
        context.shadowBlur = front ? 8 : 0; context.shadowColor = "#dc976d";
        context.fillStyle = front ? "#edb48d" : "#71604f"; context.fill(); context.shadowBlur = 0;
      });
    };
    const draw = () => {
      if (disposed) return;
      context.clearRect(0, 0, 500, 500);
      drawOrbit(false, false); drawOrbit(false, true);
      drawNodes(false);
      const light = context.createRadialGradient(205, 195, 12, 250, 250, radius);
      light.addColorStop(0, "#3c3830"); light.addColorStop(.65, "#2c2a25"); light.addColorStop(1, "#211f1c");
      context.beginPath(); context.arc(250, 250, radius, 0, turn); context.fillStyle = light; context.fill();
      drawGrid();
      land.forEach(dot => {
        const p = project(dot.lon, dot.lat);
        context.beginPath(); context.arc(p.x, p.y, p.z > 0 ? .8 + p.z * .5 : .65, 0, turn);
        context.fillStyle = p.z > 0 ? `rgba(245,229,208,${.24 + p.z * .66})` : "rgba(214,172,136,.055)";
        context.fill();
      });
      context.beginPath(); context.arc(250, 250, radius + .6, 0, turn); context.strokeStyle = "rgba(232,186,150,.2)"; context.lineWidth = .7; context.stroke();
      drawOrbit(true, false); drawOrbit(true, true);
      drawNodes(true);
    };
    const motion = gsap.to(phase, { angle: turn, duration: 110, repeat: -1, ease: "none", paused: true, onUpdate: draw });
    const sync = () => { if (visible && !reduced.matches && !document.hidden && land.length) motion.play(); else motion.pause(); draw(); };
    const resize = () => {
      const size = element.clientWidth;
      const resolution = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.round(size * resolution); surface.height = Math.round(size * resolution);
      context.setTransform(surface.width / 500, 0, 0, surface.height / 500, 0, 0); draw();
    };
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(element);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .05 });
    visibility.observe(element);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);

    // Sample the same Natural Earth land polygons used by the existing Hero map.
    // Only the canvas is updated during rotation; React does not render per frame.
    const map = new window.Image();
    map.onload = () => {
      if (disposed) return;
      const mask = document.createElement("canvas"); mask.width = 1000; mask.height = 500;
      const pixels = mask.getContext("2d", { willReadFrequently: true });
      if (!pixels) return;
      pixels.drawImage(map, 0, 0);
      const data = pixels.getImageData(0, 0, 1000, 500).data;
      for (let latitude = -81; latitude <= 84; latitude += 2.6) {
        const lat = latitude * Math.PI / 180;
        const spacing = 2.6 / Math.cos(lat);
        for (let longitude = -180; longitude < 180; longitude += spacing) {
          const x = Math.min(999, Math.floor((longitude + 180) / 360 * 1000));
          const y = Math.min(499, Math.floor((90 - latitude) / 180 * 500));
          if (data[(y * 1000 + x) * 4 + 3] > 100) land.push({ lon: longitude * Math.PI / 180, lat });
        }
      }
      sync();
    };
    map.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="500" viewBox="0 0 1000 500"><path d="${worldLand}" fill="white" fill-rule="evenodd"/></svg>`)}`;
    resize();
    return () => { disposed = true; motion.kill(); visibility.disconnect(); sizeObserver.disconnect(); reduced.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); map.onload = null; };
  }, []);

  return <figure className={styles.globe} ref={root} role="img" aria-label="A slowly rotating dotted Earth with orbital connections, representing SparkLab's global digital reach">
    <canvas ref={canvas} width={500} height={500} aria-hidden="true" />
    <figcaption aria-hidden="true"><span /> LOCAL ROOTS. GLOBAL POSSIBILITIES.</figcaption>
  </figure>;
}
