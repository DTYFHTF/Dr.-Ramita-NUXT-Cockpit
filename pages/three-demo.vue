<template>
  <div class="enchanted-forest">
    <div class="overlay" v-if="!sceneLoaded">
      <div class="loader">
        <div class="spinner"></div>
        <div class="loading-text">Entering the Enchanted Forest...</div>
      </div>
    </div>
    
    <div class="ui-container" v-if="sceneLoaded">
      <div class="control-panel">
        <button @click="plantSeed" :disabled="activeSeedCount >= maxSeeds">Plant Seed</button>
        <button @click="resetScene">Reset Scene</button>
        <button @click="toggleLights">Toggle Magic Light</button>
        <button @click="toggleParticles">Toggle Particles</button>
      </div>
      
      <div class="seed-counter">
        Seeds: {{ activeSeedCount }}/{{ maxSeeds }}
      </div>
    </div>
    
    <div class="three-container" ref="container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

// Scene state
const container = ref(null);
const sceneLoaded = ref(false);
const activeSeedCount = ref(0);
const maxSeeds = 5;
const seedModels = ref([]);
const mushroomModels = ref([]);
const particlesEnabled = ref(true);
const magicLightEnabled = ref(true);

// Three.js variables
let scene, camera, renderer, controls, clock;
let ground, light, composer, ambientLight, fireflies;
let seeds = [];
let mushrooms = [];
let particleSystems = [];
let raycaster, mouse;
let growingSeeds = [];
let transformAnimations = [];
let animatedElements = [];
let waterRipple;
let mistEffect;

// Initialize scene
const initScene = () => {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x061623); // Dark blue for night effect
  scene.fog = new THREE.FogExp2(0x061623, 0.03);
  
  // Create clock for animations
  clock = new THREE.Clock();
  
  // Setup camera
  camera = new THREE.PerspectiveCamera(
    60,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 10);
  
  // Create renderer with antialiasing and shadow support
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance",
    alpha: true 
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.value.appendChild(renderer.domElement);
  
  // Setup camera controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.1; // Limit camera from going below ground
  controls.minDistance = 3;
  controls.maxDistance = 20;
  
  // Create raycaster for interaction
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // Setup post-processing
  setupPostProcessing();
  
  // Create scene environment
  createEnvironment();
  
  // Create additional scene elements after basic setup
  createSceneElements();
  
  // Load models
  loadModels();
  
  // Setup event listeners
  setupEventListeners();
  
  // Start animation loop
  animate();
};

// Post-processing setup
const setupPostProcessing = () => {
  composer = new EffectComposer(renderer);
  
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  
  // Add bloom effect for magical glow
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.7,  // strength
    0.4,  // radius
    0.85  // threshold
  );
  composer.addPass(bloomPass);
};

// Create environment (ground, lights, etc)
const createEnvironment = () => {
  // Create ground plane with more terrain detail
  const groundGeometry = new THREE.PlaneGeometry(30, 30, 100, 100);
  
  // Add terrain variation with gentle hills and valleys
  const positions = groundGeometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const z = positions[i+2];
    // Create gentle rolling hills with different frequency noise
    if (Math.abs(x) < 14 && Math.abs(z) < 14) {
      positions[i+1] = Math.sin(x * 0.3) * 0.3 + 
                      Math.sin(z * 0.4) * 0.3 + 
                      Math.sin((x * 0.1 + z * 0.2) * 2) * 0.2;
    }
  }
  
  // Update normals after changing positions
  groundGeometry.computeVertexNormals();
  
  // Create better ground material with grass texture and glow
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x225533,
    roughness: 0.7,
    metalness: 0.2,
    emissive: 0x001122,
    emissiveIntensity: 0.1
  });
  
  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.2;
  ground.receiveShadow = true;
  scene.add(ground);
  
  // Add a magical water effect (pond) in the center of the scene
  createMagicalPond();
  
  // Add mystical fog and ambient particles
  createMist();
  
  // Add ambient light with day/night cycle
  ambientLight = new THREE.AmbientLight(0x333366, 0.5);
  scene.add(ambientLight);
  
  // Add directional light for shadows
  const dirLight = new THREE.DirectionalLight(0xaaccff, 0.8);
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 50;
  dirLight.shadow.camera.left = -20;
  dirLight.shadow.camera.right = 20;
  dirLight.shadow.camera.top = 20;
  dirLight.shadow.camera.bottom = -20;
  scene.add(dirLight);
  
  // Add blue magic light with more intensity
  light = new THREE.PointLight(0x4466ff, 150, 15, 2);
  light.position.set(2, 2, 2);
  light.castShadow = true;
  scene.add(light);
  
  // Add some randomly placed rocks and vegetation
  createRocks();
  createGrassPatches();
  
  // Create fireflies effect
  createFireflies();
};

