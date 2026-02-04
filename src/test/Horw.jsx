import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "./Dasbor";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../config/api";

/* ================= API ================= */
const MASTERDATA_URL = `${BASE_URL}/masterdata`;
const TAGIHAN_URL = `${BASE_URL}/tagihan`;

/* ================= STYLE CONFIG ================= */
const masterCardStyle = {
  Total: {
    border: "border-sky-600",
    text: "text-sky-600",
    bg: "bg-sky-50",
    icon: "ri-database-2-line",
  },
  Siswa: {
    border: "border-blue-600",
    text: "text-blue-600",
    bg: "bg-blue-50",
    icon: "ri-graduation-cap-line",
  },
  Guru: {
    border: "border-green-600",
    text: "text-green-600",
    bg: "bg-green-50",
    icon: "ri-book-2-line",
  },
  Karyawan: {
    border: "border-yellow-600",
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    icon: "ri-briefcase-3-line",
  },
};

const tagihanCardStyle = {
  total: {
    border: "border-indigo-600",
    text: "text-indigo-600",
    bg: "bg-indigo-50",
    icon: "📊",
  },
  paid: {
    border: "border-green-600",
    text: "text-green-600",
    bg: "bg-green-50",
    icon: "✅",
  },
  unpaid: {
    border: "border-red-600",
    text: "text-red-600",
    bg: "bg-red-50",
    icon: "❌",
  },
};

