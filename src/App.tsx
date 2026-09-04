import './App.css'
import About from './components/About'
import NavBar from './components/NavBar'

function App() {
  return (
    <div>
      <NavBar />
      <div className='h-dvh flex items-center text-6xl mx-6 font-bold'>
        Welcome to the Dalhousie Undergraduate Economic Student Accositation
      </div>

      <section id="about" className='scroll-mt-20'>
        <About />
      </section>
    </div>
    
  )
}

export default App
