import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Dasbor from "../Dasbor";
import { BASE_URL } from "../../config/api";

const API_URL = `${BASE_URL}/tagihan`;

const RekapTagihan = () => {
  const [data, setData] = useState([]);
  const location = useLocation(); // WAJIB di dalam component

  useEffect(() => {
    axios.get(API_URL).then((res) => {
      const sorted = [...res.data].sort((a, b) => {
        if (a.tanggal && b.tanggal) {
          return new Date(b.tanggal) - new Date(a.tanggal);
        }
        return b.id - a.id;
      });

      setData(sorted);
    });
  }, [location]); // refresh setiap masuk halaman

  const total = data.reduce((a, b) => a + Number(b.jumlah || 0), 0);

  const sudah = data
    .filter((d) => d.status === "Sudah Bayar")
    .reduce((a, b) => a + Number(b.jumlah || 0), 0);

  const belum = total - sudah;

  const formatTanggal = (tgl) =>
    tgl ? new Date(tgl).toLocaleDateString("id-ID") : "-";

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />

      <div className="flex-1 p-6">
        {/* HEADER + RINGKASAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* TOTAL */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-5 rounded-xl shadow-lg hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm opacity-90">Total Tagihan</h3>
                <p className="text-2xl font-bold mt-1">
                  Rp {total.toLocaleString("id-ID")}
                </p>
              </div>
              <i className="ri-wallet-3-line text-4xl opacity-80" />
            </div>
          </div>

          {/* SUDAH BAYAR */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-xl shadow-lg hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm opacity-90">Sudah Bayar</h3>
                <p className="text-2xl font-bold mt-1">
                  Rp {sudah.toLocaleString("id-ID")}
                </p>
              </div>
              <i className="ri-checkbox-circle-line text-4xl opacity-80" />
            </div>
          </div>

          {/* BELUM BAYAR */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-5 rounded-xl shadow-lg hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm opacity-90">Belum Bayar</h3>
                <p className="text-2xl font-bold mt-1">
                  Rp {belum.toLocaleString("id-ID")}
                </p>
              </div>
              <i className="ri-time-line text-4xl opacity-80" />
            </div>
          </div>
        </div>
 

        {/* TABEL */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full table-auto text-gray-700">
            <thead className="bg-sky-600 text-white">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-right">Jumlah</th>
                <th className="py-3 px-4 text-left">Jenis Tagihan</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {data.length ? (
                data.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-sky-50"
                      } hover:bg-sky-100`}
                  >
                    <td className="py-3 px-4 text-center">{i + 1}</td>
                    <td className="py-3 px-4">
                      {d.masterdata?.nama || "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {d.masterdata?.email || "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      Rp {Number(d.jumlah).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4">
                      {d.kategoriTagihan?.nama_kategori || "-"}
                    </td>
                    <td
                      className={`py-3 px-4 font-semibold ${d.status === "Sudah Bayar"
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {d.status}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatTanggal(d.tanggal)}
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
      </div>
    </div>
  );
};

export default RekapTagihan;
