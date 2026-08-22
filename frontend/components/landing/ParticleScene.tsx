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

    // 1. Three.js Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 13, 44);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Pure transparent for studio light canvas
    container.appendChild(renderer.domElement);

    // 2. Dynamic 3D Geometric Wave Grid (Lines + Points)
    const gridCols = 84;
    const gridRows = 64;
    const gridSpacingX = 1.45;
    const gridSpacingZ = 1.45;
    const totalPoints = gridCols * gridRows;

    const planeGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(totalPoints * 3);
    const origPositions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);

    const cyanColor = new THREE.Color("#0891B2");
    const deepBlueColor = new THREE.Color("#0284C7");
    const slateColor = new THREE.Color("#64748B");

    let idx = 0;
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const x = (c - gridCols / 2) * gridSpacingX;
        const z = (r - gridRows / 2) * gridSpacingZ - 8;
        const y = 0;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        origPositions[idx * 3] = x;
        origPositions[idx * 3 + 1] = y;
        origPositions[idx * 3 + 2] = z;

        // Depth & position color gradient
        const t = (r / gridRows) * 0.7 + (c / gridCols) * 0.3;
        const col = cyanColor.clone().lerp(deepBlueColor, t).lerp(slateColor, Math.random() * 0.2);
        colors[idx * 3] = col.r;
        colors[idx * 3 + 1] = col.g;
        colors[idx * 3 + 2] = col.b;

        idx++;
      }
    }

    planeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    planeGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom shader for visible, crisp particle nodes
    const pointMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform vec2 uMouse;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Distance falloff for subtle depth fading
          float depth = -mvPosition.z;
          vAlpha = smoothstep(95.0, 18.0, depth) * 0.8;

          // Crisp, high-DPI point size
          gl_PointSize = clamp(240.0 / depth, 3.0, 9.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float circleAlpha = smoothstep(0.5, 0.1, dist) * vAlpha;
          gl_FragColor = vec4(vColor, circleAlpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      transparent: true,
      depthWrite: false,
    });

    const pointMesh = new THREE.Points(planeGeo, pointMaterial);
    scene.add(pointMesh);

    // 3. Connected 3D Wireframe Lattice Lines
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
      opacity: 0.18,
      blending: THREE.NormalBlending,
    });

    const gridLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(gridLines);

    // 4. Central 3D Digital Twin Orbital Hologram
    const coreGroup = new THREE.Group();
    coreGroup.position.set(24, 2, -18);

    const sphereGeo = new THREE.IcosahedronGeometry(7, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0891b2,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    coreGroup.add(coreSphere);

    const ring1Geo = new THREE.TorusGeometry(8.5, 0.05, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.28 });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(9.8, 0.05, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x0891b2, transparent: true, opacity: 0.2 });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    scene.add(coreGroup);

    // 5. Mouse Event Listeners with Inertia Lerp
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // 6. 60FPS Kinetic Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse spring physics
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const scroll = scrollRef.current;

      // Deform 3D grid vertices
      const posArray = planeGeo.attributes.position.array as Float32Array;
      let pIdx = 0;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const ox = origPositions[pIdx * 3];
          const oz = origPositions[pIdx * 3 + 2];

          // 3D Harmonic Wave Equation (Low baseline so it cradles underneath hero)
          const wave1 = Math.sin(ox * 0.07 + elapsedTime * 1.3) * Math.cos(oz * 0.07 + elapsedTime * 1.0) * 3.4;
          const wave2 = Math.sin(ox * 0.14 - oz * 0.09 + elapsedTime * 0.7) * 1.4;

          // Interactive mouse depression
          const distToMouse = Math.hypot(ox - mouseX * 30, oz - mouseY * 20);
          const mouseDisplace = Math.max(0, 16 - distToMouse) * 0.2;

          // Scroll lift transformation
          const scrollElevation = Math.sin(ox * 0.05 + scroll * Math.PI * 2) * (scroll * 3.5);

          posArray[pIdx * 3 + 1] = wave1 + wave2 + mouseDisplace + scrollElevation - 6.5;
          pIdx++;
        }
      }

      planeGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.position.needsUpdate = true;

      // Rotate central orbital structure
      coreSphere.rotation.x = elapsedTime * 0.12;
      coreSphere.rotation.y = elapsedTime * 0.18;
      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.x = elapsedTime * 0.15;

      // Scrollytelling Choreography
      const targetCamX = mouseX * 4 - scroll * 6;
      const targetCamY = 13 - scroll * 10 + mouseY * 2.5;
      const targetCamZ = 44 - scroll * 14;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(scroll * 8, -4, -12);

      coreGroup.position.x = 24 - scroll * 38;
      coreGroup.position.y = 2 + scroll * 6;

      pointMaterial.uniforms.uTime.value = elapsedTime;
      pointMaterial.uniforms.uMouse.value.set(mouseX, mouseY);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      planeGeo.dispose();
      lineGeo.dispose();
      sphereGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      pointMaterial.dispose();
      lineMat.dispose();
      sphereMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
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
