import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../../config/api";

const Tambahdatakelas = () => {
  const navigate = useNavigate();

  const API_URL_DATA = `${BASE_URL}/masterdata`;
  const API_URL_KATEGORI = `${BASE_URL}/kategoridata`;
  const API_URL_KELAS = `${BASE_URL}/kelas`;

  const [kategoriList, setKategoriList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [jurusanOptions, setJurusanOptions] = useState([]);

  const [listNomor, setListNomor] = useState([]);
  const [nomorDipakai, setNomorDipakai] = useState(false);

  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");

  const [mapel, setMapel] = useState("");
  const [nama, setNama] = useState("");
  const [nomor, setNomor] = useState("");
  const [email, setEmail] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resKat, resKls, resMaster] = await Promise.all([
          axios.get(API_URL_KATEGORI),
          axios.get(API_URL_KELAS),
          axios.get(API_URL_DATA),
        ]);

        setKategoriList(resKat.data);
        setKelasList(resKls.data);

        setListNomor(
          resMaster.data
            .filter(d => d.nomor !== null)
            .map(d => String(d.nomor))
        );
      } catch (err) {
        Swal.fire({ icon: "error", title: "Gagal ambil data" });
      }
    };

    fetchData();
  }, []);

  /* ================= UPDATE JURUSAN ================= */
  useEffect(() => {
    if (selectedKelas) {
      const jurusan = kelasList
        .filter(k => k.kelas === selectedKelas)
        .map(k => k.jurusan);
      setJurusanOptions(jurusan);
      setSelectedJurusan("");
    } else {
      setJurusanOptions([]);
      setSelectedJurusan("");
    }
  }, [selectedKelas, kelasList]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (nomorDipakai) {
      Swal.fire({
        icon: "error",
        title: "Nomor sudah digunakan",
        text: "Gunakan nomor lain",
      });
      return;
    }

    if (!nama || !nomor || !email || !selectedKategori) {
      Swal.fire({ icon: "warning", title: "Data belum lengkap!" });
      return;
    }

    if (selectedKategori === "Siswa" && (!selectedKelas || !selectedJurusan)) {
      Swal.fire({ icon: "warning", title: "Kelas & Jurusan wajib diisi!" });
      return;
    }

    if (selectedKategori === "Guru" && !mapel) {
      Swal.fire({ icon: "warning", title: "Mapel wajib diisi!" });
      return;
    }

    const kategoriObj = kategoriList.find(
      k => k.kategori_nama === selectedKategori
    );

    const kelasObj = kelasList.find(
      k => k.kelas === selectedKelas && k.jurusan === selectedJurusan
    );

    const newData = {
      nama,
      nomor,
      email,
      kategori: kategoriObj ? { id: kategoriObj.id } : null,
      ...(selectedKategori === "Siswa" && kelasObj && { kelas: { id: kelasObj.id } }),
      ...(selectedKategori === "Guru" && { mapel }),
    };

    try {
      const confirm = await Swal.fire({
        title: "Simpan data?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Batal",
      });

      if (confirm.isConfirmed) {
        await axios.post(API_URL_DATA, newData);
        Swal.fire({
          icon: "success",
          title: "Data berhasil ditambahkan!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/h");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Gagal menyimpan data!" });
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52">
          <h2 className="text-2xl font-bold text-center mb-6 text-sky-700">
            Tambah Data
          </h2>

          {/* KATEGORI */}
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
              {kategoriList.map(k => (
                <option key={k.id} value={k.kategori_nama}>
                  {k.kategori_nama}
                </option>
              ))}
            </select>
          </div>

          {/* SISWA */}
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
                  {[...new Set(kelasList.map(k => k.kelas))].map(kls => (
                    <option key={kls} value={kls}>{kls}</option>
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
                  {jurusanOptions.map((j, i) => (
                    <option key={i} value={j}>{j}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* GURU */}
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

          <div className="mb-3">
            <label className="font-semibold block mb-1">Nomor Unik</label>
            <input
              type="text"
              value={nomor}
              onChange={(e) => {
                const val = e.target.value;
                setNomor(val);
                setNomorDipakai(listNomor.includes(val));
              }}
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
              onClick={() => navigate("/h")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              <i className="ri-arrow-left-line"></i> Kembali
            </button>
            <button
              onClick={handleSubmit}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg"
            >
              <i className="ri-save-3-line"></i> Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tambahdatakelas;
