import About from './components/About'
import AlumniSpotlight from './components/AlumniSpotlight'
import Contact from './components/Contact'
import NavBar from './components/NavBar'
import Schedule from './components/Schedule'
import Team from './components/Team'
import logo from './assets/duesa-logo-circle.png'

function App() {
  return (
    <div id="top" className=''>
      <NavBar />

      <main>
        <section className="relative flex min-h-dvh items-center overflow-hidden px-6 md:px-16 lg:px-24">

          <div className="relative mx-auto text-center max-w-4xl">
            <img src={logo} alt="DUESA logo" className="mx-auto mb-6 w-65 h-65" />
            <h1 className="text-2xl font-bold text-brand-deep md:text-2xl lg:text-4xl">
              Dalhousie Undergraduate Economics Student Association
            </h1>
            <p className="mx-auto max-w-xl pt-4 text-ink-muted">We welcome all Dalhousie students interested in Economics to join!</p>
            
          </div>
        </section>

        <About />
        <AlumniSpotlight />
        <Team />
        <Schedule />
      </main>

      <Contact />
    </div>
  )
}

export default App
