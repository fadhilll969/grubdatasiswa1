import { Routes, Route } from "react-router-dom"
import Rodd from "./test/Rodd"
import Dasbor from "./test/Dasbor" 
import Login from "./test/Login"
import Register from "./test/Register"

const App = () => {
  return (
    <Routes>
      <Route path="/h" element={<Rodd />} />
      <Route path="/" element={<Dasbor />} />
      <Route path="/f" element={<Login />} />
      <Route path="/k" element={<Register />} />
    </Routes>

  )
}
export default App