import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "./Dasbor";

const API_URL = "http://localhost:5000/clok";

const Dataktegori = () => {
    const navigate = useNavigate();
    const [kategoriList, setKategoriList] = useState([]);

    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const res = await axios.get(API_URL);
                const data = res.data.map((item) => ({
                    ...item,
                    aktif: item.aktif !== undefined ? item.aktif : false,
                }));
                setKategoriList(data);
            } catch (error) {
                console.error("Gagal mengambil kategori:", error);
            }
        };
        fetchKategori();
    }, []);

    const handleToggleAktif = async (kategori) => {
        try {
            const updatedStatus = !kategori.aktif;
            await axios.put(`${API_URL}/${kategori.id}`, {
                ...kategori,
                aktif: updatedStatus,
            });

            setKategoriList((prev) =>
                prev.map((item) =>
                    item.id === kategori.id ? { ...item, aktif: updatedStatus } : item
                )
            );
        } catch (error) {
            console.error("Gagal mengubah status aktif:", error);
        }
    };


    const handleDelete = (id) => {
        Swal.fire({
            title: "Yakin ingin menghapus data ini?",
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${API_URL}/${id}`)
                    .then(() => {
                        setKategoriList((prev) => prev.filter((item) => item.id !== id));
                        Swal.fire({
                            icon: "success",
                            title: "Data Terhapus!",
                            text: "Data berhasil dihapus.",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: "error",
                            title: "Gagal!",
                            text: "Gagal menghapus data dari server.",
                        });
                    });
            }
        });
    };

    return (
        <div className="min-h-screen bg-sky-200 flex">
            <Dasbor />
            <div className="flex-1 p-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-sky-700 py-4 px-6 flex items-center justify-center gap-2">
                        <i className="ri-database-2-line text-white text-2xl"></i>
                        <h3 className="text-2xl font-semibold text-white">Kategori Data</h3>
                    </div>

                    <div className="flex justify-end p-4">
                        <button
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                            onClick={() => navigate("/tambah")}
                        >
                            <i className="ri-add-circle-line text-lg"></i> Tambah Kategori
                        </button>
                    </div>
                </div>
                <div className="mt-6 overflow-x-auto">
                    <h1 className="text-2xl mb-3">Daftar Kategori Data</h1>
                    <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden shadow-md">
                        <thead className="bg-sky-600 text-center text-white">
                            <tr>
                                <th className="py-3 px-4">No</th>
                                <th className="py-3 px-4">Nama Kategori</th>
                                <th className="py-3 px-4">Aktif</th>
                                <th className="py-3 px-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {kategoriList.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-4 text-gray-500">
                                        Tidak ada data
                                    </td>
                                </tr>
                            ) : (
                                kategoriList.map((item, index) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="py-3 px-4">{index + 1}</td>
                                        <td className="py-3 px-4">{item.kategori_nama || "-"}</td>
                                        <td className="py-3 px-4">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={item.aktif}
                                                    onChange={() => handleToggleAktif(item)}
                                                    className="sr-only peer"
                                                />
                                                <div
                                                    className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-emerald-500
                                     after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                     after:bg-white after:rounded-full after:h-5 after:w-5
                                     after:transition-all peer-checked:after:translate-x-full relative"
                                                ></div>
                                            </label>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    className="bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600 transition flex items-center gap-1"
                                                    onClick={() => navigate(`/editclok/${item.id}`)}
                                                >
                                                    <i className="ri-edit-2-line text-sm"></i> Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition flex items-center gap-1"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <i className="ri-delete-bin-6-line text-sm"></i> Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default Dataktegori;
