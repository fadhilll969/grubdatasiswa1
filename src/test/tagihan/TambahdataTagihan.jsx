import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../../config/api";


const API_TAGIHAN = "http://localhost:8080/api/tagihan";

const TambahdataTagihan = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    jumlah: "",
    tanggal: "",
    jenisTagihan: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nama: form.nama,
        email: form.email,
        jumlah: Number(form.jumlah),
        tanggal: form.tanggal,
        jenisTagihan: form.jenisTagihan || "",
        // jangan kirim status
      };

      const res = await axios.post(API_TAGIHAN, payload, {
        headers: { "Content-Type": "application/json" },
      });

      Swal.fire("Berhasil", "Data tagihan berhasil ditambahkan", "success");

      setForm({
        nama: "",
        email: "",
        jumlah: "",
        tanggal: "",
        jenisTagihan: "",
      });

      navigate("/tagihan");
    } catch (err) {
      console.error("ERROR:", err.response || err);
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Tambah data gagal",
        "error"
      );
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
            <div>
              <label className="block font-semibold mb-2">Nama</label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan nama"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Jumlah</label>
              <input
                name="jumlah"
                type="number"
                min="1"
                value={form.jumlah}
                onChange={handleChange}
                placeholder="Masukkan jumlah"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
            </div>

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

            <div>
              <label className="block font-semibold mb-2">Jenis Tagihan</label>
              <input
                name="jenisTagihan"
                value={form.jenisTagihan}
                onChange={handleChange}
                placeholder="Opsional"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/tagihan")}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
              >
                <i className="ri-arrow-left-line"></i> Kembali
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
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
