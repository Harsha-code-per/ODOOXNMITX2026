"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleSceneProps {
  scrollProgress?: number;
}

export function ParticleScene({ scrollProgress = 0 }: ParticleSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 45);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent to blend seamlessly with light background
    container.appendChild(renderer.domElement);

    // 2. Particle Geometry (30,000 Points)
    const particleCount = 32000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const vortexPositions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color("#06B6D4"); // Cyan
    const color2 = new THREE.Color("#0284C7"); // Ocean Blue
    const color3 = new THREE.Color("#0D9488"); // Teal

    for (let i = 0; i < particleCount; i++) {
      // Wavy Grid plane
      const x = (Math.random() - 0.5) * 110;
      const z = (Math.random() - 0.5) * 130;
      const y = (Math.random() - 0.5) * 4 - 2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Target Spiral Vortex (for deep scroll stage)
      const angle = i * 0.05;
      const radius = 2.0 + (i / particleCount) * 18.0;
      vortexPositions[i * 3] = Math.cos(angle) * radius;
      vortexPositions[i * 3 + 1] = ((i / particleCount) - 0.5) * 30.0;
      vortexPositions[i * 3 + 2] = Math.sin(angle) * radius - 15.0;

      scales[i] = Math.random() * 0.7 + 0.3;

      // Palette blending
      const mixedColor = color1.clone().lerp(color2, Math.random() * 0.6).lerp(color3, Math.random() * 0.4);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aVortexPos", new THREE.BufferAttribute(vortexPositions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // 3. Custom GLSL Shaders for Mesh3D-style fluid undulation
    const vertexShader = `
      uniform float uTime;
      uniform float uScroll;
      uniform vec2 uMouse;
      attribute vec3 aVortexPos;
      attribute float aScale;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vDepth;

      void main() {
        vColor = color;
        
        // Morph between wave terrain plane and spiral vortex
        float morphProgress = smoothstep(0.3, 0.95, uScroll);
        vec3 morphedPos = mix(position, aVortexPos, morphProgress);

        // Fluid 3D Wave elevation
        float wave1 = sin(morphedPos.x * 0.12 + uTime * 1.2) * cos(morphedPos.z * 0.12 + uTime * 0.9) * 4.5;
        float wave2 = sin(morphedPos.x * 0.25 - uTime * 0.8 + uMouse.x * 2.0) * 1.5;
        morphedPos.y += (wave1 + wave2) * (1.0 - morphProgress * 0.5);

        // Interactive mouse displacement ripple
        float mouseDist = length(morphedPos.xz - uMouse * 35.0);
        float mouseInfluence = smoothstep(18.0, 0.0, mouseDist);
        morphedPos.y += mouseInfluence * 3.5;

        vec4 mvPosition = modelViewMatrix * vec4(morphedPos, 1.0);
        vDepth = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;

        // Size attenuation based on perspective camera distance
        gl_PointSize = (aScale * 38.0) / -mvPosition.z;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vDepth;

      void main() {
        // Soft glowing circular point disc with gaussian falloff
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.05, dist);

        // Studio Light Mode Opacity (Crisp bright cyan particles)
        gl_FragColor = vec4(vColor, alpha * 0.75);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 4. Mouse Interactivity Listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 5. Resize Listener
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // 6. Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      uniforms.uTime.value = elapsedTime;
      uniforms.uScroll.value = THREE.MathUtils.lerp(uniforms.uScroll.value, scrollRef.current, 0.08);
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      // Camera orbital float & scroll trajectory
      const targetCamY = 15 - uniforms.uScroll.value * 12;
      const targetCamZ = 45 - uniforms.uScroll.value * 20;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.position.x = mouseRef.current.x * 4;
      camera.lookAt(0, 0, -5);

      particles.rotation.y = elapsedTime * 0.03 + uniforms.uScroll.value * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}
