import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const parameters = {
    ambientColor: 0xff0000,
    directionalColor: 0x0000ff,
    hemosphereFirstColor: 0xff0000,
    hemisphereSecondColor: 0x0000ff,
    pointlightColor: 0xff9000,
    rectAreaColor: 0x4e00ff,
    spotColor: 0x78ff00
}
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const folderAmbientLight = gui.addFolder('AmbientLight')
const ambientLight = new THREE.AmbientLight(parameters.ambientColor, 0.5)
scene.add(ambientLight)
folderAmbientLight.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('ambient intensity')
folderAmbientLight.addColor(parameters, 'ambientColor').onChange(() => {
    ambientLight.color.set(parameters.ambientColor)
})

const directionalLightFolder = gui.addFolder('directionalLight')
const directionalLight = new THREE.DirectionalLight(parameters.directionalColor, 0.3)
scene.add(directionalLight)
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.01).name('directional intensity')
directionalLightFolder.addColor(parameters, 'directionalColor').onChange(() => {
    directionalLight.color.set(parameters.directionalColor)
})
//zmiana pozycji
directionalLight.position.set(1, 0.25, 0.5)

const hemisphereLightFolder = gui.addFolder('hemisphereLight')
const hemisphereLight = new THREE.HemisphereLight(parameters.hemosphereFirstColor, parameters.hemisphereSecondColor, 0.3)
scene.add(hemisphereLight)
hemisphereLightFolder.add(hemisphereLight, 'intensity').min(0).max(1).step(0.01).name('hemisphere intensity')
hemisphereLightFolder.addColor(parameters, 'hemosphereFirstColor').onChange(() => {
    hemisphereLight.color.set(parameters.hemosphereFirstColor)
})
hemisphereLightFolder.addColor(parameters, 'hemisphereSecondColor').onChange(() => {
    hemisphereLight.groundColor.set(parameters.hemisphereSecondColor)
})

const pointLightFolder = gui.addFolder('pointLight')
const pointLight = new THREE.PointLight(parameters.pointlightColor, 0.5, 10)
scene.add(pointLight)
pointLightFolder.add(pointLight, 'intensity').min(0).max(1).step(0.01).name('point intensity')
pointLightFolder.add(pointLight, 'distance').min(0).max(100).step(1).name('point distance')
pointLightFolder.addColor(parameters, 'pointlightColor').onChange(() => {
    pointLight.color.set(parameters.pointlightColor)
})
//zmiana pozycji
pointLight.position.set(1, 2, 1)

const rectAreaLightFolder = gui.addFolder('rectAreaLight')
const rectAreaLight = new THREE.RectAreaLight(parameters.rectAreaColor, 2, 1, 1)
scene.add(rectAreaLight)
rectAreaLightFolder.add(rectAreaLight, 'intensity').min(0).max(2).step(0.01).name('rectArea intensity')
rectAreaLightFolder.add(rectAreaLight, 'width').min(0).max(10).step(0.5).name('rectArea width')
rectAreaLightFolder.add(rectAreaLight, 'height').min(0).max(10).step(0.5).name('rectArea height')
rectAreaLightFolder.addColor(parameters, 'rectAreaColor').onChange(() => {
    rectAreaLight.color.set(parameters.rectAreaColor)
})
rectAreaLight.position.set(-1.5, 0 , 1.5)
rectAreaLight.lookAt(new THREE.Vector3())

const spotLightFolder = gui.addFolder('spotLight')
const spotLight = new THREE.SpotLight(parameters.spotColor, 0.5, 10, Math.PI *0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
spotLightFolder.add(spotLight, 'intensity').min(0).max(1).step(0.01).name('spot intensity')
spotLightFolder.add(spotLight, 'distance').min(0).max(10).step(0.5).name('spot distance')
spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.01).name('spot penumbra')
spotLightFolder.add(spotLight, 'decay').min(0).max(1).step(0.01).name('spot decay')
spotLightFolder.addColor(parameters, 'spotColor').onChange(() => {
    spotLight.color.set(parameters.spotColor)
})
scene.add(spotLight.target)
// spotLight.target.position.x = -0.75

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)
//no size parameter
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()