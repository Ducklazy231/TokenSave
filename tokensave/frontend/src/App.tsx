import { Route, Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import Converter from "./pages/Converter"

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Converter />} />
          <Route path="/converter" element={<Converter />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
