import { Routes, Route } from "react-router-dom"
import Rodd from "./test/Rodd"
import Dasbor from "./test/Dasbor" 
import Register from "./test/Regis"

const App = () => {
  return (
    <Routes>
      <Route path="/h" element={<Rodd />} />
      <Route path="/" element={<Dasbor />} />
      <Route path="/f" element={<Register />} />
    </Routes>

  )
}
export default App