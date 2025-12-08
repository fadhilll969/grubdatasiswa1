import { Routes, Route } from "react-router-dom"
import Rodd from "./test/Rodd"
import Dasbor from "./test/Dasbor"
import Login from "./test/Login"
import Register from "./test/Register"
import Horw from "./test/Horw"
import Editjir from "./test/Editjir"
import Tmbahdata from "./test/Tmbahdata"
import DaftarTagihan from "./test/DaftarTagihan"
import Tagihan from "./test/Tagihan"
import TmbhdataTgihan from "./test/TmbhdataTgihan"
import EditTagihan from "./test/EditTagihan"
import Kelas from "./test/Kelas"
import Kategoridata from "./test/Kategoridata"
import Tmabahkategori from "./test/Tmabahkategori"
import Editkategori from "./test/Editkategori"
import Dataktegori from "./test/Dataktegori"
import Tmbhdataclok from "./test/Tmbhdataclok"
import Editclok from "./test/Editclok"
import Tmbhkls from "./test/Tmbhkls"
import Editkelas from "./test/Editkelas"
import Presensi from "./test/Presensi"
import RekapPresensi from "./test/RekapPresensi"


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
      <Route path="/q" element={<DaftarTagihan />} />
      <Route path="/o" element={<Tagihan />} />
      <Route path="/p" element={<TmbhdataTgihan />} />
      <Route path="/ed/:id" element={<EditTagihan />} />
      <Route path="/a" element={<Kategoridata />} />
      <Route path="/tmbh" element={<Tmabahkategori />} />
      <Route path="/datakategori" element={<Dataktegori />} />
      <Route path="/tambah" element={<Tmbhdataclok />} />
      <Route path="/editclok/:id" element={<Editclok />} />
      <Route path="/kategori/edit/:id" element={<Editkategori />} />
      <Route path="/kelas" element={<Kelas />} />
      <Route path="/tambahkelas/:kelas?" element={<Tmbhkls />} />
      <Route path="/editkelas/:id" element={<Editkelas />} />
      <Route path="/Presensi" element={<Presensi />} />
      <Route path="/RekapPresensi" element={<RekapPresensi />} />

    </Routes>

  )
}
export default App