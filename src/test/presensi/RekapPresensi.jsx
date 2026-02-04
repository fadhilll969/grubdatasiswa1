import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dasbor from "../Dasbor";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config/api";

const API_PRESENSI = `${BASE_URL}/presensi`;


const RekapPresensi = () => {
  const [dataPresensi, setDataPresensi] = useState([]);
  const [filterKehadiran, setFilterKehadiran] = useState("SEMUA");
  const [filterTanggal, setFilterTanggal] = useState(null); // pakai Date object
  const navigate = useNavigate();
 
  const formatTanggal = (tgl) => {
    const [year, month, day] = tgl.split("-");
    return `${day}/${month}/${year}`;
  };

  const fetchPresensi = async () => {
    try {
      const res = await axios.get(API_PRESENSI);
      const formatted = res.data
        .map((d) => ({ ...d, tanggalFormatted: formatTanggal(d.tanggal) }))
        .reverse();
      setDataPresensi(formatted);
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data presensi", "error");
    }
  };

  useEffect(() => {
    fetchPresensi();
  }, []);

  const hapusPresensi = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await axios.delete(`${API_PRESENSI}/${id}`);
      setDataPresensi(dataPresensi.filter((p) => p.id !== id));
      Swal.fire("Berhasil", "Data berhasil dihapus", "success");
    }
  };

   const filteredPresensi = dataPresensi.filter((item) => {
    let pass = true;

    if (filterKehadiran !== "SEMUA") pass = pass && item.kehadiran === filterKehadiran;

    if (filterTanggal) {
      const itemDate = new Date(item.tanggal);  
      pass = pass && (
        itemDate.getFullYear() === filterTanggal.getFullYear() &&
        itemDate.getMonth() === filterTanggal.getMonth() &&
        itemDate.getDate() === filterTanggal.getDate()
      );
    }

    return pass;
  });

  return (
    <div className="min-h-screen bg-sky-200 flex flex-col md:flex-row">
      <Dasbor />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Rekap Presensi</h2>

          <div className="mb-4 mt-10 flex flex-wrap gap-3 items-center">
             <select
              value={filterKehadiran}
              onChange={(e) => setFilterKehadiran(e.target.value)}
              className="p-2 border-2 bg-white rounded-lg w-full md:w-1/5 focus:ring-2 focus:ring-sky-400"
            >
              <option value="SEMUA">Semua</option>
              <option value="HADIR">Hadir</option>
              <option value="IZIN">Izin</option>
            </select>

             <input
              type="date"
              value={filterTanggal ? filterTanggal.toISOString().substring(0, 10) : ""}
              onChange={(e) =>
                setFilterTanggal(e.target.value ? new Date(e.target.value) : null)
              }
              className="px-5 py-2 border-2 bg-white rounded-lg w-full md:w-1/5 focus:ring-2 focus:ring-sky-400"
            />
          </div>


          <div className="overflow-x-auto bg-white rounded-lg mt-6 shadow-md">
            <table className="min-w-full table-auto text-gray-700">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-center">No</th>
                  <th className="py-3 px-4 text-left">Nama</th>
                  <th className="py-3 px-4 text-left">Kehadiran</th>
                  <th className="py-3 px-4 text-left">Keterangan</th>
                  <th className="py-3 px-4 text-center">Jam Masuk</th>
                  <th className="py-3 px-4 text-center">Jam Pulang</th>
                  <th className="py-3 px-4 text-center">Tanggal</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPresensi.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-4 text-center text-gray-500 italic">
                      Data presensi kosong
                    </td>
                  </tr>
                ) : (
                  filteredPresensi.map((item, i) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-sky-100 ${i % 2 === 0 ? "bg-white" : "bg-sky-50"}`}
                    >
                      <td className="py-3 px-4 text-center">{i + 1}</td>
                      <td className="py-3 px-4">{item.nama}</td>
                      <td
                        className={`py-3 px-4 font-bold ${item.kehadiran === "HADIR" ? "text-green-600" : "text-yellow-600"
                          }`}
                      >
                        {item.kehadiran}
                      </td>
                      <td className="py-3 px-4">{item.keterangan || "-"}</td>
                      <td className="py-3 px-4 text-center">{item.jamMasuk || "-"}</td>
                      <td className="py-3 px-4 text-center">{item.jamPulang || "-"}</td>
                      <td className="py-3 px-4 text-center">{item.tanggalFormatted}</td>
                      <td className="py-3 px-4 flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/edit-presensi/${item.id}`)}
                          className="bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600"
                        >
                          <i className="ri-edit-2-line text-sm"></i>
                        </button>
                        <button
                          onClick={() => hapusPresensi(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                          <i className="ri-delete-bin-6-line text-sm"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RekapPresensi;
