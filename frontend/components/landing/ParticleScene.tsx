"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleSceneProps {
  scrollProgress?: number;
}

export function ParticleScene({ scrollProgress = 0 }: ParticleSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(0);
  const mouseRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    worldPoint: THREE.Vector3;
    targetWorldPoint: THREE.Vector3;
    isHovering: boolean;
  }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    worldPoint: new THREE.Vector3(0, -8, 0),
    targetWorldPoint: new THREE.Vector3(0, -8, 0),
    isHovering: false,
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
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 13, 40);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Pure transparent for studio light canvas
    container.appendChild(renderer.domElement);

    // 2. High-Density 3D Geometric Wave Grid
    const gridCols = 88;
    const gridRows = 66;
    const gridSpacingX = 1.45;
    const gridSpacingZ = 1.45;
    const totalPoints = gridCols * gridRows;

    const planeGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(totalPoints * 3);
    const origPositions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);

    const cyanColor = new THREE.Color("#0891B2");
    const oceanColor = new THREE.Color("#0284C7");
    const tealColor = new THREE.Color("#0D9488");
    const slateColor = new THREE.Color("#64748B");

    let idx = 0;
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const x = (c - gridCols / 2) * gridSpacingX;
        const z = (r - gridRows / 2) * gridSpacingZ - 6;
        const y = 0;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        origPositions[idx * 3] = x;
        origPositions[idx * 3 + 1] = y;
        origPositions[idx * 3 + 2] = z;

        // Dynamic depth & radial color palette
        const normR = r / gridRows;
        const normC = c / gridCols;
        const mixedColor = cyanColor
          .clone()
          .lerp(oceanColor, normR * 0.7)
          .lerp(tealColor, normC * 0.35)
          .lerp(slateColor, Math.abs(normC - 0.5) * 0.2);

        colors[idx * 3] = mixedColor.r;
        colors[idx * 3 + 1] = mixedColor.g;
        colors[idx * 3 + 2] = mixedColor.b;

        idx++;
      }
    }

    planeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    planeGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Shader for Responsive Point Nodes
    const pointMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform vec3 uMouseWorld;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          float depth = -mvPosition.z;
          vAlpha = smoothstep(95.0, 16.0, depth) * 0.8;

          // Proximity to mouse world point illuminates vertices
          float distToMouse = length(position.xz - uMouseWorld.xz);
          float mouseGlow = smoothstep(18.0, 0.0, distToMouse);
          vAlpha += mouseGlow * 0.3;

          gl_PointSize = clamp(220.0 / depth, 3.0, 8.5) * (1.0 + mouseGlow * 0.45);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float circleAlpha = smoothstep(0.5, 0.12, dist) * vAlpha;
          gl_FragColor = vec4(vColor, circleAlpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uMouseWorld: { value: new THREE.Vector3(0, 0, 0) },
      },
      transparent: true,
      depthWrite: false,
    });

    const pointMesh = new THREE.Points(planeGeo, pointMaterial);
    scene.add(pointMesh);

    // Connected Lattice Lines (Clean, Crisp & Visible)
    const lineIndices: number[] = [];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const current = r * gridCols + c;
        if (c < gridCols - 1) {
          lineIndices.push(current, current + 1);
        }
        if (r < gridRows - 1) {
          lineIndices.push(current, current + gridCols);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    lineGeo.setIndex(lineIndices);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x0891b2,
      transparent: true,
      opacity: 0.16,
      blending: THREE.NormalBlending,
    });

    const gridLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(gridLines);

    // 3. Mouse 3D Raycasting & Tracking
    const raycaster = new THREE.Raycaster();
    const ndcMouse = new THREE.Vector2(-999, -999);
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 8);
    const intersectPoint = new THREE.Vector3();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.isHovering = true;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;

      ndcMouse.set(x, y);
      raycaster.setFromCamera(ndcMouse, camera);

      if (raycaster.ray.intersectPlane(groundPlane, intersectPoint)) {
        mouseRef.current.targetWorldPoint.copy(intersectPoint);
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.targetWorldPoint.set(999, 999, 999);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // 4. 60FPS Kinetic Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse spring physics
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;
      mouseRef.current.worldPoint.lerp(mouseRef.current.targetWorldPoint, 0.09);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const mouseW = mouseRef.current.worldPoint;
      const scroll = scrollRef.current;

      // Perfectly Calibrated Wave Equations: Lively, interactive, and elegant
      const posArray = planeGeo.attributes.position.array as Float32Array;
      let pIdx = 0;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const ox = origPositions[pIdx * 3];
          const oz = origPositions[pIdx * 3 + 2];

          // Harmonic Wave Equation (Balanced 2.2 amplitude)
          const harmonic1 = Math.sin(ox * 0.065 + elapsedTime * 0.85) * Math.cos(oz * 0.065 + elapsedTime * 0.7) * 2.2;
          const harmonic2 = Math.sin(ox * 0.12 - oz * 0.08 + elapsedTime * 0.5) * 0.9;

          // Interactive Mouse Liquid Ripple (Smooth 1.8 amplitude)
          let mouseRipple = 0;
          if (mouseRef.current.isHovering) {
            const dist = Math.hypot(ox - mouseW.x, oz - mouseW.z);
            if (dist < 24.0) {
              const damp = Math.exp(-dist * 0.1);
              mouseRipple = Math.sin(dist * 0.45 - elapsedTime * 3.5) * damp * 1.8;
            }
          }

          // Dynamic Scroll Lift Transformation
          const scrollElevation = Math.sin(ox * 0.05 + scroll * Math.PI * 1.5) * (scroll * 3.0);

          posArray[pIdx * 3 + 1] = harmonic1 + harmonic2 + mouseRipple + scrollElevation - 8.0;
          pIdx++;
        }
      }

      planeGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.position.needsUpdate = true;

      // Camera Motion & Scrollytelling Choreography
      const targetCamX = mouseX * 4 - scroll * 6;
      const targetCamY = 13 - scroll * 8 + mouseY * 2.0;
      const targetCamZ = 40 - scroll * 12;

      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;
      camera.lookAt(scroll * 6, -5, -10);

      pointMaterial.uniforms.uTime.value = elapsedTime;
      pointMaterial.uniforms.uMouseWorld.value.copy(mouseW);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      planeGeo.dispose();
      lineGeo.dispose();
      pointMaterial.dispose();
      lineMat.dispose();
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
