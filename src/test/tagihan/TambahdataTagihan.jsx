import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";

const API_URL = "http://localhost:5000/coco";

const TambahdataTagihan = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    jumlah: "",
    status: "Belum Bayar",
    tanggal: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, {
        ...form,
        jumlah: Number(form.jumlah),
        tanggal: form.tanggal || new Date().toISOString(),
      });

      Swal.fire("Berhasil", "Data tagihan ditambahkan", "success");
      navigate("/tagihan");
    } catch {
      Swal.fire("Gagal", "Tambah data gagal", "error");
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
                value={form.jumlah}
                onChange={handleChange}
                placeholder="Masukkan jumlah"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option value="Belum Bayar">Belum Bayar</option>
                <option value="Sudah Bayar">Sudah Bayar</option>
              </select>
            </div>

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
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
              >
                <i className="ri-arrow-left-line"></i> Kembali
              </button>

              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition"
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

export default TambahdataTagihan;
