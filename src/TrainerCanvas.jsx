import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TrainerCanvas() {
  const mountRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Example: Moving target
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const target = new THREE.Mesh(geometry, material);
    scene.add(target);
    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      target.position.x = Math.sin(Date.now() * 0.001) * 2;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
}