// Create a magical pond in the center
const createMagicalPond = () => {
  const pondGeometry = new THREE.CircleGeometry(4, 32);
  const pondMaterial = new THREE.MeshStandardMaterial({
    color: 0x3399ff,
    transparent: true,
    opacity: 0.8,
    roughness: 0.1,
    metalness: 0.6,
    emissive: 0x006699,
    emissiveIntensity: 0.5
  });
  
  const pond = new THREE.Mesh(pondGeometry, pondMaterial);
  pond.rotation.x = -Math.PI / 2;
  pond.position.y = -0.15; // Slightly above ground
  pond.receiveShadow = true;
  scene.add(pond);
  
  // Add ripple animation
  const ripple = {
    time: 0,
    update: (delta) => {
      ripple.time += delta;
      // Animate water ripples
      pond.material.emissiveIntensity = 0.3 + Math.sin(ripple.time * 2) * 0.2;
      pond.material.opacity = 0.7 + Math.sin(ripple.time * 1.5) * 0.1;
      // Subtle scale animation for water surface
      const scale = 1 + Math.sin(ripple.time) * 0.01;
      pond.scale.set(scale, 1, scale);
    }
  };
  
  // Create reflection glow
  const glowGeometry = new THREE.CircleGeometry(4.2, 32);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x66ccff,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending
  });
  
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.14;
  scene.add(glow);
  
  // Add lily pads
  for (let i = 0; i < 5; i++) {
    const lilySize = 0.3 + Math.random() * 0.3;
    const lilyGeometry = new THREE.CircleGeometry(lilySize, 8);
    const lilyMaterial = new THREE.MeshStandardMaterial({
      color: 0x116633,
      roughness: 0.8,
      emissive: 0x003311,
      emissiveIntensity: 0.2
    });
    
    const lily = new THREE.Mesh(lilyGeometry, lilyMaterial);
    lily.rotation.x = -Math.PI / 2;
    
    // Position around the pond
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 3;
    lily.position.x = Math.cos(angle) * radius;
    lily.position.z = Math.sin(angle) * radius;
    lily.position.y = -0.14;
    
    lily.receiveShadow = true;
    scene.add(lily);
    
    // Create lily flower (small glowing center)
    const flowerGeometry = new THREE.CircleGeometry(lilySize * 0.3, 8);
    const flowerMaterial = new THREE.MeshStandardMaterial({
      color: 0xffcc44,
      emissive: 0xffaa22,
      emissiveIntensity: 0.8
    });
    
    const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
    flower.rotation.x = -Math.PI / 2;
    flower.position.copy(lily.position);
    flower.position.y += 0.01;
    scene.add(flower);
  }
  
  return ripple;
};

