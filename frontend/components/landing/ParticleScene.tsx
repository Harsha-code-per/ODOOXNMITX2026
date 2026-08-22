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
    worldPoint: new THREE.Vector3(0, -5, 0),
    targetWorldPoint: new THREE.Vector3(0, -5, 0),
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
    camera.position.set(0, 14, 42);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Pure transparent background
    container.appendChild(renderer.domElement);

    // 2. High-Density 3D Wave Mesh (Grid Plane)
    const gridCols = 90;
    const gridRows = 70;
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
        const z = (r - gridRows / 2) * gridSpacingZ - 8;
        const y = 0;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        origPositions[idx * 3] = x;
        origPositions[idx * 3 + 1] = y;
        origPositions[idx * 3 + 2] = z;

        // Depth and radial gradient palette
        const normR = r / gridRows;
        const normC = c / gridCols;
        const mixedColor = cyanColor
          .clone()
          .lerp(oceanColor, normR * 0.7)
          .lerp(tealColor, normC * 0.4)
          .lerp(slateColor, Math.random() * 0.15);

        colors[idx * 3] = mixedColor.r;
        colors[idx * 3 + 1] = mixedColor.g;
        colors[idx * 3 + 2] = mixedColor.b;

        idx++;
      }
    }

    planeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    planeGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Shader for Dynamic Responsive Point Nodes
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
          vAlpha = smoothstep(100.0, 20.0, depth) * 0.85;

          // Proximity to mouse world point illuminates vertices
          float distToMouse = length(position.xz - uMouseWorld.xz);
          float mouseGlow = smoothstep(16.0, 0.0, distToMouse);
          vAlpha += mouseGlow * 0.35;

          gl_PointSize = clamp(260.0 / depth, 3.5, 10.0) * (1.0 + mouseGlow * 0.6);
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

    // Connected Lattice Lines
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

    // 3. Central/Right 3D Digital Twin Orbital Hologram (Shifted far right)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(34, 3, -16); // Placed further right to frame the hero perfectly

    // Geodesic 3D Sphere Wireframe
    const sphereGeo = new THREE.IcosahedronGeometry(7.5, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0891b2,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    coreGroup.add(coreSphere);

    // Holographic Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(9.2, 0.06, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.32 });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(10.6, 0.06, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x0891b2, transparent: true, opacity: 0.22 });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.y = Math.PI / 3.5;
    ring2.rotation.z = Math.PI / 6;
    coreGroup.add(ring2);

    // Central Floating Glow Core
    const innerSphereGeo = new THREE.IcosahedronGeometry(3.5, 1);
    const innerSphereMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const innerCore = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    coreGroup.add(innerCore);

    scene.add(coreGroup);

    // 4. Mouse 3D Raycasting & Tracking
    const raycaster = new THREE.Raycaster();
    const ndcMouse = new THREE.Vector2(-999, -999);
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 5); // Ground intersection plane at y=-5
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

    // 5. 60FPS High-Performance Kinetic Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse spring physics
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      mouseRef.current.worldPoint.lerp(mouseRef.current.targetWorldPoint, 0.1);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const mouseW = mouseRef.current.worldPoint;
      const scroll = scrollRef.current;

      // Real-time Vertex Deformation with Harmonic Sine Waves & Mouse Ripple Waves
      const posArray = planeGeo.attributes.position.array as Float32Array;
      let pIdx = 0;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const ox = origPositions[pIdx * 3];
          const oz = origPositions[pIdx * 3 + 2];

          // 1. Natural Organic Harmonic Topography
          const harmonic1 = Math.sin(ox * 0.07 + elapsedTime * 1.3) * Math.cos(oz * 0.07 + elapsedTime * 1.0) * 3.5;
          const harmonic2 = Math.sin(ox * 0.14 - oz * 0.09 + elapsedTime * 0.8) * 1.5;

          // 2. High-Impact Mouse Dynamic Ripple (Interactive Liquid Physics)
          let mouseRipple = 0;
          if (mouseRef.current.isHovering) {
            const dist = Math.hypot(ox - mouseW.x, oz - mouseW.z);
            if (dist < 28.0) {
              const ripplePhase = dist * 0.5 - elapsedTime * 4.5;
              const damp = Math.exp(-dist * 0.1);
              mouseRipple = Math.sin(ripplePhase) * damp * 3.8;
            }
          }

          // 3. Scroll Dynamic Elevation Morph
          const scrollElevation = Math.sin(ox * 0.06 + scroll * Math.PI * 2) * (scroll * 4.0);

          posArray[pIdx * 3 + 1] = harmonic1 + harmonic2 + mouseRipple + scrollElevation - 6.5;
          pIdx++;
        }
      }

      planeGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.position.needsUpdate = true;

      // Rotate Digital Twin Hologram
      coreSphere.rotation.x = elapsedTime * 0.12;
      coreSphere.rotation.y = elapsedTime * 0.18;
      innerCore.rotation.x = -elapsedTime * 0.25;
      innerCore.rotation.y = -elapsedTime * 0.3;
      ring1.rotation.z = elapsedTime * 0.22;
      ring2.rotation.x = elapsedTime * 0.16;

      // Scrollytelling Choreography
      const targetCamX = mouseX * 5 - scroll * 6;
      const targetCamY = 14 - scroll * 10 + mouseY * 2.5;
      const targetCamZ = 42 - scroll * 14;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(scroll * 6, -4, -12);

      // Shift sphere position along scroll trajectory
      coreGroup.position.x = 34 - scroll * 42;
      coreGroup.position.y = 3 + scroll * 7;

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
      sphereGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      innerSphereGeo.dispose();
      pointMaterial.dispose();
      lineMat.dispose();
      sphereMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      innerSphereMat.dispose();
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
