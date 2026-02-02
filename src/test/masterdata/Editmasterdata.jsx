import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../../config/api";

const Editmasterdata = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL_DATA = `${BASE_URL}/masterdata`;
  const API_URL_KATEGORI = `${BASE_URL}/kategoridata`;
  const API_URL_KELAS = `${BASE_URL}/kelas`;

  const [kategoriList, setKategoriList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [jurusanOptions, setJurusanOptions] = useState([]);

  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [mapel, setMapel] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [nomor, setNomor] = useState("");

  // ===== FETCH DATA & OPTIONS =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL_DATA}/${id}`);
        const data = res.data;

        setNama(data.nama || "");
        setEmail(data.email || "");
        setNomor(data.nomor || "");

        // Sesuaikan snake_case sesuai backend
        const kategoriNama = data.kategori?.kategori_nama || "";
        setSelectedKategori(kategoriNama);

        if (kategoriNama === "Siswa") {
          setSelectedKelas(data.kelas?.kelas || "");
          setSelectedJurusan(data.kelas?.jurusan || "");
        }

        if (kategoriNama === "Guru") {
          setMapel(data.mapel || "");
        }
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data", "error");
        console.error("Fetch data error:", err);
      }
    };

    const fetchAux = async () => {
      try {
        const [katRes, klsRes] = await Promise.all([
          axios.get(API_URL_KATEGORI),
          axios.get(API_URL_KELAS),
        ]);
        setKategoriList(katRes.data || []);
        setKelasList(klsRes.data || []);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil kategori / kelas", "error");
        console.error("Fetch kategori/kelas error:", err);
      }
    };

    fetchAux();
    fetchData();
  }, [id]);

  // ===== UPDATE JURUSAN OPTIONS =====
  useEffect(() => {
    if (selectedKelas) {
      const options = kelasList
        .filter((k) => k.kelas === selectedKelas)
        .map((k) => k.jurusan);
      setJurusanOptions(options);
      if (!options.includes(selectedJurusan)) {
        setSelectedJurusan(options[0] || "");
      }
    } else {
      setJurusanOptions([]);
      setSelectedJurusan("");
    }
  }, [selectedKelas, kelasList]);

  // ===== HANDLE UPDATE =====
  const handleUpdate = async () => {
    // VALIDASI FRONTEND
    if (!selectedKategori) {
      return Swal.fire("Error", "Kategori wajib dipilih", "error");
    }

    if (selectedKategori === "Siswa" && (!selectedKelas || !selectedJurusan)) {
      return Swal.fire("Error", "Kelas & Jurusan wajib diisi", "error");
    }

    if (selectedKategori === "Guru" && !mapel.trim()) {
      return Swal.fire("Error", "Mata pelajaran wajib diisi", "error");
    }

    // Payload sesuai backend (snake_case)
    const payload = {
      nama,
      email,
      nomor,
      kategori: {
        kategori_nama: selectedKategori,
      },
      ...(selectedKategori === "Guru" && {
        mapel,
        kelas: null,
      }),
      ...(selectedKategori === "Siswa" && {
        mapel: null,
        kelas: {
          kelas: selectedKelas,
          jurusan: selectedJurusan,
        },
      }),
    };

    console.log("Payload update:", payload); // debug

    const confirm = await Swal.fire({
      title: "Simpan perubahan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(`${API_URL_DATA}/${id}`, payload);
      Swal.fire("Sukses", "Data berhasil diupdate", "success");
      navigate("/h");
    } catch (e) {
      const msg = e.response?.data?.message || "Update gagal (500)";
      Swal.fire("Error", msg, "error");
      console.error("Update error:", e.response || e);
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52">
          <h2 className="text-2xl font-bold text-center mb-6 text-sky-700">
            Edit Data
          </h2>

          <div className="mb-3">
            <label className="font-semibold block mb-1">Nomor</label>
            <input
              value={nomor}
              onChange={(e) => setNomor(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="mb-3">
            <label className="font-semibold block mb-1">Kategori</label>
            <select
              value={selectedKategori}
              onChange={(e) => {
                setSelectedKategori(e.target.value);
                setSelectedKelas("");
                setSelectedJurusan("");
                setMapel("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map((kat) => (
                <option key={kat.id} value={kat.kategori_nama}>
                  {kat.kategori_nama}
                </option>
              ))}
            </select>
          </div>

          {selectedKategori === "Siswa" && (
            <>
              <div className="mb-3">
                <label className="font-semibold block mb-1">Kelas</label>
                <select
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Pilih Kelas</option>
                  {[...new Set(kelasList.map((k) => k.kelas))].map((kls) => (
                    <option key={kls} value={kls}>
                      {kls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="font-semibold block mb-1">Jurusan</label>
                <select
                  value={selectedJurusan}
                  onChange={(e) => setSelectedJurusan(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Pilih Jurusan</option>
                  {jurusanOptions.map((j) => (
                    <option key={j} value={j}>
                      {j.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {selectedKategori === "Guru" && (
            <div className="mb-3">
              <label className="font-semibold block mb-1">Mata Pelajaran</label>
              <input
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="font-semibold block mb-1">Nama</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="font-semibold block mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/h")}
            >
              <i className="ri-arrow-left-line"></i> Kembali
            </button>

            <button
              className="bg-sky-600 text-white px-4 py-2 rounded-lg"
              onClick={handleUpdate}
            >
              <i className="ri-save-3-line"></i> Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editmasterdata;
