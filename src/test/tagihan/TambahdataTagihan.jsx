import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../../config/api";

const API_TAGIHAN = `${BASE_URL}/tagihan`;
const API_MASTER = `${BASE_URL}/masterdata`;
const API_KATEGORI = `${BASE_URL}/kategoritagihan`;

const TambahdataTagihan = () => {
  const navigate = useNavigate();

  const [masterList, setMasterList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);

  const [form, setForm] = useState({
    masterdataId: "",
    email: "",
    kategoriId: "",
    jumlah: "",
    tanggal: "",
  });

  const [loading, setLoading] = useState(false);

  // ===== GET MASTERDATA SISWA & KATEGORI =====
  useEffect(() => {
    const fetchMaster = async () => {
      try {
        const resMaster = await axios.get(`${API_MASTER}/siswa`);
        setMasterList(resMaster.data); // sudah filter Siswa di backend
      } catch (err) {
        console.error("Gagal ambil master data:", err);
      }
    };

    const fetchKategori = async () => {
      try {
        const resKategori = await axios.get(API_KATEGORI);
        setKategoriList(resKategori.data.filter((k) => k.aktif));
      } catch (err) {
        console.error("Gagal ambil kategori:", err);
      }
    };

    fetchMaster();
    fetchKategori();
  }, []);

  // ===== PILIH NAMA → AUTO EMAIL =====
  const handleMasterChange = (e) => {
    const id = e.target.value;
    const selected = masterList.find((m) => m.id.toString() === id);

    setForm({
      ...form,
      masterdataId: id,
      email: selected?.email || "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.masterdataId || !form.kategoriId) {
      Swal.fire("Error", "Nama dan Kategori wajib dipilih", "error");
      return;
    }

    setLoading(true);

    try {
      // ===== FIX: endpoint tanpa "/tambah" & payload sesuai Spring =====
      await axios.post(
        API_TAGIHAN,
        {
          masterdata: { id: Number(form.masterdataId) },
          kategoriTagihan: { id: Number(form.kategoriId) },
          jumlah: Number(form.jumlah),
          tanggal: form.tanggal, // format "yyyy-MM-dd"
        },
        { headers: { "Content-Type": "application/json" } }
      );


      Swal.fire("Berhasil", "Data tagihan berhasil ditambahkan", "success");
      navigate("/tagihan");
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Tambah data gagal", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-sky-700 text-center mb-6">
            Tambah Data Tagihan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAMA (Siswa) */}
            <div>
              <label className="block font-semibold mb-2">Nama</label>
              <select
                value={form.masterdataId}
                onChange={handleMasterChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              >
                <option value="">-- Pilih Nama (Siswa) --</option>
                {masterList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                value={form.email}
                readOnly
                placeholder="Email siswa"
                className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2 outline-none"
              />
            </div>

            {/* KATEGORI TAGIHAN */}
            <div>
              <label className="block font-semibold mb-2">Kategori Tagihan</label>
              <select
                name="kategoriId"
                value={form.kategoriId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              >
                <option value="">-- Pilih Kategori --</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* JUMLAH */}
            <div>
              <label className="block font-semibold mb-2">Jumlah</label>
              <input
                name="jumlah"
                type="text"
                value={
                  form.jumlah
                    ? `Rp. ${Number(form.jumlah).toLocaleString("id-ID")}`
                    : ""
                }
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, jumlah: numericValue });
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Rp. 0"
                required
              />
            </div>

            {/* TANGGAL */}
            <div>
              <label className="block font-semibold mb-2">Tanggal</label>
              <input
                name="tanggal"
                type="date"
                value={form.tanggal}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
            </div>

            {/* BUTTON */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/tagihan")}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                <i className="ri-arrow-left-line"></i> Kembali
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  !form.masterdataId ||
                  !form.kategoriId ||
                  !form.jumlah ||
                  !form.tanggal
                }
                className={`bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg ${loading ||
                  !form.masterdataId ||
                  !form.kategoriId ||
                  !form.jumlah ||
                  !form.tanggal
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                  }`}
              >
                <i className="ri-save-3-line"></i>{" "}
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahdataTagihan;
