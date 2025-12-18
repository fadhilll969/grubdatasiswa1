import React, { useState, useEffect } from "react";
import Dasbor from "./Dasbor";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RekapPresensi = () => {
    const [dataPresensi, setDataPresensi] = useState([]);
    const navigate = useNavigate();

    const API_PRESENSI = "http://localhost:5000/presensi";

    const fetchPresensi = async () => {
        try {
            const res = await axios.get(API_PRESENSI);
            setDataPresensi(res.data);
        } catch (error) {
            console.error("Error fetching presensi:", error);
            Swal.fire("Error", "Gagal mengambil data presensi", "error");
        }
    };

    useEffect(() => {
        fetchPresensi();
    }, []);

    const formatTanggal = (tgl) => {
        const [year, month, day] = tgl.split("-");
        return `${day}/${month}/${year}`;
    };

    const hapusPresensi = async (id) => {
        const result = await Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Data presensi yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_PRESENSI}/${id}`);
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Data presensi berhasil dihapus",
                    timer: 1500,
                    showConfirmButton: false,
                });
                fetchPresensi();
            } catch (error) {
                console.error(error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data", "error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-sky-200">
            <div className="flex flex-col md:flex-row">
                <Dasbor />
                <div className="flex-1 p-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4">Rekap Presensi</h2>

                        <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-6">
                            <table className="min-w-full table-auto text-gray-700">
                                <thead  className="bg-sky-600 text-white">
                                    <tr>
                                        <th className="py-3 px-4 text-right ">No</th>
                                        <th className="py-3 px-4 text-left ">Nama</th>
                                        <th className="py-3 px-4 text-left ">Nomor Unik</th>
                                        <th className="py-3 px-4 text-left ">Kehadiran</th>
                                        <th className="py-3 px-4 text-left ">Keterangan</th>
                                        <th className="py-3 px-4 text-left ">Jam Masuk</th>
                                        <th className="py-3 px-4 text-left ">Jam Pulang</th>
                                        <th className="py-3 px-4 text-left ">Tanggal</th>
                                        <th className="py-3 px-4 text-left ">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataPresensi.map((item, i) => (
                                        <tr key={i} className="hover:bg-sky-100">
                                            <td className="py-3 px-4 text-center">{i + 1}</td>
                                            <td className="py-3 px-4">{item.nama}</td>
                                            <td className="py-3 px-4">{item.nis}</td>
                                            <td
                                                className={`py-3 px-4 font-bold ${item.kehadiran === "HADIR"
                                                    ? "text-green-600"
                                                    : item.kehadiran === "IZIN"
                                                        ? "text-yellow-600"
                                                        : "text-gray-600"
                                                    }`}
                                            >
                                                {item.kehadiran}
                                            </td>
                                            <td className="py-3 px-4">{item.keterangan || "-"}</td>
                                            <td className="py-3 px-4">{item.jamMasuk || "-"}</td>
                                            <td className="py-3 px-4">{item.jamPulang || "-"}</td>
                                            <td className="py-3 px-4 text-right">{formatTanggal(item.tanggal)}</td>
                                            <td className="py-3 px-4 text-left flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/edit-presensi/${item.id}`)}
                                                    className="bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600 flex items-center gap-1"
                                                >
                                                    <i className="ri-edit-2-line"></i> 
                                                </button>
                                                <button
                                                    onClick={() => hapusPresensi(item.id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                                                >
                                                    <i className="ri-delete-bin-line"></i>  
                                                </button>
                                            </td>
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
