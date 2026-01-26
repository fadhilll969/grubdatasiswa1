import { Routes, Route } from "react-router-dom";

// Dashboard
import Dasbor from "./test/Dasbor";
import Horw from "./test/Horw";

// Auth
import Login from "./test/Login";
import Register from "./test/Register";

// Master Data
import Masterdata from "./test/masterdata/Masterdata";
import Tambahdatakelas from "./test/masterdata/Tambahdatakelas";
import Editmasterdata from "./test/masterdata/Editmasterdata";

// Tagihan
import Tagihan from "./test/tagihan/Tagihan";
import TambahdataTagihan from "./test/tagihan/TambahdataTagihan";
import EditTagihan from "./test/tagihan/EditTagihan";
import RekapTagihan from "./test/tagihan/RekapTagihan";

// Presensi
import Presensi from "./test/presensi/Presensi";
import RekapPresensi from "./test/presensi/RekapPresensi";
import EditPresensi from "./test/presensi/EditPresensi";

// Kelas
import DataKelas from "./test/kelas/DataKelas";
import Tmbhkls from "./test/kelas/Tmbhkls";
import Editkelas from "./test/kelas/Editkelas";

// Kategori Master Data
import Datakategoridata from "./test/kategorimasterdata/Datakategoridata";
import TambahKategoridata from "./test/kategorimasterdata/TambahKategoridata";
import EditKategoridata from "./test/kategorimasterdata/Editkategoridata";

// Kategori Tagihan
import KategoriTagihan from "./test/kategoritagihan/KategoriTagihan";
import TambahKategoriTagihan from "./test/kategoritagihan/TambahKategoriTagihan";
import EditKategoriTagihan from "./test/kategoritagihan/EditKategoriTagihan";

const App = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={<Dasbor />} />

      {/* Master Data */}
      <Route path="/h" element={<Masterdata />} />
      <Route path="/t" element={<Tambahdatakelas />} />
      <Route path="/edit/:id" element={<Editmasterdata />} />

      {/* Tagihan */}
      <Route path="/tagihan" element={<Tagihan />} />
      <Route path="/tagihan/tambah" element={<TambahdataTagihan />} />
      <Route path="/tagihan/edit/:id" element={<EditTagihan />} />
      <Route path="/tagihan/rekap" element={<RekapTagihan />} />

      {/* Presensi */}
      <Route path="/presensi" element={<Presensi />} />
      <Route path="/rekap-presensi" element={<RekapPresensi />} />
      <Route path="/edit-presensi/:id" element={<EditPresensi />} />

      {/* Kelas */}
      <Route path="/kelas" element={<DataKelas />} />
      <Route path="/tambahkelas/:kelas?" element={<Tmbhkls />} />
      <Route path="/editkelas/:id" element={<Editkelas />} />

      {/* Kategori Master Data */}
      <Route path="/kategoridata/data" element={<Datakategoridata />} />
      <Route path="/kategoridata/tambah-data" element={<TambahKategoridata />} />
      <Route path="/kategoridata/edit-data/:id" element={<EditKategoridata />} />

      {/* Kategori Tagihan */}
      <Route path="/kategoriTagihan" element={<KategoriTagihan />} />
      <Route path="/kategoriTagihan/tambah" element={<TambahKategoriTagihan />} />
      <Route path="/kategoriTagihan/edit/:id" element={<EditKategoriTagihan />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Misc */}
      <Route path="/w" element={<Horw />} />
    </Routes>
  );
};

export default App;
