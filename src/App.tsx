import About from './components/About'
import AlumniSpotlight from './components/AlumniSpotlight'
import NavBar from './components/NavBar'
import Team from './components/Team'

function App() {
  return (
    <div id="top">
      <NavBar />

      <main>
        <section className="relative flex min-h-dvh items-center overflow-hidden px-6 pt-20 md:px-16 lg:px-24">

          <div className="relative max-w-3xl">
            <h1 className="text-5xl font-bold leading-[1.08] text-ink md:text-6xl lg:text-7xl">
              Dalhousie Undergraduate Economics Student Association
            </h1>

          </div>
        </section>

        <About />
        <AlumniSpotlight />
        <Team />
      </main>
    </div>
  )
}

export default App
