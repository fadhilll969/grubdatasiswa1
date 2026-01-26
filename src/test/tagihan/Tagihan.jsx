import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dasbor from "../Dasbor";
import axios from "axios";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../../config/api";

const TAGIHAN_URL = `${BASE_URL}/tagihan`;

const Tagihan = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // ================= GET DATA =================
  const fetchData = async () => {
    try {
      const resTagihan = await axios.get(TAGIHAN_URL);

      setData(
        resTagihan.data.map((item) => ({
          ...item,
          status: item.status || "Belum Bayar",
          jumlah: Number(item.jumlah || 0),
        }))
      );
    } catch (err) {
      Swal.fire("Gagal", "Tidak dapat memuat data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, statusBaru) => {
    const ok = await Swal.fire({
      title: "Konfirmasi",
      text: `Ubah status menjadi ${statusBaru}?`,
      showCancelButton: true,
    });

    if (!ok.isConfirmed) return;

    try {
      const dataLama = data.find((d) => d.id === id);

      await axios.put(`${TAGIHAN_URL}/${id}`, {
        ...dataLama,
        status: statusBaru,
      });

      setData((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, status: statusBaru } : d
        )
      );

      Swal.fire("Berhasil", "Status diperbarui", "success");
    } catch {
      Swal.fire("Gagal", "Update gagal", "error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const ok = await Swal.fire({
      title: "Hapus data?",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (!ok.isConfirmed) return;

    try {
      await axios.delete(`${TAGIHAN_URL}/${id}`);
      setData((prev) => prev.filter((d) => d.id !== id));
      Swal.fire("Berhasil", "Data dihapus", "success");
    } catch {
      Swal.fire("Gagal", "Hapus gagal", "error");
    }
  };

  // ================= FILTER =================
  const filteredData = data.filter((item) => {
    const cocokNama = (item.nama || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const cocokStatus =
      filterStatus === "Semua" || item.status === filterStatus;

    return cocokNama && cocokStatus;
  });

  // ================= FORMAT TANGGAL =================
  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const t = new Date(tanggal);
    if (isNaN(t)) return "-";
    return t.toLocaleDateString("id-ID");
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />

      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="bg-sky-600 py-4 px-6 flex items-center justify-center gap-2 rounded-t-xl">
            <h3 className="text-2xl font-semibold text-white">
              Manajemen Tagihan
            </h3>
          </div>

          <div className="p-4 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Cari nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-lg w-full md:w-1/3"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded-lg w-full md:w-1/4"
            >
              <option value="Semua">Semua</option>
              <option value="Sudah Bayar">Sudah Bayar</option>
              <option value="Belum Bayar">Belum Bayar</option>
            </select>

            <button
              onClick={() => navigate("/tagihan/tambah")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <i className="ri-add-circle-line"></i> Tambah Tagihan
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-6">
            <table className="min-w-full table-auto text-gray-700">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4 text-left">Nama</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-right">Jumlah</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Tanggal</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length ? (
                  filteredData.map((d, i) => (
                    <tr
                      key={d.id}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-sky-50"} hover:bg-sky-100`}
                    >
                      <td className="py-3 px-4 text-center">{i + 1}</td>
                      <td className="py-3 px-4">{d.nama}</td>
                      <td className="py-3 px-4">{d.email || "-"}</td>
                      <td className="py-3 px-4 text-right">
                        Rp {d.jumlah.toLocaleString("id-ID")}
                      </td>
                      <td className={`py-3 px-4 font-semibold ${d.status === "Sudah Bayar" ? "text-green-600" : "text-red-600"}`}>
                        {d.status}
                      </td>
                      <td className="py-3 px-4">{formatTanggal(d.tanggal)}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              updateStatus(
                                d.id,
                                d.status === "Sudah Bayar"
                                  ? "Belum Bayar"
                                  : "Sudah Bayar"
                              )
                            }
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                          >
                            <i className="ri-refresh-line" />
                          </button>

                          <button
                            onClick={() => navigate(`/tagihan/edit/${d.id}`)}
                            className="bg-sky-500 text-white px-2 py-1 rounded"
                          >
                            <i className="ri-edit-2-line" />
                          </button>

                          <button
                            onClick={() => handleDelete(d.id)}
                            className="bg-red-600 text-white px-2 py-1 rounded"
                          >
                            <i className="ri-delete-bin-line" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-center text-gray-500">
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