// Create mystical mist/fog around the scene
const createMist = () => {
  const mistCount = 100;
  const mistGeometry = new THREE.BufferGeometry();
  const mistPositions = new Float32Array(mistCount * 3);
  const mistSizes = new Float32Array(mistCount);
  
  for (let i = 0; i < mistCount; i++) {
    const i3 = i * 3;
    
    // Position mist particles low to the ground in a wider area
    const radius = 5 + Math.random() * 15;
    const angle = Math.random() * Math.PI * 2;
    mistPositions[i3] = Math.cos(angle) * radius;
    mistPositions[i3 + 1] = Math.random() * 0.5; // Low to the ground
    mistPositions[i3 + 2] = Math.sin(angle) * radius;
    
    // Vary mist particle sizes
    mistSizes[i] = 0.8 + Math.random() * 1.5;
  }
  
  mistGeometry.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));
  mistGeometry.setAttribute('size', new THREE.BufferAttribute(mistSizes, 1));
  
  const mistMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x99aacc) }
    },
    vertexShader: `
      attribute float size;
      uniform float time;
      varying float vAlpha;
      
      void main() {
        // Create slow drifting motion for mist
        vec3 pos = position;
        float id = float(gl_VertexID);
        pos.x += sin(time * 0.2 + id * 0.1) * 0.3;
        pos.z += cos(time * 0.15 + id * 0.08) * 0.3;
        
        // Slow vertical motion for rising effect
        pos.y += sin(time * 0.1 + id * 0.05) * 0.1 + mod(time * 0.05 + id * 0.01, 0.5);
        
        // Vary opacity based on position and time
        vAlpha = 0.3 - abs(pos.y - 0.3) * 0.6;
        vAlpha *= 0.3 + 0.7 * sin(time * 0.1 + id * 0.5) * 0.5 + 0.5;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = size * (150.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vAlpha;
      
      void main() {
        // Soft circular particles for mist effect
        float d = length(gl_PointCoord - vec2(0.5));
        float opacity = smoothstep(0.5, 0.2, d) * vAlpha;
        gl_FragColor = vec4(color, opacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  const mist = new THREE.Points(mistGeometry, mistMaterial);
  scene.add(mist);
  
  return mist;
};

// Create natural-looking rocks
const createRocks = () => {
  const rockCount = 15;
  const rocks = [];
  
  for (let i = 0; i < rockCount; i++) {
    // Create varied rock shapes
    const detail = Math.floor(1 + Math.random() * 2);
    const rockGeometry = new THREE.DodecahedronGeometry(
      0.3 + Math.random() * 0.5, 
      detail
    );
    
    // Deform rock vertices for more natural look
    const positions = rockGeometry.attributes.position.array;
    for (let j = 0; j < positions.length; j += 3) {
      positions[j] *= 0.8 + Math.random() * 0.4;
      positions[j+1] *= 0.8 + Math.random() * 0.4;
      positions[j+2] *= 0.8 + Math.random() * 0.4;
    }
    
    // Update geometry after deformation
    rockGeometry.computeVertexNormals();
    
    // Rock material with slight variation
    const rockMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.05 + Math.random() * 0.05, 0.1, 0.3 + Math.random() * 0.2),
      roughness: 0.8 + Math.random() * 0.2,
      metalness: 0.1 + Math.random() * 0.1
    });
    
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    
    // Position randomly on the ground, but not in the pond
    let validPosition = false;
    let x, z;
    
    while (!validPosition) {
      x = (Math.random() - 0.5) * 20;
      z = (Math.random() - 0.5) * 20;
      
      // Keep rocks away from the center pond
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter > 5) {
        validPosition = true;
      }
    }
    
    // Sample ground height at this position (approximately)
    let y = -0.2;
    // Add the terrain height approximation
    y += Math.sin(x * 0.3) * 0.3 + Math.sin(z * 0.4) * 0.3;
    
    rock.position.set(x, y, z);
    rock.rotation.set(
      Math.random() * Math.PI, 
      Math.random() * Math.PI, 
      Math.random() * Math.PI
    );
    
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);
    rocks.push(rock);
  }
  
  return rocks;
};

// Create patches of grass blades
const createGrassPatches = () => {
  const patchCount = 10;
  const patches = [];
  
  for (let p = 0; p < patchCount; p++) {
    // Position for this patch
    let x, z;
    let validPosition = false;
    
    while (!validPosition) {
      x = (Math.random() - 0.5) * 20;
      z = (Math.random() - 0.5) * 20;
      
      // Keep grass away from the center pond
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter > 5) {
        validPosition = true;
      }
    }
    
    // Create 15-30 blades per patch
    const bladeCount = 15 + Math.floor(Math.random() * 15);
    const patchSize = 1.5 + Math.random() * 1.5;
    
    for (let i = 0; i < bladeCount; i++) {
      // Create a blade of grass with a tapered rectangle
      const height = 0.3 + Math.random() * 0.4;
      const width = 0.05 + Math.random() * 0.05;
      
      const bladeGeometry = new THREE.PlaneGeometry(width, height, 1, 3);
      
      // Taper the blade by moving the top vertices inward
      const positions = bladeGeometry.attributes.position.array;
      const topLeftIndex = 3; // Top left vertex
      const topRightIndex = 9; // Top right vertex
      
      // Move the top points inward to create a tapered shape
      positions[topLeftIndex] = positions[topLeftIndex] + width * 0.3;
      positions[topRightIndex] = positions[topRightIndex] - width * 0.3;
      
      bladeGeometry.computeVertexNormals();
      
      // Create grass material with subtle glow
      const bladeColor = Math.random() > 0.8 ? 0xddff55 : 0x88aa44; // Occasional lighter blade
      const bladeMaterial = new THREE.MeshStandardMaterial({
        color: bladeColor,
        roughness: 0.8,
        metalness: 0.1,
        emissive: 0x225511,
        emissiveIntensity: 0.1 + Math.random() * 0.1,
        side: THREE.DoubleSide
      });
      
      const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
      
      // Position blade within the patch
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * patchSize;
      blade.position.x = x + Math.cos(angle) * radius;
      blade.position.z = z + Math.sin(angle) * radius;
      
      // Place on ground
      let y = -0.2;
      // Add terrain height approximation
      y += Math.sin(blade.position.x * 0.3) * 0.3 + Math.sin(blade.position.z * 0.4) * 0.3;
      blade.position.y = y + height / 2; // Position from bottom of blade
      
      // Rotate to stand upright with random variation
      blade.rotation.y = Math.random() * Math.PI;
      // Slight random lean
      const rotX = (Math.random() - 0.5) * 0.2;
      const rotZ = (Math.random() - 0.5) * 0.2;
      blade.rotation.x = rotX;
      blade.rotation.z = rotZ;
      
      blade.castShadow = true;
      blade.receiveShadow = true;
      scene.add(blade);
      
      // Add slight animation to the blade and store the initial rotation
      const animData = {
        blade,
        baseRotation: { x: rotX, y: blade.rotation.y, z: rotZ },
        speed: 0.3 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        intensity: 0.05 + Math.random() * 0.05
      };
      patches.push(animData);
    }
  }
  
  return patches;
};

// Create firefly particle effect with improved animation
const createFireflies = () => {
  const fireflyCount = 200;
  const fireflyGeometry = new THREE.BufferGeometry();
  const fireflyPositions = new Float32Array(fireflyCount * 3);
  const fireflyColors = new Float32Array(fireflyCount * 3);
  const fireflyScales = new Float32Array(fireflyCount);
  const fireflyOffset = new Float32Array(fireflyCount);
  
  // Create random positions for fireflies
  for (let i = 0; i < fireflyCount; i++) {
    const i3 = i * 3;
    
    // Position fireflies in a dome shape above the ground
    const radius = 10 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.5;
    
    fireflyPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);     // x
    fireflyPositions[i3 + 1] = Math.random() * 5 + 0.5;                  // y
    fireflyPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta); // z
    
    // Create color variation from blue to green with some randomness
    const colorType = Math.random();
    if (colorType < 0.6) {
      // Blue-cyan fireflies (60%)
      fireflyColors[i3] = 0.4 + Math.random() * 0.2;       // r (blue to cyan)
      fireflyColors[i3 + 1] = 0.7 + Math.random() * 0.3;   // g (green)
      fireflyColors[i3 + 2] = 0.8 + Math.random() * 0.2;   // b (blue)
    } else if (colorType < 0.9) {
      // Green-yellow fireflies (30%)
      fireflyColors[i3] = 0.7 + Math.random() * 0.3;       // r (yellow)
      fireflyColors[i3 + 1] = 0.8 + Math.random() * 0.2;   // g (green)
      fireflyColors[i3 + 2] = 0.2 + Math.random() * 0.2;   // b (low blue)
    } else {
      // Purple-pink fireflies (10%)
      fireflyColors[i3] = 0.7 + Math.random() * 0.3;       // r (red)
      fireflyColors[i3 + 1] = 0.3 + Math.random() * 0.2;   // g (low green)
      fireflyColors[i3 + 2] = 0.8 + Math.random() * 0.2;   // b (high blue)
    }
    
    // Random particle sizes
    fireflyScales[i] = 0.8 + Math.random() * 2;
    
    // Random animation offset
    fireflyOffset[i] = Math.random() * Math.PI * 2;
  }
  
  // Set geometry attributes
  fireflyGeometry.setAttribute('position', new THREE.BufferAttribute(fireflyPositions, 3));
  fireflyGeometry.setAttribute('color', new THREE.BufferAttribute(fireflyColors, 3));
  fireflyGeometry.setAttribute('scale', new THREE.BufferAttribute(fireflyScales, 1));
  fireflyGeometry.setAttribute('offset', new THREE.BufferAttribute(fireflyOffset, 1));
  
  // Create particle material with custom shader for better animation
  const fireflyMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pixelRatio: { value: window.devicePixelRatio }
    },
    vertexShader: `
      attribute vec3 color;
      attribute float scale;
      attribute float offset;
      
      uniform float time;
      uniform float pixelRatio;
      
      varying vec3 vColor;
      varying float vIntensity;
      
      void main() {
        vColor = color;
        
        // Animate the fireflies with more natural movement
        vec3 pos = position;
        
        // Add gentle floating motion
        float uniqueSpeed = 0.3 + 0.2 * sin(offset);
        float timeOffset = time * uniqueSpeed + offset;
        
        // Create a more natural fluttering motion
        pos.x += sin(timeOffset * 0.5) * 0.3 + sin(timeOffset * 0.2) * 0.1;
        pos.y += sin(timeOffset * 0.3 + offset * 2.0) * 0.2 + sin(timeOffset * 0.1) * 0.1;
        pos.z += cos(timeOffset * 0.4) * 0.3 + cos(timeOffset * 0.15) * 0.2;
        
        // Create pulsing intensity for glow effect
        vIntensity = 0.5 + 0.5 * sin(timeOffset * 2.0 + offset);
        
        // Scale points based on attribute and make them pulse
        float s = scale * (0.8 + 0.4 * vIntensity);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = s * pixelRatio * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vIntensity;
      
      void main() {
        // Create circular particles with soft edges
        float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
        float strength = 1.0 - smoothstep(0.0, 0.5, distanceFromCenter);
        
        // Apply intensity variation to create pulsing glow
        vec3 glowColor = vColor * vIntensity;
        float opacity = strength * (0.5 + 0.5 * vIntensity);
        
        gl_FragColor = vec4(glowColor, opacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  // Create the particle system
  fireflies = new THREE.Points(fireflyGeometry, fireflyMaterial);
  scene.add(fireflies);
  
  // Store in particle systems array
  particleSystems.push(fireflies);
};

// Create environment once the scene is set up
const createSceneElements = () => {
  // Create enhanced water ripple
  waterRipple = createMagicalPond();
  
  // Create mist effect
  mistEffect = createMist();
  
  // Create grass with animation
  const grassPatches = createGrassPatches();
  
  // Save animated elements for updates
  animatedElements = {
    grassPatches,
    waterRipple,
    mistEffect
  };
};

// Load 3D models
const loadModels = () => {
  // Create a loading manager to track progress and handle when all models are loaded
  const loadingManager = new THREE.LoadingManager(
    // onLoad callback - called when all models are loaded
    () => {
      console.log('All models loaded successfully');
      sceneLoaded.value = true;
    },
    // onProgress callback
    (url, loaded, total) => {
      const progress = (loaded / total) * 100;
      console.log(`Loading: ${progress.toFixed(0)}%`);
    },
    // onError callback
    (url) => {
      console.error(`Error loading ${url}`);
      // Even if some models fail, still mark as loaded so the user can interact
      sceneLoaded.value = true;
    }
  );
  
  const loader = new GLTFLoader(loadingManager);
  
  // Set path to models directory
  loader.setPath('/models/');
  
  // Fallback models in case loading fails
  const createFallbackSeed = () => {
    const geometry = new THREE.ConeGeometry(0.2, 0.4, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.7,
      metalness: 0.2
    });
    const mesh = new THREE.Object3D();
    mesh.add(new THREE.Mesh(geometry, material));
    seedModels.value.push(mesh);
    sceneLoaded.value = true;
  };
  
  const createFallbackMushroom = () => {
    const capGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0xff5588,
      roughness: 0.5,
      metalness: 0.3,
      emissive: new THREE.Color(0x88aaff),
      emissiveIntensity: 0.5
    });
    
    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.2
    });
    
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 0.3;
    
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0;
    
    const mesh = new THREE.Object3D();
    mesh.add(cap);
    mesh.add(stem);
    
    mushroomModels.value.push(mesh);
  };
  
  // Load seed model with error handling
  const loadSeed = new Promise((resolve) => {
    loader.load(
      'seed.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Configure model for reuse
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Enhance material for the seed
            if (child.material) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x8B4513,
                roughness: 0.7,
                metalness: 0.2
              });
            }
          }
        });
        
        // Store seed model template
        seedModels.value.push(model);
        resolve();
      },
      undefined,
      (error) => {
        console.error('Error loading seed model:', error);
        createFallbackSeed();
        resolve();
      }
    );
  });
  
  // Load mushroom model with error handling
  const loadMushroom = new Promise((resolve) => {
    loader.load(
      'stylized_mushrooms.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Configure model for reuse
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Create emissive materials for the mushroom
            if (child.material) {
              // Save original color
              const originalColor = child.material.color ? 
                child.material.color.clone() : 
                new THREE.Color(0xffffff);
              
              // Create new glowing material
              child.material = new THREE.MeshStandardMaterial({
                color: originalColor,
                roughness: 0.5,
                metalness: 0.3,
                emissive: new THREE.Color(0x88aaff),
                emissiveIntensity: 0.5
              });
            }
          }
        });
        
        // Store mushroom model template
        mushroomModels.value.push(model);
        resolve();
      },
      undefined,
      (error) => {
        console.error('Error loading mushroom model:', error);
        createFallbackMushroom();
        resolve();
      }
    );
  });
  
  // Wait for all models to load or fail
  Promise.all([loadSeed, loadMushroom])
    .then(() => {
      console.log('All model loading promises resolved');
    })
    .catch((error) => {
      console.error('Error in model loading promises:', error);
    });
};

