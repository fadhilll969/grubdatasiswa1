import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";

const API_URL = "http://localhost:5000/coco";

const EditTagihan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    jumlah: "",
    status: "Belum Bayar",
    tanggal: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/${id}`)
      .then((res) => {
        setForm({
          ...res.data,
          tanggal: res.data.tanggal
            ? res.data.tanggal.slice(0, 10)
            : "",
        });
        setLoading(false);
      })
      .catch(() => {
        Swal.fire("Error", "Data tidak ditemukan", "error");
        navigate("/tagihan");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/${id}`, {
        ...form,
        jumlah: Number(form.jumlah),
      });

      Swal.fire("Berhasil", "Data diperbarui", "success");
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
            <div>
              <label className="block font-semibold mb-2">Nama</label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
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

export default EditTagihan;
