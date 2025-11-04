import { Routes, Route } from "react-router-dom"
import Rodd from "./test/Rodd"
import Dasbor from "./test/Dasbor" 
import Login from "./test/Login"
import Register from "./test/Register"
import Horw from "./test/Horw"
import Editjir from "./test/Editjir"
import Tmbahdata from "./test/Tmbahdata"
import Keuangan from "./test/Keuangan"
import Tagihan from "./test/Tagihan"
import TmbhdataTgihan from "./test/TmbhdataTgihan"
import EditTagihan from "./test/EditTagihan" 

const App = () => {
  return (
    <Routes>
      <Route path="/h" element={<Rodd />} />
      <Route path="/" element={<Dasbor />} />
      <Route path="/f" element={<Login />} />
      <Route path="/k" element={<Register />} />
      <Route path="/w" element={<Horw />} />
      <Route path="/t" element={<Tmbahdata />} />
      <Route path="/edit/:id" element={<Editjir />} />
      <Route path="/q" element={<Keuangan />} />
      <Route path="/o" element={<Tagihan />} />
      <Route path="/p" element={<TmbhdataTgihan />} />
       <Route path="/ed/:id" element={<EditTagihan />} />
    </Routes>

  )
}
export default App