// Handle window resize
const handleResize = () => {
  if (!camera || !renderer || !composer) return;
  
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  composer.setSize(container.value.clientWidth, container.value.clientHeight);
};

// Setup event listeners
const setupEventListeners = () => {
  window.addEventListener('resize', handleResize);
  
  // Click handler for planting seeds at mouse position
  window.addEventListener('dblclick', (event) => {
    // Only allow planting if we have seed models and haven't reached the limit
    if (seedModels.value.length > 0 && activeSeedCount.value < maxSeeds) {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
      
      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObject(ground);
      
      if (intersects.length > 0) {
        // Plant a seed at the intersection point
        plantSeedAt(intersects[0].point);
      }
    }
  });
};

// Plant a seed at a specific position
const plantSeedAt = (position) => {
  if (seedModels.value.length === 0 || activeSeedCount.value >= maxSeeds) return;
  
  // Clone the seed model
  const seedModel = seedModels.value[0].clone();
  
  // Position the seed
  seedModel.position.copy(position);
  seedModel.position.y += 0.1;  // Adjust height based on your model
  
  // Add some random rotation
  seedModel.rotation.y = Math.random() * Math.PI * 2;
  
  // Scale the seed appropriately
  seedModel.scale.set(0.5, 0.5, 0.5);  // Adjust based on your model
  
  // Add to scene
  scene.add(seedModel);
  
  // Track the seed
  const seed = {
    model: seedModel,
    position: position.clone(),
    plantTime: clock.getElapsedTime(),
    growthProgress: 0,
    hasGrown: false
  };
  
  seeds.push(seed);
  growingSeeds.push(seed);
  activeSeedCount.value++;
  
  // Create a particle effect
  createPlantEffect(position);
};

