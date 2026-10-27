<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as THREE from 'three'
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'

const props = withDefaults(defineProps<{
    contained?: boolean
    modelPath?: string
    customVertexShader?: string
    customFragmentShader?: string
    useCustomShader?: boolean
}>(), {
    contained: false,
    modelPath: '/Models/mee_sup.glb',
    useCustomShader: false
})

// Reference colors sampled from the provided design
// Background / Paper color: #dfdfdf (rgb(223, 223, 223))
// Ink dot color: #141414 (rgb(20, 20, 20))
const BACKGROUND_COLOR = '#dfdfdf'
const INK_COLOR = '#141414'

// 1. Setup DRACO loader for compressed GLTFs
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const scene = shallowRef<THREE.Group | null>(null)
const isLoading = ref(false)
const loadError = ref<string | null>(null)

// Default Bayer 8x8 Dither Shaders
const DEFAULT_VERTEX_SHADER = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
    }
`

const DEFAULT_FRAGMENT_SHADER = `
    uniform vec3 uPaperColor;
    uniform vec3 uInkColor;
    uniform vec3 uLightDirection;
    uniform float uPixelSize;
    uniform float uEdgeThickness;
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    // 8x8 Bayer dithering matrix for fine-grained stippling
    float bayer8(vec2 uv) {
        ivec2 p = ivec2(mod(uv, 8.0));
        int x = p.x;
        int y = p.y;
        int bayer[64] = int[64](
             0, 32,  8, 40,  2, 34, 10, 42,
            48, 16, 56, 24, 50, 18, 58, 26,
            12, 44,  4, 36, 14, 46,  6, 38,
            60, 28, 52, 20, 62, 30, 54, 22,
             3, 35, 11, 43,  1, 33,  9, 41,
            51, 19, 59, 27, 49, 17, 57, 25,
            15, 47,  7, 39, 13, 45,  5, 37,
            63, 31, 55, 23, 61, 29, 53, 21
        );
        return float(bayer[y * 8 + x]) / 64.0;
    }

    void main() {
        vec3 normal = normalize(vNormal);
        if (!gl_FrontFacing) normal = -normal;
        vec3 viewDir = normalize(vViewPosition);

        // Half-Lambert diffuse lighting for soft tonal curves
        float NdotL = dot(normal, uLightDirection);
        float diffuse = NdotL * 0.5 + 0.5;

        // Silhouette edge contour (pen line along grazing angles)
        float NdotV = max(dot(normal, viewDir), 0.0);
        float rim = 1.0 - NdotV;
        float edge = smoothstep(1.0 - uEdgeThickness, 1.0, rim);

        // Shading tone (0.0 = dark ink, 1.0 = light paper)
        float tone = clamp(diffuse * (1.0 - edge * 0.75), 0.0, 1.0);

        // Screen-space Bayer matrix dithering
        vec2 screenCoord = gl_FragCoord.xy / uPixelSize;
        float threshold = bayer8(screenCoord);

        // If tone is darker than threshold, render ink dots; otherwise blend into background
        vec3 finalColor = (tone < threshold) ? uInkColor : uPaperColor;

        gl_FragColor = vec4(finalColor, 1.0);
    }
