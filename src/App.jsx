import { Routes, Route } from "react-router-dom";

//master data
import Masterdata from "./test/masterdata/Masterdata";
import Tambahdatakelas from "./test/masterdata/Tambahdatakelas";
import Editmasterdata from "./test/masterdata/Editmasterdata";

//tagihan
import Tagihan from "./test/tagihan/Tagihan";
import TambahdataTagihan from "./test/tagihan/TambahdataTagihan";
import EditTagihan from "./test/tagihan/EditTagihan";
import RekapTagihan from "./test/tagihan/RekapTagihan";

//prnsi
import Presensi from "./test/presensi/Presensi";
import RekapPresensi from "./test/presensi/RekapPresensi";
import EditPresensi from "./test/presensi/EditPresensi";

//kelas
import DataKelas from "./test/kelas/DataKelas";
import Tmbhkls from "./test/kelas/Tmbhkls";
import Editkelas from "./test/kelas/Editkelas";

//kategori master data
import Dataktegori from "./test/kategorimasterdata/Dataktegori";
import Tmbhdataclok from "./test/kategorimasterdata/Tmbhdataclok";
import Editclok from "./test/kategorimasterdata/Editclok";

//kategoti tagihan
import Kategoridata from "./test/kategoritagihan/Kategoridata";
import Tmabahkategori from "./test/kategoritagihan/Tmabahkategori";
import Editkategori from "./test/kategoritagihan/Editkategori";

import Login from "./test/Login";
import Register from "./test/Register";

import Horw from "./test/Horw";
import Dasbor from "./test/Dasbor";

const App = () => {
  return (
    <Routes>
      {/* dashboard */}
      <Route path="/" element={<Dasbor />} />

      {/* masterdata */}
      <Route path="/h" element={<Masterdata />} />
      <Route path="/t" element={<Tambahdatakelas />} />
      <Route path="/edit/:id" element={<Editmasterdata />} />

      {/* tagihan */}
      <Route path="/tagihan" element={<Tagihan />} />
      <Route path="/tagihan/tambah" element={<TambahdataTagihan />} />
      <Route path="/tagihan/edit/:id" element={<EditTagihan />} />
      <Route path="/tagihan/rekap" element={<RekapTagihan />} />

      {/* presensi */}
      <Route path="/presensi" element={<Presensi />} />
      <Route path="/rekap-presensi" element={<RekapPresensi />} />
      <Route path="/edit-presensi/:id" element={<EditPresensi />} />

      {/* kelas */}
      <Route path="/kelas" element={<DataKelas />} />
      <Route path="/tambahkelas/:kelas?" element={<Tmbhkls />} />
      <Route path="/editkelas/:id" element={<Editkelas />} />

      {/* kategori */}
      <Route path="/kategori/data" element={<Dataktegori />} />
      <Route path="/kategori/edit-data/:id" element={<Editclok />} />
      <Route path="/kategori/tambah-data" element={<Tmbhdataclok />} />

      {/*bokep*/}
      <Route path="/kategori" element={<Kategoridata />} />
      <Route path="/kategori/tambah" element={<Tmabahkategori />} />
      <Route path="/kategori/edit/:id" element={<Editkategori />} />

      {/* auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/w" element={<Horw />} />
    </Routes>
  );
};

export default App;
