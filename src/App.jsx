import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './App.css'
import Hero from './pages/Hero'
import Movie from './pages/Movie'
import Explore from './pages/Explore'
import Actor from './pages/Actor'
import Header from './components/Header'
import ScrollToTop from './utils/Scroll'
import Footer from './components/Footer'

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
          <Header />
        <Routes>
          <Route path='/' element={<Hero />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/movie/:movieId' element={<Movie />} />
          <Route path='/actor/:actorId' element={<Actor />} />
        </Routes>
        <Footer />
          <ScrollToTop />
      </BrowserRouter>
    </Provider>
  )
}

export default App
