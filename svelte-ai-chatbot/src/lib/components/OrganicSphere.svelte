<script>
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	export let isLoading = false;
	export let isSpeaking = false;
	export let size = 48; // Default size in pixels
	export let vibrant = false; // Enable vibrant Jarvis mode

	let container;
	let scene, camera, renderer, sphere;
	let animationId;

	onMount(() => {
		if (!container) return;

		// Scene setup
		scene = new THREE.Scene();
		scene.background = null; // Transparent background

		// Camera setup
		camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
		camera.position.z = 3;

		// Renderer setup
		renderer = new THREE.WebGLRenderer({ 
			alpha: true, 
			antialias: true,
			powerPreference: 'high-performance'
		});
		renderer.setSize(size, size);
		renderer.setPixelRatio(window.devicePixelRatio);
		container.appendChild(renderer.domElement);

		// Create organic sphere geometry with noise
		const geometry = new THREE.SphereGeometry(1, 32, 32);
		
		// Add organic deformation to vertices using Perlin-like noise
		const positions = geometry.attributes.position;
		const noiseScale = 0.08;
		
		for (let i = 0; i < positions.count; i++) {
			const x = positions.getX(i);
			const y = positions.getY(i);
			const z = positions.getZ(i);
			
			// Create organic noise pattern
			const noise1 = Math.sin(x * 5 + y * 3) * Math.cos(z * 4);
			const noise2 = Math.sin(y * 6 + z * 2) * Math.cos(x * 3);
			const noise3 = Math.sin(z * 4 + x * 5) * Math.cos(y * 2);
			
			const combinedNoise = (noise1 + noise2 + noise3) / 3;
			
			// Apply noise along the normal direction for organic deformation
			const length = Math.sqrt(x * x + y * y + z * z);
			const normalizedX = x / length;
			const normalizedY = y / length;
			const normalizedZ = z / length;
			
			positions.setXYZ(
				i,
				x + normalizedX * combinedNoise * noiseScale,
				y + normalizedY * combinedNoise * noiseScale,
				z + normalizedZ * combinedNoise * noiseScale
			);
		}
		geometry.computeVertexNormals();

		// Create organic material with gradient-like appearance
		const baseColor = vibrant ? 0x00d4ff : 0x8b5cf6; // Cyan-blue for Jarvis
		const emissiveColor = vibrant ? 0x00ffff : 0x6366f1;
		const emissiveIntensity = vibrant ? 0.4 : 0.15;
		
		const material = new THREE.MeshStandardMaterial({
			color: baseColor,
			metalness: vibrant ? 0.6 : 0.2,
			roughness: vibrant ? 0.1 : 0.3,
			emissive: emissiveColor,
			emissiveIntensity: emissiveIntensity,
			transparent: false,
			flatShading: false
		});

		// Create sphere mesh
		sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);

		// Add lights - more intense for vibrant mode
		const ambientIntensity = vibrant ? 0.8 : 0.6;
		const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
		scene.add(ambientLight);

		const dir1Intensity = vibrant ? 1.2 : 0.8;
		const directionalLight1 = new THREE.DirectionalLight(0xffffff, dir1Intensity);
		directionalLight1.position.set(5, 5, 5);
		scene.add(directionalLight1);

		const dir2Color = vibrant ? 0x00ffff : 0x8b5cf6;
		const dir2Intensity = vibrant ? 0.8 : 0.4;
		const directionalLight2 = new THREE.DirectionalLight(dir2Color, dir2Intensity);
		directionalLight2.position.set(-5, -5, -5);
		scene.add(directionalLight2);

		// Add point light for glow effect - brighter for vibrant mode
		const pointColor = vibrant ? 0x00ffff : 0x6366f1;
		const pointIntensity = vibrant ? 1.0 : 0.5;
		const pointLight = new THREE.PointLight(pointColor, pointIntensity, 10);
		pointLight.position.set(0, 0, 2);
		scene.add(pointLight);

		// Animation loop
		let time = 0;
		const animate = () => {
			animationId = requestAnimationFrame(animate);
			time += 0.008;

			if (isSpeaking) {
				// More energetic, faster rotation
				const rotationSpeed = vibrant ? 0.03 : 0.02;
				sphere.rotation.x = Math.sin(time * 1.2) * 0.3 + Math.cos(time * 0.8) * 0.15;
				sphere.rotation.y += rotationSpeed;
				sphere.rotation.z = Math.cos(time * 1.0) * 0.25 + Math.sin(time * 0.6) * 0.1;

				// Dynamic pulsing/breathing effect - like Jarvis "thinking"
				const pulse1 = Math.sin(time * 4) * (vibrant ? 0.2 : 0.15);
				const pulse2 = Math.cos(time * 3) * (vibrant ? 0.15 : 0.1);
				const pulse = 1 + pulse1 + pulse2;
				sphere.scale.set(pulse, pulse, pulse);

				// Intense glow and color shifts
				const baseEmissive = vibrant ? 0.5 : 0.3;
				material.emissiveIntensity = baseEmissive + Math.sin(time * 5) * (vibrant ? 0.4 : 0.3);
				
				// Dynamic color shifts - cyan for Jarvis when vibrant
				if (vibrant) {
					const hue = 0.5 + Math.sin(time * 3) * 0.1; // Cyan range
					const saturation = 0.9 + Math.sin(time * 2) * 0.1;
					material.color.setHSL(hue, saturation, 0.7);
				} else {
					const hueShift = Math.sin(time * 3) * 0.15;
					const saturation = 0.7 + Math.sin(time * 2) * 0.2;
					material.color.setHSL(0.7 + hueShift, saturation, 0.65);
				}

				// More active floating motion
				sphere.position.y = Math.sin(time * 1.5) * 0.15 + Math.cos(time * 1.2) * 0.08;
				sphere.position.x = Math.sin(time * 0.8) * 0.05;
			} else if (isLoading) {
				// Pulsing effect when loading
				const pulse = 1 + Math.sin(time * 2.5) * 0.12;
				sphere.scale.set(pulse, pulse, pulse);
				
				// Dynamic emissive intensity
				material.emissiveIntensity = 0.15 + Math.sin(time * 2.5) * 0.2;
				
				// Slight color shift
				const hueShift = Math.sin(time * 2) * 0.1;
				material.color.setHSL(0.7 + hueShift, 0.6, 0.6);

				// Gentle floating motion
				sphere.position.y = Math.sin(time * 0.7) * 0.08 + Math.cos(time * 0.5) * 0.03;
				sphere.position.x = 0;
				
				// Organic rotation
				sphere.rotation.x = Math.sin(time * 0.4) * 0.15 + Math.cos(time * 0.6) * 0.05;
				sphere.rotation.y += 0.008;
				sphere.rotation.z = Math.cos(time * 0.5) * 0.1 + Math.sin(time * 0.3) * 0.05;
			} else {
				// Idle state - calm and subtle, but still vibrant if enabled
				sphere.scale.set(1, 1, 1);
				const idleEmissive = vibrant ? 0.3 : 0.15;
				material.emissiveIntensity = idleEmissive;
				
				if (vibrant) {
					material.color.setHSL(0.5, 0.8, 0.65); // Cyan for Jarvis
				} else {
					material.color.setHSL(0.7, 0.6, 0.6);
				}

				// Gentle floating motion with organic variation
				sphere.position.y = Math.sin(time * 0.7) * 0.08 + Math.cos(time * 0.5) * 0.03;
				sphere.position.x = 0;

				// Organic, fluid rotation with multiple frequencies
				sphere.rotation.x = Math.sin(time * 0.4) * 0.15 + Math.cos(time * 0.6) * 0.05;
				sphere.rotation.y += 0.008;
				sphere.rotation.z = Math.cos(time * 0.5) * 0.1 + Math.sin(time * 0.3) * 0.05;
			}

			renderer.render(scene, camera);
		};

		animate();
	});

	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		if (renderer) {
			renderer.dispose();
		}
		if (sphere) {
			sphere.geometry.dispose();
			sphere.material.dispose();
		}
		if (container && renderer) {
			container.removeChild(renderer.domElement);
		}
	});
</script>

<div class="organic-sphere-container" bind:this={container} style="width: {size}px; height: {size}px;"></div>

<style>
	.organic-sphere-container {
		position: relative;
		overflow: hidden;
	}
</style>

