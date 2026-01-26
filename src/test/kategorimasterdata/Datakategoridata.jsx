import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../../config/api";

const API_URL = `${BASE_URL}/kategoridata`;

const Datakategoridata = () => {
    const navigate = useNavigate();
    const [kategoriList, setKategoriList] = useState([]);

    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const res = await axios.get(API_URL);
                const data = res.data.map(item => ({
                    ...item,
                    aktif: item.aktif ?? false
                }));
                setKategoriList(data);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: "Gagal mengambil data dari server"
                });
            }
        };
        fetchKategori();
    }, []);

    const handleToggleAktif = async (kategori) => {
        const updatedStatus = !kategori.aktif;
        setKategoriList(prev =>
            prev.map(item =>
                item.id === kategori.id
                    ? { ...item, aktif: updatedStatus }
                    : item
            )
        );
        try {
            await axios.put(`${API_URL}/${kategori.id}`, {
                ...kategori,
                aktif: updatedStatus
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Tidak bisa mengubah status"
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Yakin ingin menghapus data ini?",
            text: "Data tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonText: "Batal",
            confirmButtonText: "Hapus"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setKategoriList(prev => prev.filter(item => item.id !== id));
                Swal.fire({
                    icon: "success",
                    title: "Terhapus",
                    timer: 1200,
                    showConfirmButton: false
                });
            } catch {
                Swal.fire("Error", "Gagal menghapus data", "error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-sky-200 flex">
            <Dasbor />

            <div className="flex-1 p-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-sky-700 py-4 px-6 flex items-center justify-center gap-2">
                        <i className="ri-database-2-line text-white text-2xl"></i>
                        <h3 className="text-2xl font-semibold text-white">
                            Kategori Data
                        </h3>
                    </div>

                    <div className="flex justify-end p-4">
                        <button
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            onClick={() => navigate("/kategoridata/tambah-data")}
                        >
                            <i className="ri-add-circle-line"></i>
                            Tambah Kategori
                        </button>
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-3 mt-10">
                    Daftar Kategori Data
                </h1>

                <div className="rounded-xl mt-6 overflow-x-auto shadow-md bg-white">
                    <table className="min-w-full border-separate border-spacing-0 text-center">
                        <thead className="bg-sky-700 text-white">
                            <tr>
                                <th className="py-3 px-4">No</th>
                                <th className="py-3 text-left px-4">Nama Kategori</th>
                                <th className="py-3 px-4">Aktif</th>
                                <th className="py-3 px-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
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
                                        <td className="py-3 text-left px-4">
                                            {item.kategori_nama}
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="checkbox"
                                                checked={item.aktif}
                                                onChange={() => handleToggleAktif(item)}
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    className="bg-sky-500 text-white px-3 py-1 rounded-lg"
                                                    onClick={() =>
                                                        navigate(`/kategoridata/edit-data/${item.id}`)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Hapus
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

export default Datakategoridata;
