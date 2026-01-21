import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";

const EditPresensi = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    keterangan: "",
    jamMasuk: "",
    jamPulang: "",
  });

  const [loading, setLoading] = useState(false);
  const API_PRESENSI = "http://localhost:5000/presensi";

  const formatTimeForInput = (time) => {
    if (!time) return "";
    return time.replace(".", ":");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_PRESENSI}/${id}`);
        setForm({
          ...res.data,
          jamMasuk: formatTimeForInput(res.data.jamMasuk),
          jamPulang: formatTimeForInput(res.data.jamPulang),
        });
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Gagal mengambil data presensi", "error");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_PRESENSI}/${id}`, form);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data presensi berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/rekap-presensi");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal memperbarui data presensi", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 flex justify-center items-start p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md mt-8 space-y-5"
        >
          <h2 className="text-2xl font-bold mb-6 text-sky-700 text-center">
            Edit Presensi
          </h2>


          <div>
            <label className="block font-semibold mb-2">Alasan / Keterangan</label>
            <input
              type="text"
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              placeholder="Masukkan keterangan"
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none ${form.kehadiran === "HADIR" ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
              disabled={form.kehadiran === "HADIR"}
            />
          </div>


          <div>
            <label className="block font-semibold mb-2">Jam Masuk</label>
            <input
              type="time"
              name="jamMasuk"
              value={form.jamMasuk}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none ${form.kehadiran === "IZIN" ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
              disabled={form.kehadiran === "IZIN"}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Jam Pulang</label>
            <input
              type="time"
              name="jamPulang"
              value={form.jamPulang}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none ${!form.jamMasuk ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
              disabled={!form.jamMasuk}   
            />
          </div>



          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("/rekap-presensi")}
              className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition flex items-center gap-1"
            >
              <i className="ri-arrow-left-line"></i> Kembali
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <i className="ri-save-3-line"></i>
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPresensi;