`

let currentMaterial: THREE.ShaderMaterial | null = null

const updateShaderMaterial = () => {
    const vert = (props.useCustomShader && props.customVertexShader && props.customVertexShader.trim()) 
        ? props.customVertexShader 
        : DEFAULT_VERTEX_SHADER
    const frag = (props.useCustomShader && props.customFragmentShader && props.customFragmentShader.trim()) 
        ? props.customFragmentShader 
        : DEFAULT_FRAGMENT_SHADER

    try {
        currentMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uPaperColor: { value: new THREE.Color(BACKGROUND_COLOR) },
                uInkColor: { value: new THREE.Color(INK_COLOR) },
                uLightDirection: { value: new THREE.Vector3(1.2, 1.8, 1.0).normalize() },
                uPixelSize: { value: 1.5 },
                uEdgeThickness: { value: 0.35 },
                uTime: { value: 0.0 }
            },
            side: THREE.DoubleSide,
            vertexShader: vert,
            fragmentShader: frag
        })
    } catch (e) {
        console.warn('Failed to compile custom shader, using default Bayer dither:', e)
        currentMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uPaperColor: { value: new THREE.Color(BACKGROUND_COLOR) },
                uInkColor: { value: new THREE.Color(INK_COLOR) },
                uLightDirection: { value: new THREE.Vector3(1.2, 1.8, 1.0).normalize() },
                uPixelSize: { value: 1.5 },
                uEdgeThickness: { value: 0.35 },
                uTime: { value: 0.0 }
            },
            side: THREE.DoubleSide,
            vertexShader: DEFAULT_VERTEX_SHADER,
            fragmentShader: DEFAULT_FRAGMENT_SHADER
        })
    }

    applyMaterialToScene()
}

const applyMaterialToScene = () => {
    if (!scene.value || !currentMaterial) return
    scene.value.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = currentMaterial!
        } else if ((child as any).isLine || (child as any).isLineSegments) {
            (child as any).material = new THREE.LineBasicMaterial({ color: 0x141414 })
        }
    })
}

// Dynamic model loading with auto-centering
const loadModel = async (path: string) => {
    const targetPath = path || '/Models/mee_sup.glb'
    isLoading.value = true
    loadError.value = null

    try {
        const gltf = await gltfLoader.loadAsync(targetPath)
        const loadedGroup = gltf.scene

        // Auto-center and normalize size
        const box = new THREE.Box3().setFromObject(loadedGroup)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)

        if (maxDim > 0 && maxDim !== Infinity) {
            loadedGroup.position.x -= center.x
            loadedGroup.position.y -= center.y
            loadedGroup.position.z -= center.z

            // Scale normalization for diverse user models
            if (maxDim > 6.0 || maxDim < 0.8) {
                const normScale = 3.0 / maxDim
                loadedGroup.scale.multiplyScalar(normScale)
            }
        }

        scene.value = loadedGroup
        updateShaderMaterial()
    } catch (err: any) {
        console.error('Error loading 3D asset from path:', targetPath, err)
        loadError.value = 'Failed to load 3D model asset. Verify file format.'
    } finally {
        isLoading.value = false
    }
}

watch(() => props.modelPath, (newPath) => {
    loadModel(newPath || '/Models/mee_sup.glb')
}, { immediate: true })

watch([
    () => props.useCustomShader,
    () => props.customVertexShader,
    () => props.customFragmentShader
], () => {
    updateShaderMaterial()
})

// 5. Interactive Mouse Rotation & Subtle Auto-spin
const isDragging = ref(false)
let lastPointerX = 0
let lastPointerY = 0

const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    isDragging.value = true
    lastPointerX = e.clientX
    lastPointerY = e.clientY
}

const onPointerMove = (e: PointerEvent) => {
    if (!isDragging.value || !scene.value) return
    const dx = e.clientX - lastPointerX
    const dy = e.clientY - lastPointerY
    scene.value.rotation.y += dx * 0.008
    scene.value.rotation.x += dy * 0.008
    lastPointerX = e.clientX
    lastPointerY = e.clientY
}

const onPointerUp = () => {
    isDragging.value = false
}

const resetRotation = () => {
    if (scene.value) {
        scene.value.rotation.set(0, 0, 0)
    }
}

// Responsive scale & position for mobile devices
const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
const isSmallMobile = ref(typeof window !== 'undefined' ? window.innerWidth < 480 : false)

const handleResize = () => {
    if (typeof window === 'undefined') return
    const width = window.innerWidth
    isMobile.value = width < 768
    isSmallMobile.value = width < 480
}

const modelScale = computed<[number, number, number]>(() => {
    if (isSmallMobile.value) return [0.52, 0.52, 0.52]
    if (isMobile.value) return [0.65, 0.65, 0.65]
    return [1, 1, 1]
})

const modelPosition = computed<[number, number, number]>(() => {
    if (isSmallMobile.value) return [0, -0.3, 0]
    if (isMobile.value) return [0, -0.15, 0]
    return [0, 0, 0]
})

const cameraPosition = computed<[number, number, number]>(() => {
    if (isSmallMobile.value) return [0, 5.6, 4.6]
    if (isMobile.value) return [0, 5.3, 4.3]
    return [0, 5, 4]
})

// Sync scale directly onto Three.js scene object
watch([scene, modelScale, modelPosition], () => {
    if (scene.value) {
        scene.value.scale.set(modelScale.value[0], modelScale.value[1], modelScale.value[2])
        scene.value.position.set(modelPosition.value[0], modelPosition.value[1], modelPosition.value[2])
    }
}, { immediate: true })

let animFrameId: number
const animate = () => {
    if (!isDragging.value && scene.value) {
        scene.value.rotation.y += 0.003
    }
    if (currentMaterial && currentMaterial.uniforms && currentMaterial.uniforms.uTime) {
        currentMaterial.uniforms.uTime.value = performance.now() * 0.001
    }
    animFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    animFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
    }
    cancelAnimationFrame(animFrameId)
})
</script>

<template>
    <div 
        class="canvas-container" 
        :class="{ 'is-contained': contained }"
        @pointerdown="onPointerDown" 
        @pointermove="onPointerMove" 
        @pointerup="onPointerUp"
        @pointerleave="onPointerUp"
    >
        <!-- Fullscreen background canvas for Home.vue -->
        <TresCanvas v-if="!contained" window-size alpha :clear-alpha="0">
            <TresPerspectiveCamera :position="cameraPosition" :look-at="[0, 0, 0]" />
            <TresAmbientLight :intensity="1.5" />
            <TresDirectionalLight :position="[5, 5, 5]" :intensity="2" />
            <primitive v-if="scene" :object="scene" :scale="modelScale" :position="modelPosition" />
        </TresCanvas>

        <!-- Box-confined canvas for Gallery.vue (strictly inside parent display div) -->
        <template v-else>
            <div class="viewport-overlay-bar">
                <span class="control-hint">❖ DRAG INSIDE BOX TO ROTATE</span>
                <button type="button" class="reset-angle-btn" @click.stop="resetRotation" title="Reset 3D Angle">
                    ↺ RESET ANGLE
                </button>
            </div>
            <TresCanvas alpha :clear-alpha="0">
                <TresPerspectiveCamera :position="cameraPosition" :look-at="[0, 0, 0]" />
                <TresAmbientLight :intensity="1.5" />
                <TresDirectionalLight :position="[5, 5, 5]" :intensity="2" />
                <primitive v-if="scene" :object="scene" :scale="modelScale" :position="modelPosition" />
            </TresCanvas>
        </template>
    </div>
</template>

<style scoped>
/* Fullscreen background mode (Home.vue) */
.canvas-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    cursor: grab;
    user-select: none;
    touch-action: none;
    z-index: 0;
    pointer-events: auto;
}

/* Confined mode (Gallery.vue): strictly confined within display div border, never blocks page scrolling */
.canvas-container.is-contained {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
    z-index: 1;
    touch-action: pan-y !important;
    pointer-events: auto;
}

.canvas-container.is-contained :deep(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
    touch-action: pan-y !important;
    outline: none;
    pointer-events: auto;
}

.viewport-overlay-bar {
    position: absolute;
    top: 10px;
    left: 12px;
    right: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
    z-index: 10;
}

.control-hint {
    background: rgba(0, 0, 0, 0.82);
    color: #00ff66;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 8px;
    letter-spacing: 0.5px;
    box-shadow: 2px 2px 0px #000000;
}

.reset-angle-btn {
    pointer-events: auto;
    background: #000000;
    color: #ffffff;
    border: 1px solid #333333;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    padding: 4px 10px;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
}

.reset-angle-btn:hover {
    background: var(--tape-red, #ff2d2d);
    color: #000000;
}

.canvas-container:active,
.canvas-container.is-contained:active {
    cursor: grabbing;
}
</style>