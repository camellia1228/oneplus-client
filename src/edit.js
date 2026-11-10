import { uploadTrack } from './api.js'

const form = document.querySelector('.upload-form')
const message = document.querySelector('.upload-message')
const submit = form.querySelector('[type="submit"]')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const { title, artist, audio, image } = form.elements
  submit.disabled = true
  message.textContent = '업로드 중...'
  try {
    await uploadTrack({
      title: title.value.trim(),
      artist: artist.value.trim(),
      audio: audio.files[0],
      image: image.files[0],
    })
    message.textContent = '업로드에 성공했습니다.'
    form.reset()
  } catch (err) {
    message.textContent = err.message
  } finally {
    submit.disabled = false
  }
})
