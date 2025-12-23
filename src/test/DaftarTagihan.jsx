import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import axios from "axios";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

const DaftarTagihan = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const filterOptions = ["Sudah Bayar", "Belum Bayar"];
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("Semua");

  const [summary, setSummary] = useState({
    totalCount: 0,
    totalAmount: 0,
    sudahBayarCount: 0,
    sudahBayarAmount: 0,
    belumBayarCount: 0,
    belumBayarAmount: 0,
  });

  const safeNumber = (value) => Number(value || 0);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/coco");
      const hasil = response.data
        .map((item) => ({
          ...item,
          status: item.status || "Belum Bayar",
          jumlah: safeNumber(item.jumlah),
        }))
        .reverse(); 

      setData(hasil);

      const totalAmount = hasil.reduce((sum, i) => sum + i.jumlah, 0);
      const sudahBayar = hasil.filter((i) => i.status === "Sudah Bayar");
      const sudahBayarAmount = sudahBayar.reduce((sum, i) => sum + i.jumlah, 0);

      const belumBayarCount = hasil.length - sudahBayar.length;
      const belumBayarAmount = totalAmount - sudahBayarAmount;

      setSummary({
        totalCount: hasil.length,
        totalAmount,
        sudahBayarCount: sudahBayar.length,
        sudahBayarAmount,
        belumBayarCount,
        belumBayarAmount,
      });
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      Swal.fire("Gagal", "Tidak dapat memuat data tagihan.", "error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchName = item.nama?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      searchCategory === "Semua" || item.status === searchCategory;
    return matchName && matchCategory;
  });

  const formatRupiah = (num) => "Rp " + Number(num || 0).toLocaleString("id-ID");

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const date = new Date(tanggal);
    if (isNaN(date)) return tanggal;
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-sky-200">
      <div className="flex">
        <Dasbor />

        <div className="flex-1 p-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

            <div className="bg-white border-t-4 border-sky-600 rounded-xl shadow-lg p-5 flex items-center gap-4">
              <div className="p-4 rounded-full bg-sky-100">
                <i className="ri-database-2-line text-3xl text-sky-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Total Tagihan</h3>
                <p className="text-2xl font-bold text-gray-900">{summary.totalCount} Data</p>
                <p className="text-lg font-semibold text-sky-700">
                  Rp. {summary.totalAmount.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="bg-white border-t-4 border-green-600 rounded-xl shadow-lg p-5 flex items-center gap-4">
              <div className="p-4 rounded-full bg-green-100">
                <i className="ri-check-double-line text-3xl text-green-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Sudah Bayar</h3>
                <p className="text-2xl font-bold text-green-600">
                  {summary.sudahBayarCount} Data
                </p>
                <p className="text-lg font-semibold text-green-700">
                  Rp. {summary.sudahBayarAmount.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="bg-white border-t-4 border-red-600 rounded-xl shadow-lg p-5 flex items-center gap-4">
              <div className="p-4 rounded-full bg-red-100">
                <i className="ri-close-circle-line text-3xl text-red-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Belum Bayar</h3>
                <p className="text-2xl font-bold text-red-600">
                  {summary.belumBayarCount} Data
                </p>
                <p className="text-lg font-semibold text-red-700">
                  Rp. {summary.belumBayarAmount.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

          </div>


          <div className="rounded-xl mt-10 overflow-hidden">
            <div className="p-5 flex flex-col md:flex-row gap-4">

              <div className="relative w-full md:w-1/3">
                <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 pl-10 border-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <select
                className="p-2 border-2 rounded-lg w-full md:w-1/3 bg-white focus:ring-2 focus:ring-sky-400"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="Semua">Semua</option>
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

            </div>
          </div>


          {loading ? (
            <p className="text-center mt-6 text-gray-700">
              Memuat data tagihan...
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden shadow-md">
                <thead className="bg-sky-600 text-left text-white">
                  <tr>
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4">Jenis Tagihan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Tanggal</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.id || `${item.nama}-${index}`}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-sky-50"
                          } hover:bg-sky-100 transition`}
                      >
                        <td className="py-3 text-center px-4">{index + 1}</td>
                        <td className="py-3 px-4">{item.nama}</td>
                        <td className="py-3 px-4">{item.email || "-"}</td>
                        <td className="py-3 px-4 text-right">
                          {formatRupiah(item.jumlah)}
                        </td>
                        <td className="py-3 px-4">{item.jenisTagihan}</td>
                        <td
                          className={`py-3 px-4 text-center font-semibold ${item.status === "Sudah Bayar"
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                        >
                          {item.status}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatTanggal(item.tanggal)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-gray-500 italic">
                        Tidak terdapat data tagihan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DaftarTagihan;
