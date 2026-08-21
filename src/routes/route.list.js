import homePage from '../pages/home.page.js';
import testPage from '../pages/test.page.js'

const routes = [
  { path: '/', page: homePage },
  { path: '/home', page: '' },
  { path: '/settings', page: '' },
  { path: '/test', page: testPage },
]

export default routes