// Create a simple particle effect
const createPlantEffect = (position) => {
  const particleCount = 20;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = position.x;
    positions[i3 + 1] = position.y;
    positions[i3 + 2] = position.z;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    color: 0x44ffaa,
    size: 0.08,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  
  // Store particles with time tracking
  particleSystems.push({
    points: particles,
    lifetime: 0,
    maxLifetime: 1.0
  });
};

// Update seed growth with improved animations and effects
const updateSeeds = (deltaTime) => {
  const currentTime = clock.getElapsedTime();
  
  // Process growing seeds
  for (let i = growingSeeds.length - 1; i >= 0; i--) {
    const seed = growingSeeds[i];
    
    // Calculate how long this seed has been growing
    const growthTime = currentTime - seed.plantTime;
    
    // Full growth takes 5 seconds
    const growthDuration = 5;
    seed.growthProgress = Math.min(growthTime / growthDuration, 1);
    
    if (seed.growthProgress >= 1 && !seed.hasGrown) {
      // Fully grown - transform to mushroom with magical effect
      transformSeedToMushroom(seed);
      seed.hasGrown = true;
      growingSeeds.splice(i, 1);
    } else if (!seed.hasGrown) {
      // Progress growth - scale up with more natural movement
      const growthEased = easeOutElastic(seed.growthProgress);
      const scale = 0.5 + growthEased * 0.5;
      seed.model.scale.set(scale, scale, scale);
      
      // Add subtle wobble during growth
      const wobble = Math.sin(currentTime * 5) * (1 - seed.growthProgress) * 0.05;
      seed.model.rotation.x = wobble;
      seed.model.rotation.z = wobble;
      
      // Add small glow particles during growth
      if (particlesEnabled.value && Math.random() < 0.1) {
        createGrowthParticles(seed);
      }
    }
  }
  
  // Update mushrooms with more interesting animations
  for (const mushroom of mushrooms) {
    if (!mushroom.animParams) {
      // Initialize animation parameters if not set
      mushroom.animParams = {
        swaySpeed: 0.5 + Math.random() * 0.5,
        swayAmount: 0.02 + Math.random() * 0.02,
        bobSpeed: 0.3 + Math.random() * 0.4,
        bobAmount: 0.03 + Math.random() * 0.03,
        pulseSpeed: 0.2 + Math.random() * 0.3,
        offsetX: Math.random() * Math.PI * 2,
        offsetY: Math.random() * Math.PI * 2
      };
    }
    
    const params = mushroom.animParams;
    
    // Sway side to side (rotation)
    mushroom.model.rotation.z = Math.sin(currentTime * params.swaySpeed + params.offsetX) * params.swayAmount;
    
    // Bob up and down (position)
    mushroom.model.position.y = mushroom.position.y + Math.sin(currentTime * params.bobSpeed + params.offsetY) * params.bobAmount;
    
    // Subtle breathing effect (scale)
    const breatheFactor = 1 + Math.sin(currentTime * params.pulseSpeed) * 0.01;
    const origScale = mushroom.scale || 1;
    mushroom.model.scale.y = origScale * breatheFactor;
    
    // Update glowing effect
    mushroom.model.traverse((child) => {
      if (child.isMesh && child.material) {
        // Pulse glow intensity
        child.material.emissiveIntensity = 0.4 + Math.sin(currentTime * params.pulseSpeed + params.offsetX) * 0.2;
        
        // Shift color over time for magical effect
        if (child.material.emissive) {
          const hue = (currentTime * 0.05 + params.offsetX * 0.2) % 1;
          child.material.emissive.setHSL(hue, 0.8, 0.5);
        }
      }
    });
    
    // Emit particles from fully grown mushrooms
    if (particlesEnabled.value && Math.random() < 0.03) {
      emitMushroomParticles(mushroom);
    }
  }
};

