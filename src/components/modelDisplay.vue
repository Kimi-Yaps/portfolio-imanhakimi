<script setup lang="ts">
import { TresCanvas, useGraph, useLoader } from '@tresjs/core'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as THREE from 'three'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

// Reference colors sampled from the provided design
// Background / Paper color: #dfdfdf (rgb(223, 223, 223))
// Ink dot color: #141414 (rgb(20, 20, 20))
const BACKGROUND_COLOR = '#dfdfdf'
const INK_COLOR = '#141414'

// 1. Setup DRACO loader for compressed GLTFs
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

// 2. Point to the model path relative to public/
const { state: model } = useLoader(
    GLTFLoader,
    '/Models/mee_sup.glb',
    {
        extensions: (loader) => {
            if (loader instanceof GLTFLoader) {
                loader.setDRACOLoader(dracoLoader)
            }
        },
    },
)

// 3. Extract the root scene
const scene = computed(() => model.value?.scene)
const graph = useGraph(scene)
const nodes = computed(() => graph.value?.nodes)

// 4. Custom Dither / Stipple Pen-and-Ink Shader Material
const ditherShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uPaperColor: { value: new THREE.Color(BACKGROUND_COLOR) },
        uInkColor: { value: new THREE.Color(INK_COLOR) },
        uLightDirection: { value: new THREE.Vector3(1.2, 1.8, 1.0).normalize() },
        uPixelSize: { value: 1.5 }, // Size of dithering pixels (1.5 - 2.0 matches retro dither artwork)
        uEdgeThickness: { value: 0.35 }, // Silhouette contour ink lines
    },
    side: THREE.DoubleSide,
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 uPaperColor;
        uniform vec3 uInkColor;
        uniform vec3 uLightDirection;
        uniform float uPixelSize;
        uniform float uEdgeThickness;

        varying vec3 vNormal;
        varying vec3 vViewPosition;

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
    `,
})

// Apply the shader material to all meshes in the model
watch(scene, (newScene) => {
    if (!newScene) return
    newScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = ditherShaderMaterial
        } else if ((child as any).isLine || (child as any).isLineSegments) {
            (child as any).material = new THREE.LineBasicMaterial({ color: 0x141414 })
        }
    })
}, { immediate: true })

// 5. Interactive Mouse Rotation & Subtle Auto-spin
const isDragging = ref(false)
let lastPointerX = 0
let lastPointerY = 0

const onPointerDown = (e: PointerEvent) => {
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

let animFrameId: number
const animate = () => {
    if (!isDragging.value && scene.value) {
        scene.value.rotation.y += 0.003
    }
    animFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
    animFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
    cancelAnimationFrame(animFrameId)
})
</script>

<template>
    <div class="canvas-container" @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp"
        @pointerleave="onPointerUp">
        <TresCanvas window-size alpha :clear-alpha="0">
            <TresPerspectiveCamera :position="[0, 5, 4]" :look-at="[0, 0, 0]" />
            <TresAmbientLight :intensity="1.5" />
            <TresDirectionalLight :position="[5, 5, 5]" :intensity="2" />

            <!-- Render the model -->
            <primitive v-if="scene" :object="scene" />
        </TresCanvas>
    </div>
</template>

<style scoped>
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

.canvas-container:active {
    cursor: grabbing;
}
</style>