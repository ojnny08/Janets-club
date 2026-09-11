import { Route, BrowserRouter, Routes } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./pages/Home"
import Team from "./pages/Team"
import { About } from "./pages/About"
import Alumni from "./pages/Alumni"
import Contact from "./components/Contact"
import AuthProvider from "./context/AuthContext"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-dvh flex-col">
          <NavBar />
          <div className="flex-1 pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/team" element={<Team />} />
              <Route path="/about" element={<About />} />
              <Route path="/alumni" element={<Alumni />} />
            </Routes>
          </div>
          <Contact />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