/* ================= COMPONENT ================= */
const Horw = () => {
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [dataTagihan, setDataTagihan] = useState([]);

  const [jumlah, setJumlah] = useState({
    total: 0,
    siswa: 0,
    guru: 0,
    karyawan: 0,
  });

  const [summary, setSummary] = useState({
    totalCount: 0,
    totalAmount: 0,
    sudahBayarCount: 0,
    sudahBayarAmount: 0,
    belumBayarCount: 0,
    belumBayarAmount: 0,
  });

  /* ================= UTIL ================= */
  const formatRupiah = (num) =>
    "Rp " + Number(num || 0).toLocaleString("id-ID");

  const formatTanggal = (tgl) =>
    tgl ? new Date(tgl).toLocaleDateString("id-ID") : "-";

  /* ================= FETCH ================= */
  const fetchMasterdata = async () => {
    try {
      const res = await axios.get(MASTERDATA_URL);
      const data = Array.isArray(res.data) ? res.data : [];

      setJumlah({
        total: data.length,
        siswa: data.filter(d => d.kategori?.kategori_nama === "Siswa").length,
        guru: data.filter(d => d.kategori?.kategori_nama === "Guru").length,
        karyawan: data.filter(d => d.kategori?.kategori_nama === "Karyawan").length,
      });

      // ✅ jangan mutasi data asli
      setDataList([...data].reverse());
    } catch (err) {
      Swal.fire("Error", "Gagal memuat masterdata", "error");
    }
  };


  const fetchRekapTagihan = async () => {
    try {
      const res = await axios.get(TAGIHAN_URL);
      const data = res.data || [];

      const totalAmount = data.reduce((s, d) => s + Number(d.jumlah || 0), 0);
      const sudahBayar = data.filter((d) => d.status === "Sudah Bayar");
      const sudahBayarAmount = sudahBayar.reduce(
        (s, d) => s + Number(d.jumlah || 0),
        0
      );

      setSummary({
        totalCount: data.length,
        totalAmount,
        sudahBayarCount: sudahBayar.length,
        sudahBayarAmount,
        belumBayarCount: data.length - sudahBayar.length,
        belumBayarAmount: totalAmount - sudahBayarAmount,
      });

      setDataTagihan(data.reverse());
    } catch {
      Swal.fire("Error", "Gagal memuat tagihan", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterdata();
    fetchRekapTagihan();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-100 to-sky-200">
      <Dasbor />

      <div className="flex-1 p-8">
        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
          <i className="ri-dashboard-line text-sky-600 text-4xl"></i>
          Dashboard Sekolah
        </h1>

        {/* MASTERDATA SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            ["Total", jumlah.total],
            ["Siswa", jumlah.siswa],
            ["Guru", jumlah.guru],
            ["Karyawan", jumlah.karyawan],
          ].map(([label, value]) => {
            const style = masterCardStyle[label];
            return (
              <div
                key={label}
                className={`relative overflow-hidden bg-white rounded-xl border-t-4 ${style.border}
                shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-6 text-center`}
              >
                <div className={`absolute inset-0 ${style.bg} opacity-40`} />
                <div className="relative">
                  <i className={`${style.icon} text-4xl ${style.text}`}></i>
                  <h3 className="text-xl font-semibold mt-2">{label}</h3>
                  <p className="text-4xl font-bold">{value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* RINGKASAN TAGIHAN */}
        <h2 className="text-3xl font-bold mb-6">Ringkasan Tagihan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              key: "total",
              label: "Total Tagihan",
              count: summary.totalCount,
              amount: summary.totalAmount,
            },
            {
              key: "paid",
              label: "Sudah Bayar",
              count: summary.sudahBayarCount,
              amount: summary.sudahBayarAmount,
            },
            {
              key: "unpaid",
              label: "Belum Bayar",
              count: summary.belumBayarCount,
              amount: summary.belumBayarAmount,
            },
          ].map(({ key, label, count, amount }) => {
            const style = tagihanCardStyle[key];
            return (
              <div
                key={label}
                className={`relative overflow-hidden bg-white rounded-xl border-t-4 ${style.border}
                shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-6`}
              >
                <div className={`absolute inset-0 ${style.bg} opacity-40`} />
                <div className="relative">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-semibold">{label}</h3>
                    <span className="text-3xl">{style.icon}</span>
                  </div>
                  <p className={`text-3xl font-bold ${style.text}`}>
                    {count} Data
                  </p>
                  <p className="mt-2 text-lg font-semibold text-gray-700">
                    {formatRupiah(amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* TABEL MASTERDATA */}
        <h2 className="text-3xl font-bold mb-4">Masterdata</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow mb-10">
          <table className="w-full table-auto">
            <thead className="bg-sky-600 text-white">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Kelas</th>
                <th className="p-3">Jurusan / Mapel</th>
                <th className="p-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((d, i) => (
                <tr
                  key={d.id}
                  className={`${i % 2 ? "bg-sky-50" : "bg-white"} hover:bg-sky-100 transition`}
                >
                  <td className="p-3 text-center">{i + 1}</td>
                  <td className="p-3">{d.kategori?.kategori_nama || "-"}</td>
                  <td className="p-3">{d.nama}</td>
                  <td className="p-3">{d.kelas?.kelas || "-"}</td>
                  <td className="p-3 text-center">
                    {d.kategori?.kategori_nama === "Siswa" ? (
                      d.kelas ? d.kelas.jurusan : "-"
                    ) : d.kategori?.kategori_nama === "Guru" ? (
                      d.mapel || "-"
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 text-right">{d.email || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TABEL TAGIHAN */}
        <h2 className="text-3xl font-bold mb-4">Daftar Tagihan</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full table-auto">
            <thead className="bg-sky-600 text-white">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Email</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Jenis</th>
                <th className="p-3">Status</th>
                <th className="p-3">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {dataTagihan.map((t, i) => (
                <tr
                  key={t.id}
                  className={`${i % 2 ? "bg-sky-50" : "bg-white"} hover:bg-sky-100 transition`}
                >
                  <td className="p-3 text-center">{i + 1}</td>
                  <td className="p-3">{t.masterdata?.nama || "-"}</td>
                  <td className="p-3 text-right">{t.masterdata?.email || "-"}</td>
                  <td className="p-3 text-right">{formatRupiah(t.jumlah)}</td>
                  <td className="p-3 text-center">{t.kategoriTagihan?.nama_kategori || "-"}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${t.status === "Sudah Bayar"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">{formatTanggal(t.tanggal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Horw;
