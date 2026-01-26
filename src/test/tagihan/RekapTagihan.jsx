import { useEffect, useState } from "react";
import axios from "axios";
import Dasbor from "../Dasbor";

const API_URL = "http://localhost:8080/api/tagihan";

const RekapTagihan = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(API_URL).then((res) => setData(res.data));
  }, []);

  const total = data.reduce((a, b) => a + Number(b.jumlah || 0), 0);

  const sudahBayar = data.filter((d) => d.status === "Sudah Bayar");
  const sudah = sudahBayar.reduce((a, b) => a + Number(b.jumlah || 0), 0);

  const belum = total - sudah;

  const formatTanggal = (tgl) =>
    tgl ? new Date(tgl).toLocaleDateString("id-ID") : "-";

  return (
    <div className="flex min-h-screen bg-sky-200">
      <Dasbor />

      <div className="flex-1 p-6">
        {/* RINGKASAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Total Tagihan</h3>
            <p className="text-xl font-bold">
              Rp {total.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="bg-green-100 p-4 rounded shadow">
            <h3 className="font-semibold">Sudah Bayar</h3>
            <p className="text-xl font-bold">
              Rp {sudah.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="bg-red-100 p-4 rounded shadow">
            <h3 className="font-semibold">Belum Bayar</h3>
            <p className="text-xl font-bold">
              Rp {belum.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-6">
          <table className="min-w-full table-auto text-gray-700">
            <thead className="bg-sky-600 text-white">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-right">Jumlah</th>
                <th className="py-3 px-4 text-left">Jenis</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {data.length ? (
                data.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-sky-50"
                    } hover:bg-sky-100`}
                  >
                    <td className="py-3 px-4 text-center">{i + 1}</td>
                    <td className="py-3 px-4">{d.nama}</td>
                    <td className="py-3 px-4">{d.email || "-"}</td>
                    <td className="py-3 px-4 text-right">
                      Rp {Number(d.jumlah).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4">{d.jenisTagihan}</td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        d.status === "Sudah Bayar"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {d.status}
                    </td>
                    <td className="py-3 px-4">
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
