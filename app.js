import * as three from 'three'
import mangoTexture from './mango.png'

// A few settings
const fieldOfView = 90
const sceneWidth = window.innerWidth
const sceneHeight = window.innerHeight
const aspectRatio = sceneWidth / sceneHeight
const rotationSpeed = 0.005

// Set the scene
const scene = new three.Scene()
scene.background = new three.Color(0xffffff)
const camera = new three.PerspectiveCamera(
  fieldOfView,
  aspectRatio
)

// Back up away from our mango so that we can see it
camera.position.z = 25

// Create a 3D mango and add it to our scene
const geometry = new three.SphereGeometry(5, 32, 32)
const texture = new three.TextureLoader().load(mangoTexture)
const material = new three.MeshBasicMaterial({
  map: texture
})
const mango = new three.Mesh(geometry, material)
scene.add(mango)

// Create a renderer for our scene
const renderer = new three.WebGLRenderer()
renderer.setSize(sceneWidth, sceneHeight)
document.body.prepend(renderer.domElement)

let autorotate = true
let restartRotationTimeout

// Rotates our mango
function janguea() {
  if (!autorotate) {
    return
  }

  mango.rotation.x -= rotationSpeed;
  mango.rotation.y -= rotationSpeed;
  mango.rotation.z -= rotationSpeed;
}

// Renders our scene and slowly rotates our mango
function animate() {
  // Rotate our mango
  janguea()

  // Render the scene
  renderer.render(scene, camera)

  // Do it again
  requestAnimationFrame(animate)
}

// Kick things off
animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const touchesById = {}
renderer.domElement.addEventListener('touchstart', function (event) {
  if (restartRotationTimeout) {
    clearTimeout(restartRotationTimeout)
  }

  autorotate = false
  Array.from(event.touches).forEach(touch => {
    touchesById[touch.identifier] = touch
  })
})

renderer.domElement.addEventListener('touchmove', function (event) {
  event.preventDefault()

  Array.from(event.changedTouches).forEach(touch => {
    const touchId = touch.identifier
    const prevTouch = touchesById[touchId]

    const xDistance = touch.clientX - prevTouch.clientX
    mango.rotation.y += xDistance * (rotationSpeed * 2)

    const yDistance = touch.clientY - prevTouch.clientY
    mango.rotation.x += yDistance * (rotationSpeed * 2)

    touchesById[touch.identifier] = touch
  })
})

renderer.domElement.addEventListener('touchend', function (event) {
  restartRotationTimeout = setTimeout(() => {
    autorotate = true
  }, 2000)
})