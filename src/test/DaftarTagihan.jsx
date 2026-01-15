import { useEffect, useState } from "react";
import Dasbor from "./Dasbor";
import api from "../config/api";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

const DaftarTagihan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const formatRupiah = (num) =>
    "Rp " + Number(num || 0).toLocaleString("id-ID");

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    return new Date(tanggal).toLocaleDateString("id-ID");
  };

  const fetchData = async () => {
    try {
      const res = await api.get("/tagihan");

      const hasil = res.data.map((item) => ({
        ...item,
        status: item.status || "Belum Bayar",
        jumlah: Number(item.jumlah || 0),
      }));

      setData(hasil);

      const totalAmount = hasil.reduce((s, i) => s + i.jumlah, 0);
      const sudahBayar = hasil.filter((i) => i.status === "Sudah Bayar");
      const sudahBayarAmount = sudahBayar.reduce(
        (s, i) => s + i.jumlah,
        0
      );

      setSummary({
        totalCount: hasil.length,
        totalAmount,
        sudahBayarCount: sudahBayar.length,
        sudahBayarAmount,
        belumBayarCount: hasil.length - sudahBayar.length,
        belumBayarAmount: totalAmount - sudahBayarAmount,
      });
    } catch {
      Swal.fire("Gagal", "Tidak dapat memuat rekap", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchNama = item.nama
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchStatus =
      searchCategory === "Semua" || item.status === searchCategory;

    return matchNama && matchStatus;
  });

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />

      <div className="flex-1 p-6">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border-t-4 border-sky-600 rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold">Total Tagihan</h3>
            <p className="text-2xl font-bold">{summary.totalCount} Data</p>
            <p className="text-sky-700 font-semibold">
              {formatRupiah(summary.totalAmount)}
            </p>
          </div>

          <div className="bg-white border-t-4 border-green-600 rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold">Sudah Bayar</h3>
            <p className="text-2xl font-bold text-green-600">
              {summary.sudahBayarCount} Data
            </p>
            <p className="text-green-700 font-semibold">
              {formatRupiah(summary.sudahBayarAmount)}
            </p>
          </div>

          <div className="bg-white border-t-4 border-red-600 rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold">Belum Bayar</h3>
            <p className="text-2xl font-bold text-red-600">
              {summary.belumBayarCount} Data
            </p>
            <p className="text-red-700 font-semibold">
              {formatRupiah(summary.belumBayarAmount)}
            </p>
          </div>
        </div>

         <div className="bg-white rounded-xl shadow p-5 mb-6 flex flex-col md:flex-row gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Cari nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="Semua">Semua</option>
            <option value="Sudah Bayar">Sudah Bayar</option>
            <option value="Belum Bayar">Belum Bayar</option>
          </select>
        </div>

         {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="py-2">No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Jumlah</th>
                  <th>Jenis</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length ? (
                  filteredData.map((d, i) => (
                    <tr key={d.id} className="text-center border-t">
                      <td className="py-2">{i + 1}</td>
                      <td>{d.nama}</td>
                      <td>{d.email || "-"}</td>
                      <td className="text-right pr-4">
                        {formatRupiah(d.jumlah)}
                      </td>
                      <td>{d.jenisTagihan}</td>
                      <td
                        className={`font-semibold ${
                          d.status === "Sudah Bayar"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {d.status}
                      </td>
                      <td>{formatTanggal(d.tanggal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
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

export default DaftarTagihan;
