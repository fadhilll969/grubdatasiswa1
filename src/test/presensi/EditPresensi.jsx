import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import { BASE_URL } from "../../config/api";



const EditPresensi = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kehadiran: "",
    keterangan: "",
    jamMasuk: "",
    jamPulang: "",
  });

  const [loading, setLoading] = useState(false);
const API_PRESENSI = `${BASE_URL}/presensi`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_PRESENSI}/${id}`);
        setForm({
          kehadiran: res.data.kehadiran,
          keterangan: res.data.keterangan || "",
          jamMasuk: res.data.jamMasuk || "",
          jamPulang: res.data.jamPulang || "",
        });
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data", "error");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===== VALIDASI =====
    if (form.kehadiran === "IZIN") {
      if (!form.keterangan.trim()) {
        return Swal.fire("Isi keterangan izin!", "", "warning");
      }
      form.jamMasuk = "";
      form.jamPulang = "";
    }

    if (form.kehadiran === "HADIR") {
      if (!form.jamMasuk) {
        return Swal.fire("Jam masuk wajib diisi", "", "warning");
      }
      if (form.jamPulang && form.jamPulang < form.jamMasuk) {
        return Swal.fire(
          "Jam pulang tidak valid",
          "Jam pulang tidak boleh lebih awal dari jam masuk",
          "warning"
        );
      }
      form.keterangan = "";
    }

    setLoading(true);
    try {
      await axios.put(`${API_PRESENSI}/${id}`, form);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data presensi diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/rekap-presensi");
    } catch (err) {
      Swal.fire("Error", "Gagal menyimpan data", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 flex justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-5"
        >
          <h2 className="text-2xl font-bold text-center text-sky-700">
            Edit Presensi
          </h2>

          {/* KETERANGAN */}
          <div>
            <label className="font-semibold block mb-1">Keterangan</label>
            <input
              type="text"
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              disabled={form.kehadiran === "HADIR"}
              className={`w-full border p-2 rounded ${
                form.kehadiran === "HADIR"
                  ? "bg-gray-200 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>

          {/* JAM MASUK */}
          <div>
            <label className="font-semibold block mb-1">Jam Masuk</label>
            <input
              type="time"
              name="jamMasuk"
              value={form.jamMasuk}
              onChange={handleChange}
              disabled={form.kehadiran === "IZIN"}
              className={`w-full border p-2 rounded ${
                form.kehadiran === "IZIN"
                  ? "bg-gray-200 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>

          {/* JAM PULANG */}
          <div>
            <label className="font-semibold block mb-1">Jam Pulang</label>
            <input
              type="time"
              name="jamPulang"
              value={form.jamPulang}
              onChange={handleChange}
              disabled={!form.jamMasuk || form.kehadiran === "IZIN"}
              className={`w-full border p-2 rounded ${
                !form.jamMasuk || form.kehadiran === "IZIN"
                  ? "bg-gray-200 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/rekap-presensi")}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPresensi;
