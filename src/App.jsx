import { Routes, Route } from "react-router-dom"
import Rodd from "./test/Rodd"
import Dasbor from "./test/Dasbor" 
import Login from "./test/Login"
import Register from "./test/Register"
import Horw from "./test/Horw"
import Editjir from "./test/Editjir"


const App = () => {
  return (
    <Routes>
      <Route path="/h" element={<Rodd />} />
      <Route path="/" element={<Dasbor />} />
      <Route path="/f" element={<Login />} />
      <Route path="/k" element={<Register />} />
      <Route path="/w" element={<Horw />} />
      <Route path="/edit/:id" element={<Editjir />} />

    </Routes>

  )
}
export default App