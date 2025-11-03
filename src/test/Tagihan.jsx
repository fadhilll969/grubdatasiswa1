import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import axios from "axios";

const Tagihan = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);  
  const [loading, setLoading] = useState(true);

   const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/coco");
      setData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    fetchData();
  }, []);

   const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`http://localhost:5000/coco/${id}`);
        fetchData(); 
      } catch (error) {
        console.error("Gagal menghapus data:", error);
      }
    }
  };

   const getCategoryIcon = (kategori) => {
    switch (kategori) {
      case "tgg":
        return "";
      case "ioioi":
        return "";
      case "uyuy":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-sky-200">
      <div className="flex">
        <Dasbor />
        <div className="flex-1 p-6">
           <button
            className="p-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 w-full md:w-auto flex items-center justify-center gap-2"
            onClick={() => navigate("/t")}
          >
            <i className="ri-add-circle-line text-lg"></i>
            Tambah Data
          </button>

           {loading ? (
            <p className="text-center mt-6">Memuat data...</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden shadow-md">
                <thead className="bg-sky-600 text-center text-white">
                  <tr>
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama</th>
                    <th className="py-3 px-4">Test</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4">Jenis Tagihan</th>
                    <th className="py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-sky-50"
                        } hover:bg-sky-100 transition`}
                      >
                        <td className="py-3 text-center px-4">{index + 1}</td>
                        <td className="py-3 px-4">{item.nama}</td>
                        <td className="py-3 px-4 text-center">{item.testtt}</td>
                        <td className="py-3 px-4 text-right">
                          Rp {item.jumlah.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4 flex items-center gap-2">
                          {getCategoryIcon(item.jenisTagihan)} {item.jenisTagihan}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              className="bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600 transition flex items-center gap-1"
                              onClick={() => navigate(`/edit/${item.id}`)}
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
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-5 text-gray-500 italic"
                      >
                        Tidak ada data.
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

export default Tagihan;
