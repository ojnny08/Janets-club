import { Route, BrowserRouter, Routes, useLocation } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./pages/Home"
import Team from "./pages/Team"
import { About } from "./pages/About"
import Alumni from "./pages/Alumni"
import Admin from "./pages/Admin"
import Contact from "./components/Contact"
import AuthProvider from "./context/AuthContext"
import BranchBackdrop from "./components/BranchBackdrop"
import UsefulLinks from "./pages/UsefulLinks"
import Events from "./pages/Events"

function ContactFooter() {
  const { pathname } = useLocation()
  if (pathname === "/about") return null
  return <Contact />
}

function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="relative flex min-h-dvh flex-col">
      {pathname !== "/" && <BranchBackdrop />}
      <NavBar />
      <main className="flex-1 min-h-dvh pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/about" element={<About />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/links" element={<UsefulLinks />}/>
          <Route path="/events" element={<Events />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <ContactFooter />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
