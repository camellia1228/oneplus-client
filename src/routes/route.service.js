import routes from './route.list.js'

const render = (path) => {
  const route = routes.find((route) => new URLPattern({ pathname: route.path }).test({ pathname: path }))
  document.getElementById('app').innerHTML = route.page
}

const navigate = () => {
  const path = location.hash.slice(1) || '/'
  render(path)
}

window.addEventListener('hashchange', () => {
  console.log(window.location.hash)
  navigate()
})
