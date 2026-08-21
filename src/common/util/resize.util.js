// import { canvas } from '../../main.js'

const devicePixelRatio = window.devicePixelRatio || 1
let resizeTimeout

const resizeScreen = () => {
  const { innerWidth, innerHeight } = window
  canvas.width = Math.floor(innerWidth * devicePixelRatio)
  canvas.height = Math.floor(innerHeight * devicePixelRatio)
  canvas.style.width = `${innerWidth}px`
  canvas.style.height = `${innerHeight}px`
}

export default window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(resizeScreen, 200)
})