// Elastic easing function for more natural growth
const easeOutElastic = (x) => {
  const c4 = (2 * Math.PI) / 3;
  
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

// Create particles for growing seed
const createGrowthParticles = (seed) => {
  // Only emit if seed is still growing
  if (!particlesEnabled.value || seed.growthProgress >= 1) return;
  
  const particleCount = 1 + Math.floor(Math.random() * 2);
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Position particles near the seed, slightly above
    positions[i3] = seed.position.x + (Math.random() - 0.5) * 0.1;
    positions[i3 + 1] = seed.position.y + 0.2 + Math.random() * 0.2;
    positions[i3 + 2] = seed.position.z + (Math.random() - 0.5) * 0.1;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  // Particles change color based on growth progress
  const colorProgress = seed.growthProgress;
  const color = new THREE.Color();
  color.setHSL(0.3 + colorProgress * 0.2, 0.8, 0.5);
  
  // Create particle material with glow
  const material = new THREE.PointsMaterial({
    color: color,
    size: 0.03 + colorProgress * 0.05,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  
  // Create upward floating motion
  const velocities = [];
  for (let i = 0; i < particleCount; i++) {
    velocities.push({
      x: (Math.random() - 0.5) * 0.01,
      y: 0.05 + Math.random() * 0.05,
      z: (Math.random() - 0.5) * 0.01
    });
  }
  
  // Add to particle systems with animation data
  particleSystems.push({
    points: particles,
    velocities: velocities,
    lifetime: 0,
    maxLifetime: 1.5,
    update: (delta, time) => {
      // Update positions
      const positions = particles.geometry.attributes.position.array;
      
      for (let i = 0; i < velocities.length; i++) {
        const i3 = i * 3;
        const velocity = velocities[i];
        
        positions[i3] += velocity.x;
        positions[i3 + 1] += velocity.y;
        positions[i3 + 2] += velocity.z;
        
        // Add some swirl
        const swirl = 0.01;
        positions[i3] += Math.sin(time * 2 + i) * swirl;
        positions[i3 + 2] += Math.cos(time * 2 + i) * swirl;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
    }
  });
};

// Transform a seed into a mushroom with enhanced effects
const transformSeedToMushroom = (seed) => {
  // Only proceed if we have mushroom models
  if (mushroomModels.value.length === 0) return;
  
  // Remove the seed model
  scene.remove(seed.model);
  
  // Create transformation flash
  const flashGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const flashMaterial = new THREE.MeshBasicMaterial({
    color: 0x88ffdd,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending
  });
  
  const flash = new THREE.Mesh(flashGeometry, flashMaterial);
  flash.position.copy(seed.position);
  flash.position.y += 0.3;
  flash.scale.set(0.1, 0.1, 0.1);
  scene.add(flash);
  
  // Animate flash with rapid expansion then fade
  const flashAnimation = {
    time: 0,
    duration: 0.5,
    update: (delta) => {
      flashAnimation.time += delta;
      const progress = flashAnimation.time / flashAnimation.duration;
      
      if (progress >= 1) {
        scene.remove(flash);
        return true; // Animation complete
      }
      
      // Quick expansion, then fade
      const scale = progress * 2;
      flash.scale.set(scale, scale, scale);
      flash.material.opacity = 1 - progress;
      
      return false;
    }
  };
  
  // Track the animation
  transformAnimations.push(flashAnimation);
  
  // Clone the mushroom model
  const mushroomModel = mushroomModels.value[0].clone();
  
  // Position the mushroom where the seed was
  mushroomModel.position.copy(seed.position);
  
  // Add some random rotation
  mushroomModel.rotation.y = Math.random() * Math.PI * 2;
  
  // Start with zero scale and grow into place
  const scale = 0.7 + Math.random() * 0.3;
  mushroomModel.scale.set(0.01, 0.01, 0.01);
  
  // Apply psychedelic colors to the mushroom parts
  mushroomModel.traverse((child) => {
    if (child.isMesh && child.material) {
      // Get the original material to modify
      const originalMat = child.material;
      
      // Determine if this is cap or stem based on position (approximate)
      const isCapPart = child.position.y > 0.1 || child.geometry.boundingSphere?.center.y > 0.1;
      
      // Generate different base colors for caps and stems
      const baseColor = isCapPart ? 
        new THREE.Color().setHSL(Math.random(), 0.85, 0.5) : 
        new THREE.Color().setHSL(Math.random() * 0.2 + 0.7, 0.7, 0.6);
      
      // Create psychedelic material with color and patterns
      const psychedelicMat = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.6,
        metalness: 0.3,
        emissive: baseColor.clone().multiplyScalar(0.4),
        emissiveIntensity: 0.7
      });
      
      // Use ShaderMaterial for more advanced effects on caps
      if (isCapPart) {
        // Set cap vertices to rainbow pattern if it's a cap part
        if (child.geometry && child.geometry.attributes.position) {
          // Create vertex colors for psychedelic pattern
          const positions = child.geometry.attributes.position;
          const count = positions.count;
          const colors = new Float32Array(count * 3);
          
          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Position-based coloring
            const x = positions.array[i3];
            const y = positions.array[i3 + 1];
            const z = positions.array[i3 + 2];
            
            // Create a spiral/wavy color pattern
            const distance = Math.sqrt(x * x + z * z);
            const angle = Math.atan2(z, x);
            const hue = (distance * 2 + angle / (Math.PI * 2)) % 1.0;
            
            // Convert HSL to RGB
            const color = new THREE.Color().setHSL(hue, 0.9, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
          }
          
          // Add colors to geometry
          child.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          
          // Use material with vertex colors
          psychedelicMat.vertexColors = true;
        }
        
        // Add spots/dots to the cap for mushroom look
        if (Math.random() > 0.3) {
          // Create dot pattern texture for caps
          const spotSize = 32 + Math.floor(Math.random() * 32);
          const canvas = document.createElement('canvas');
          canvas.width = 256;
          canvas.height = 256;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Fill background
            ctx.fillStyle = baseColor.getStyle();
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw spots
            const spotColor = new THREE.Color().setHSL(
              (baseColor.getHSL({}).h + 0.5) % 1.0, 0.9, 0.7
            ).getStyle();
            
            ctx.fillStyle = spotColor;
            
            // Random spots
            const spots = 10 + Math.floor(Math.random() * 15);
            for (let i = 0; i < spots; i++) {
              const x = Math.random() * canvas.width;
              const y = Math.random() * canvas.height;
              const radius = spotSize * (0.4 + Math.random() * 0.6);
              
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.fill();
            }
            
            // Create texture from canvas
            const texture = new THREE.CanvasTexture(canvas);
            psychedelicMat.map = texture;
          }
        }
      }
      
      // Set new material
      child.material = psychedelicMat;
      
      // Store original colors for animation
      child.userData.originalColor = baseColor.clone();
      child.userData.timeOffset = Math.random() * Math.PI * 2;
    }
  });
  
  // Add to scene
  scene.add(mushroomModel);
  
  // Create growth animation for mushroom
  const growAnimation = {
    time: 0,
    duration: 1.0,
    targetScale: scale,
    update: (delta) => {
      growAnimation.time += delta;
      const progress = growAnimation.time / growAnimation.duration;
      
      if (progress >= 1) {
        mushroomModel.scale.set(
          growAnimation.targetScale, 
          growAnimation.targetScale, 
          growAnimation.targetScale
        );
        return true; // Animation complete
      }
      
      // Elastic easing for a springy pop-in effect
      const easedProgress = easeOutElastic(progress);
      const currentScale = easedProgress * growAnimation.targetScale;
      mushroomModel.scale.set(currentScale, currentScale, currentScale);
      
      return false;
    }
  };
  
  // Track the animation
  transformAnimations.push(growAnimation);
  
  // Track the mushroom
  mushrooms.push({
    model: mushroomModel,
    position: seed.position.clone(),
    scale: scale,
    isPsychedelic: true, // Mark as psychedelic for color animations
    timeCreated: clock.getElapsedTime() // For time-based color shifts
  });
  
  // Create a burst of magical particles
  createTransformationEffect(seed.position);
};

// Create particles for mushroom transformation effect
const createTransformationEffect = (position) => {
  const particleCount = 100;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Start all particles at the transformation position
    positions[i3] = position.x;
    positions[i3 + 1] = position.y + 0.2;
    positions[i3 + 2] = position.z;
    
    // Create colorful particles - magical dust
    const hue = Math.random();
    const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Create particle material
  const material = new THREE.PointsMaterial({
    size: 0.06,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });
  
  // Create particle system
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  
  // Store initial velocities for animation
  const velocities = [];
  for (let i = 0; i < particleCount; i++) {
    // Create an expanding burst effect
    const angle = Math.random() * Math.PI * 2;
    const height = Math.random();
    const speed = 0.1 + Math.random() * 0.2;
    
    velocities.push({
      x: Math.cos(angle) * speed,
      y: 0.05 + height * 0.2,
      z: Math.sin(angle) * speed
    });
  }
  
  // Add to particle systems with animation data
  particleSystems.push({
    points: particles,
    velocities: velocities,
    lifetime: 0,
    maxLifetime: 2.0,
    update: (delta, time) => {
      // Update positions with velocities
      const positions = particles.geometry.attributes.position.array;
      
      for (let i = 0; i < velocities.length; i++) {
        const i3 = i * 3;
        const velocity = velocities[i];
        
        // Update position
        positions[i3] += velocity.x;
        positions[i3 + 1] += velocity.y;
        positions[i3 + 2] += velocity.z;
        
        // Add gravity and slow down particles
        velocity.y -= 0.003;
        velocity.x *= 0.99;
        velocity.z *= 0.99;
      }
      
      // Mark attribute for update
      particles.geometry.attributes.position.needsUpdate = true;
    }
  });
};

// Emit particles from mushroom caps
const emitMushroomParticles = (mushroom) => {
  // Emit spore-like particles from fully grown mushrooms
  const particleCount = 2 + Math.floor(Math.random() * 2);
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Position particles above the mushroom cap
    positions[i3] = mushroom.position.x + (Math.random() - 0.5) * 0.2;
    positions[i3 + 1] = mushroom.position.y + 0.5 + Math.random() * 0.3;
    positions[i3 + 2] = mushroom.position.z + (Math.random() - 0.5) * 0.2;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  // Create glowing spore particle
  const hue = Math.random() * 0.3 + 0.4; // Blue to purple/pink
  const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
  
  const material = new THREE.PointsMaterial({
    color: color,
    size: 0.02 + Math.random() * 0.03,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  
  // Create gentle floating motion
  const velocities = [];
  for (let i = 0; i < particleCount; i++) {
    velocities.push({
      x: (Math.random() - 0.5) * 0.01,
      y: 0.005 + Math.random() * 0.01,
      z: (Math.random() - 0.5) * 0.01
    });
  }
  
  // Add to particle systems with animation data
  particleSystems.push({
    points: particles,
    velocities: velocities,
    lifetime: 0,
    maxLifetime: 4.0, // Longer lasting spores
    update: (delta, time) => {
      // Update positions with gentle wind drift
      const positions = particles.geometry.attributes.position.array;
      
      for (let i = 0; i < velocities.length; i++) {
        const i3 = i * 3;
        const velocity = velocities[i];
        
        positions[i3] += velocity.x + Math.sin(time + i) * 0.001;
        positions[i3 + 1] += velocity.y;
        positions[i3 + 2] += velocity.z + Math.cos(time + i) * 0.001;
        
        // Very slight gravity
        velocity.y -= 0.0005;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
    }
  });
};

// Update environment animations (grass, water, etc.)
const updateEnvironment = (delta, time) => {
  // Animate grass blades
  if (animatedElements.grassPatches) {
    for (const grass of animatedElements.grassPatches) {
      // Simple wind animation
      grass.blade.rotation.z = grass.baseRotation.z + 
        Math.sin(time * grass.speed + grass.offset) * grass.intensity;
    }
  }
  
  // Animate water ripples
  if (waterRipple) {
    waterRipple.update(delta);
  }
  
  // Animate mist
  if (mistEffect) {
    mistEffect.material.uniforms.time.value = time;
  }
};

// Enhanced particle system update
const updateParticles = (deltaTime) => {
  const time = clock.getElapsedTime();
  
  // Only update if particles are enabled
  if (!particlesEnabled.value) {
    if (fireflies) fireflies.visible = false;
    return;
  } else if (fireflies) {
    fireflies.visible = true;
  }
  
  // Update fireflies
  if (fireflies && fireflies.material && fireflies.material.uniforms) {
    fireflies.material.uniforms.time.value = time;
  }
  
  // Update transformation animations
  for (let i = transformAnimations.length - 1; i >= 0; i--) {
    const anim = transformAnimations[i];
    const completed = anim.update(deltaTime);
    if (completed) {
      transformAnimations.splice(i, 1);
    }
  }
  
  // Update other particle systems
  for (let i = particleSystems.length - 1; i >= 0; i--) {
    const system = particleSystems[i];
    
    // Skip fireflies (handled separately)
    if (system === fireflies) continue;
    
    if (system.points) {
      system.lifetime += deltaTime;
      
      // Remove expired particle systems
      if (system.lifetime >= system.maxLifetime) {
        scene.remove(system.points);
        particleSystems.splice(i, 1);
        continue;
      }
      
      // Calculate lifetime progress
      const progress = system.lifetime / system.maxLifetime;
      
      // Call custom update function if provided
      if (system.update) {
        system.update(deltaTime, time);
      }
      
      // Fade out over lifetime if no custom opacity handler
      if (!system.update && system.points.material.opacity !== undefined) {
        // Fade in then out: 0 -> 1 -> 0
        system.points.material.opacity = 
          progress < 0.2 ? progress * 5 : 1 - ((progress - 0.2) / 0.8);
      }
    }
  }
};

// Plant new seed (UI button)
const plantSeed = () => {
  if (activeSeedCount.value >= maxSeeds) return;
  
  // Pick a random position on the ground
  const x = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 10;
  const position = new THREE.Vector3(x, 0, z);
  
  // Plant the seed
  plantSeedAt(position);
};

// Reset the scene
const resetScene = () => {
  // Remove all seeds
  for (const seed of seeds) {
    scene.remove(seed.model);
  }
  seeds = [];
  growingSeeds = [];
  
  // Remove all mushrooms
  for (const mushroom of mushrooms) {
    scene.remove(mushroom.model);
  }
  mushrooms = [];
  
  // Reset counter
  activeSeedCount.value = 0;
  
  // Remove all particle systems except fireflies
  for (let i = particleSystems.length - 1; i >= 0; i--) {
    const system = particleSystems[i];
    if (system !== fireflies && system.points) {
      scene.remove(system.points);
      particleSystems.splice(i, 1);
    }
  }
};

// Toggle particle effects
const toggleParticles = () => {
  particlesEnabled.value = !particlesEnabled.value;
  
  // Show/hide existing fireflies
  if (fireflies) {
    fireflies.visible = particlesEnabled.value;
  }
};

// Toggle magic light
const toggleLights = () => {
  magicLightEnabled.value = !magicLightEnabled.value;
  
  if (light) {
    light.visible = magicLightEnabled.value;
  }
};

// Animation loop with environment updates
const animate = () => {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  const time = clock.getElapsedTime();
  
  // Update environment animations
  updateEnvironment(delta, time);
  
  // Animate magic light if enabled
  if (light && magicLightEnabled.value) {
    light.position.x = Math.sin(time * 0.5) * 3;
    light.position.z = Math.cos(time * 0.5) * 3;
    light.position.y = 1.5 + Math.sin(time) * 0.5;
    
    // Change light color over time
    const hue = (time * 0.1) % 1;
    light.color.setHSL(hue, 0.8, 0.5);
    
    // Add slight intensity variation
    light.intensity = 150 + Math.sin(time) * 20;
  }
  
  // Update seeds and mushrooms
  updateSeeds(delta);
  
  // Update particles
  updateParticles(delta);
  
  // Update controls
  controls.update();
  
  // Render scene with post-processing
  composer.render();
};

// Cleanup when component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('dblclick', () => {});
  
  if (renderer && container.value) {
    container.value.removeChild(renderer.domElement);
  }
  
  // Dispose of resources
  renderer?.dispose();
});

// Mount the application
onMounted(() => {
  if (process.client) {
    initScene();
  }
});
</script>

<style scoped>
.enchanted-forest {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #061623;
}

.three-container {
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(6, 22, 35, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(100, 200, 255, 0.3);
  border-radius: 50%;
  border-top-color: #64c8ff;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: #64c8ff;
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 1px;
  animation: pulse 1.5s infinite;
}

.ui-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  z-index: 5;
  pointer-events: none;
}

.control-panel {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  pointer-events: auto;
}

.control-panel button {
  background-color: rgba(30, 60, 90, 0.7);
  color: #fff;
  border: 1px solid rgba(100, 200, 255, 0.5);
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.control-panel button:hover:not(:disabled) {
  background-color: rgba(60, 120, 180, 0.7);
  border-color: rgba(100, 200, 255, 0.8);
}

.control-panel button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.seed-counter {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(30, 60, 90, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>