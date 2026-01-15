import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import api from "../config/api";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

const Tagihan = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    return new Date(tanggal).toLocaleDateString("id-ID");
  };

  const fetchData = async () => {
    try {
      const res = await api.get("/tagihan");
      setData(
        res.data.reverse().map((item) => ({
          ...item,
          status: item.status || "Belum Bayar",
        }))
      );
    } catch {
      Swal.fire("Gagal", "Tidak dapat memuat data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, statusBaru) => {
    const ok = await Swal.fire({
      title: "Konfirmasi",
      text: `Ubah status jadi ${statusBaru}?`,
      showCancelButton: true,
    });

    if (!ok.isConfirmed) return;

    try {
      await api.patch(`/tagihan/${id}`, { status: statusBaru });
      setData((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: statusBaru } : d))
      );
      Swal.fire("Berhasil", "Status diperbarui", "success");
    } catch {
      Swal.fire("Gagal", "Update gagal", "error");
    }
  };

  const handleDelete = async (id) => {
    const ok = await Swal.fire({
      title: "Hapus data?",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (!ok.isConfirmed) return;

    try {
      await api.delete(`/tagihan/${id}`);
      setData((prev) => prev.filter((d) => d.id !== id));
      Swal.fire("Berhasil", "Data dihapus", "success");
    } catch {
      Swal.fire("Gagal", "Hapus gagal", "error");
    }
  };

  const filteredData = data.filter((item) => {
    const nama = (item.nama || "").toLowerCase();
    const cocokNama = nama.includes(searchTerm.toLowerCase());
    const cocokStatus =
      filterStatus === "Semua" || item.status === filterStatus;
    return cocokNama && cocokStatus;
  });

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />

      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="bg-sky-700 px-4 py-3 text-white text-xl font-semibold rounded-t-lg">
            Manajemen Tagihan
          </div>

          <div className="p-4 flex flex-wrap gap-3 items-center">
            <div className="relative w-full md:w-1/3">
              <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
              <input
                type="text"
                placeholder="Cari berdasarkan nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 pl-10 border-2 rounded-lg w-full focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-sky-400"
            >
              <option value="Semua">Semua</option>
              <option value="Sudah Bayar">Sudah Bayar</option>
              <option value="Belum Bayar">Belum Bayar</option>
            </select>

            <button
              className="p-2 px-4 bg-blue-600 ml-55 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              onClick={() => navigate("/t")}
            >
              <i className="ri-add-circle-line"></i>
              Tambah Tagihan
            </button>
          </div>
        </div>


        {loading ? (
          <p className="text-center mt-6">Loading...</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="py-2">No</th>
                  <th className="py-2">Nama</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Jumlah</th>
                  <th className="py-2">Jenis</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Tanggal</th>
                  <th className="py-2">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length ? (
                  filteredData.map((d, i) => (
                    <tr key={d.id} className="text-center border-t">
                      <td className="py-2">{i + 1}</td>
                      <td className="py-2">{d.nama}</td>
                      <td className="py-2">{d.email}</td>
                      <td className="py-2">
                        Rp {Number(d.jumlah || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="py-2">{d.jenisTagihan}</td>
                      <td
                        className={`py-3 px-4 text-center font-semibold ${d.status === "Sudah Bayar"
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {d.status}
                      </td>

                      <td className="py-2">
                        {formatTanggal(d.tanggal)}
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() =>
                            updateStatus(
                              d.id,
                              d.status === "Sudah Bayar"
                                ? "Belum Bayar"
                                : "Sudah Bayar"
                            )
                          }
                          className="bg-yellow-500 text-white px-2 rounded mx-1"
                        >
                          <i className="ri-refresh-line" />
                        </button>

                        <button
                          onClick={() => navigate(`/ed/${d.id}`)}
                          className="bg-sky-600 text-white px-2 rounded mx-1"
                        >
                          <i className="ri-edit-2-line" />
                        </button>

                        <button
                          onClick={() => handleDelete(d.id)}
                          className="bg-red-600 text-white px-2 rounded mx-1"
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-4 text-center text-gray-500">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tagihan;
