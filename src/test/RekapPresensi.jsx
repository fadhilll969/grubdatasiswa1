import React from 'react'
import Dasbor from './Dasbor'
import { useState, useEffect } from "react";
import axios from "axios";

const RekapPresensi = () => {
    const [dataOrang, setDataOrang] = useState([]);
    const [dataPresensi, setDataPresensi] = useState([]);

    const API_PRESENSI = "http://localhost:5000/presensi";
    const API_DOSS = "http://localhost:5000/doss";

    useEffect(() => {
        const fetchOrang = async () => {
            try {
                const res = await axios.get(API_DOSS);
                const semuaKategori = ["Siswa", "Guru", "Karyawan"];
                const daftarOrang = res.data
                    .filter((x) => semuaKategori.includes(x.kategori))
                    .map((s) => ({ nis: s.nomor, nama: s.nama, kategori: s.kategori }));
                setDataOrang(daftarOrang);
            } catch (error) {
                console.error("Error data orang:", error);
            }
        };
        fetchOrang();
    }, []);

    const fetchPresensi = async () => {
        try {
            const res = await axios.get(API_PRESENSI);
            setDataPresensi(res.data);
        } catch (error) {
            console.error("Error data presensi:", error);
        }
    };

    useEffect(() => {
        fetchPresensi();
    }, []);

    const formatTanggal = (tgl) => {
        const [year, month, day] = tgl.split("-");
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="min-h-screen bg-sky-200">
            <div className="flex flex-col md:flex-row">

                <Dasbor />

                <div className="flex-1 p-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4">Rekap Presensi</h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden shadow-md mt-10">
                                <thead>
                                    <tr className="bg-sky-600 text-left text-white">
                                        <th className="px-4 py-2">No</th>
                                        <th className="px-4 py-2">Nama</th>
                                        <th className="px-4 py-2">Nomor Unik</th>
                                        <th className="px-4 py-2">Keterangan</th>
                                        <th className="px-4 py-2">Alasan</th>  {/* 🔥 Kolom baru */}
                                        <th className="px-4 py-2">Jam Masuk</th>
                                        <th className="px-4 py-2">Jam Pulang</th>
                                        <th className="px-4 py-2">Tanggal</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {dataPresensi.map((item, i) => (
                                        <tr key={i} className="hover:bg-sky-100">
                                            <td className="px-4 py-2 text-center">{i + 1}</td>
                                            <td className="px-4 py-2">{item.nama}</td>
                                            <td className="px-4 py-2">{item.nis}</td>

                                            <td
                                                className={`px-4 py-2 font-bold ${item.kehadiran === "HADIR"
                                                    ? "text-green-600"
                                                    : item.kehadiran === "IZIN"
                                                        ? "text-yellow-600"
                                                        : "text-gray-600"
                                                    }`}
                                            >
                                                {item.kehadiran}
                                            </td>

                                            {/* 🔥 Kolom ALASAN */}
                                            <td className="px-4 py-2">
                                                {item.keterangan ? item.keterangan : "-"}
                                            </td>

                                            <td className="px-4 py-2">{item.jamMasuk || "-"}</td>
                                            <td className="px-4 py-2">{item.jamPulang || "-"}</td>
                                            <td className="px-4 py-2 text-right">{formatTanggal(item.tanggal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default RekapPresensi;
