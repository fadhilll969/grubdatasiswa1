import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../../config/api";

const API_TAGIHAN = `${BASE_URL}/tagihan`;
const API_MASTER = `${BASE_URL}/masterdata`;
const API_KATEGORI = `${BASE_URL}/kategoritagihan`;

const EditTagihan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [masterList, setMasterList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    masterdataId: "",
    email: "",
    kategoriId: "",
    jumlah: "",
    tanggal: "",
  });

  // ===== Ambil master & kategori =====
  useEffect(() => {
    axios.get(API_MASTER).then((res) => {
      setMasterList(res.data.filter((m) => m.kategori === "Siswa"));
    });

    axios.get(API_KATEGORI).then((res) => {
      setKategoriList(res.data.filter((k) => k.aktif));
    });
  }, []);

  // ===== Ambil data tagihan =====
  useEffect(() => {
    axios
      .get(`${API_TAGIHAN}/${id}`)
      .then((res) => {
        const t = res.data;
        setForm({
          masterdataId: t.masterdata?.id?.toString() || "",
          email: t.masterdata?.email || "",
          kategoriId: t.kategoriTagihan?.id?.toString() || "",
          jumlah: t.jumlah ? t.jumlah.toString() : "",
          tanggal: t.tanggal ? t.tanggal.slice(0, 10) : "",
        });
        setLoading(false);
      })
      .catch(() => {
        Swal.fire("Error", "Data tidak ditemukan", "error");
        navigate("/tagihan");
      });
  }, [id, navigate]);

  // ===== pilih nama -> auto email =====
  const handleMasterChange = (e) => {
    const val = e.target.value;
    const selected = masterList.find((m) => m.id.toString() === val);

    setForm({
      ...form,
      masterdataId: val,
      email: selected?.email || "",
    });
  };

  // ===== change handler =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "jumlah") {
      const onlyNumber = value.replace(/[^0-9]/g, "");
      setForm({ ...form, jumlah: onlyNumber });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ===== submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.masterdataId || !form.kategoriId) {
      Swal.fire("Error", "Nama & Kategori wajib diisi", "error");
      return;
    }

    try {
      await axios.put(`${API_TAGIHAN}/${id}`, {
        jumlah: Number(form.jumlah),
        tanggal: form.tanggal,
        masterdata: { id: form.masterdataId },
        kategoriTagihan: { id: form.kategoriId },
      });

      Swal.fire("Berhasil", "Data tagihan diperbarui", "success");
      navigate("/tagihan");
    } catch {
      Swal.fire("Gagal", "Update gagal", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-200 flex">
        <Dasbor />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />

      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-sky-700 text-center mb-6">
            Edit Data Tagihan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAMA */}
            <div>
              <label className="block font-semibold mb-2">Nama</label>
              <select
                value={form.masterdataId}
                onChange={handleMasterChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              >
                <option value="">-- Pilih Nama --</option>
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
                className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2 outline-none"
              />
            </div>

            {/* KATEGORI */}
            <div>
              <label className="block font-semibold mb-2">Jenis Tagihan</label>
              <select
                name="kategoriId"
                value={form.kategoriId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              >
                <option value="">-- Pilih Jenis Tagihan --</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

           <div>
              <label className="block font-semibold mb-2">Jumlah</label>
              <input
                name="jumlah"
                type="text"
                value={
                  form.jumlah ? `Rp. ${Number(form.jumlah).toLocaleString("id-ID")}` : ""
                }
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, ""); // Ambil angka saja
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
              />
            </div>

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
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg"
              >
                <i className="ri-save-3-line"></i> Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTagihan;
