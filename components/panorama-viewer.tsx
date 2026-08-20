"use client";

import { Compass, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Visualiseur panoramique 360°.
 *
 * WebGL écrit à la main, sans bibliothèque. Trois raisons : notre politique de
 * sécurité interdit les scripts venus d'un domaine tiers, une bibliothèque 3D
 * complète pèse plusieurs centaines de kilo-octets pour afficher une sphère, et
 * le code tient en une page — donc il se relit.
 *
 * Attend une image équirectangulaire (rapport 2:1), telle que produite par un
 * téléphone en mode photosphère ou par une caméra 360.
 *
 * Si WebGL n'est pas disponible, l'image s'affiche à plat : dégradé, pas panne.
 */

const VERTEX_SHADER = `
attribute vec3 position;
attribute vec2 uv;
uniform mat4 projection;
uniform mat4 view;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projection * view * vec4(position, 1.0);
}`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D panorama;
varying vec2 vUv;
void main() {
  gl_FragColor = texture2D(panorama, vUv);
}`;

/** Sphère UV : l'image équirectangulaire se plaque directement dessus. */
function buildSphere(segments = 48, rings = 32) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let ring = 0; ring <= rings; ring++) {
    const phi = (ring / rings) * Math.PI;
    for (let segment = 0; segment <= segments; segment++) {
      const theta = (segment / segments) * Math.PI * 2;
      positions.push(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta),
      );
      uvs.push(segment / segments, ring / rings);
    }
  }

  for (let ring = 0; ring < rings; ring++) {
    for (let segment = 0; segment < segments; segment++) {
      const a = ring * (segments + 1) + segment;
      const b = a + segments + 1;
      // Ordre inversé : on regarde la sphère depuis l'intérieur.
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }

  return {
    positions: new Float32Array(positions),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices),
  };
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function perspective(fov: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fov / 2);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0,
  ]);
}

/** Matrice de vue depuis le centre de la sphère, orientée par lacet et tangage. */
function lookAround(yaw: number, pitch: number): Float32Array {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);

  return new Float32Array([
    cy, sy * sp, -sy * cp, 0,
    0, cp, sp, 0,
    sy, -cy * sp, cy * cp, 0,
    0, 0, 0, 1,
  ]);
}

export function PanoramaViewer({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [hinted, setHinted] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) {
      setFailed(true);
      return;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      setFailed(true);
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    const sphere = buildSphere();

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.positions, gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.uvs, gl.STATIC_DRAW);
    const uvLocation = gl.getAttribLocation(program, "uv");
    gl.enableVertexAttribArray(uvLocation);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW);

    // Texture provisoire unie, le temps que l'image arrive.
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([210, 200, 180, 255]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      setReady(true);
      draw();
    };
    image.onerror = () => setFailed(true);
    image.src = src;

    const projectionLocation = gl.getUniformLocation(program, "projection");
    const viewLocation = gl.getUniformLocation(program, "view");

    let yaw = 0;
    let pitch = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let frame = 0;
    let observer: ResizeObserver | null = null;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth * ratio;
      const height = canvas.clientHeight * ratio;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    /** Un tour de rendu complet, indépendant de la boucle d'animation. */
    const draw = () => {
      resize();
      const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
      gl.uniformMatrix4fv(projectionLocation, false, perspective(1.15, aspect, 0.1, 10));
      gl.uniformMatrix4fv(viewLocation, false, lookAround(yaw, pitch));
      gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);
    };

    const loop = () => {
      draw();
      frame = requestAnimationFrame(loop);
    };

    // Une première image tout de suite, sans attendre la boucle : dans un
    // onglet masqué ou en arrière-plan, le navigateur suspend
    // `requestAnimationFrame` — le canvas resterait alors à sa taille par
    // défaut et la vue serait noire au retour.
    draw();
    observer = new ResizeObserver(() => draw());
    observer.observe(canvas);

    frame = requestAnimationFrame(loop);

    const start = (x: number, y: number) => {
      dragging = true;
      lastX = x;
      lastY = y;
      setHinted(false);
    };
    const move = (x: number, y: number) => {
      if (!dragging) return;
      yaw -= (x - lastX) * 0.005;
      // Bornes verticales : on n'autorise pas de passer par-dessus les pôles.
      pitch = Math.max(-1.35, Math.min(1.35, pitch + (y - lastY) * 0.005));
      lastX = x;
      lastY = y;
    };
    const end = () => {
      dragging = false;
    };

    const onMouseDown = (event: MouseEvent) => start(event.clientX, event.clientY);
    const onMouseMove = (event: MouseEvent) => move(event.clientX, event.clientY);
    const onTouchStart = (event: TouchEvent) => start(event.touches[0].clientX, event.touches[0].clientY);
    const onTouchMove = (event: TouchEvent) => {
      if (!dragging) return;
      event.preventDefault();
      move(event.touches[0].clientX, event.touches[0].clientY);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", end);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", end);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(uvBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
    };
  }, [src]);

  if (failed) {
    return (
      <figure className={`frame frame-plain ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- repli sans WebGL */}
        <img src={src} alt={alt} className="h-full w-full object-cover" />
        <figcaption className="absolute bottom-3 start-3 rounded-full bg-black/45 px-3 py-1 text-[0.68rem] text-white/80 backdrop-blur-md">
          Vue à plat — la navigation 360° demande WebGL
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={`frame frame-plain relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        aria-label={alt}
        role="img"
      />

      {hinted && ready && (
        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 px-4 py-2 text-[0.76rem] text-white backdrop-blur-md">
          <Compass size={13} className="me-1.5 inline" />
          Faites glisser pour regarder autour de vous
        </span>
      )}

      {!ready && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.78rem] text-white/70">
          Chargement de la vue…
        </span>
      )}

      {caption && (
        <figcaption className="pointer-events-none absolute bottom-3 start-3 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[0.68rem] text-white/85 backdrop-blur-md">
          <Maximize2 size={11} />
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
