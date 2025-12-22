import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Dasbor from "./Dasbor";
import "remixicon/fonts/remixicon.css";

const Editjir = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kategoriList, setKategoriList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);

  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");

  const [mapel, setMapel] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [nomor, setNomor] = useState("");

  const API_URL_DATA = "http://localhost:5000/doss";
  const API_URL_KATEGORI = "http://localhost:5000/clok";
  const API_URL_KELAS = "http://localhost:5000/kls";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL_DATA}/${id}`);
        const data = res.data || {};

        setName(data.nama || "");
        setEmail(data.email || "");

        let raw = data.nomor || "";
        raw = raw.replace(/\D/g, "").slice(0, 4);
        setNomor(raw);

        setSelectedKategori(data.kategori || "");

        if (data.kategori === "Siswa") {
          setSelectedKelas(data.kelas || "");
          setSelectedJurusan(data.jurusan || "");
        } else {
          setSelectedKelas("");
          setSelectedJurusan("");
        }

        if (data.kategori === "Guru") {
          setMapel(data.mapel || "");
        } else {
          setMapel("");
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal mengambil data",
          text: "Cek koneksi atau server.",
        });
      }
    };

    const fetchAux = async () => {
      try {
        const [katRes, klsRes] = await Promise.all([
          axios.get(API_URL_KATEGORI),
          axios.get(API_URL_KELAS),
        ]);
        setKategoriList(
          Array.isArray(katRes.data)
            ? katRes.data.filter((kat) => kat.aktif)
            : []
        );
        setKelasList(Array.isArray(klsRes.data) ? klsRes.data : []);
      } catch (err) {
        console.error("Gagal mengambil kategori/kelas:", err);
      }
    };

    fetchAux();
    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedKelas) {
      const jurusanOptions = kelasList
        .filter((k) => k.kelas === selectedKelas)
        .map((k) => k.jurusan)
        .filter(Boolean);

      setJurusanList(jurusanOptions);

      if (!jurusanOptions.includes(selectedJurusan)) {
        setSelectedJurusan(jurusanOptions[0] || "");
      }
    } else {
      setJurusanList([]);
      setSelectedJurusan("");
    }
  }, [selectedKelas, kelasList, selectedJurusan]);

  const handleUpdateData = async () => {
    if (!/^\d{4}$/.test(nomor)) {
      return Swal.fire({
        icon: "warning",
        title: "Nomor Unik Tidak Valid!",
        text: "Nomor unik harus 4 digit angka (contoh: 0001).",
      });
    }

    if (!name || !email || !selectedKategori) {
      return Swal.fire({
        icon: "warning",
        title: "Data tidak lengkap!",
        text: "Nama, Email, dan Kategori harus diisi.",
      });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return Swal.fire({
        icon: "warning",
        title: "Email tidak valid!",
        text: "Masukkan format email yang benar.",
      });
    }

    if (selectedKategori === "Siswa" && (!selectedKelas || !selectedJurusan)) {
      return Swal.fire({
        icon: "warning",
        title: "Data Siswa Kurang!",
        text: "Kelas & Jurusan wajib diisi.",
      });
    }

    const updatedData = {
      nama: name,
      email,
      kategori: selectedKategori,
       nomor: `RFID-${nomor}`,
      ...(selectedKategori === "Siswa" && {
        kelas: selectedKelas,
        jurusan: selectedJurusan,
      }),
      ...(selectedKategori === "Guru" && { mapel }),
    };

    Swal.fire({
      title: "Simpan perubahan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`${API_URL_DATA}/${id}`, updatedData);
          Swal.fire({
            icon: "success",
            title: "Perubahan disimpan!",
            timer: 1500,
            showConfirmButton: false,
          });
          navigate("/h");
        } catch (error) {
          console.error("PUT error:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Tidak dapat menyimpan perubahan.",
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52">
          <h2 className="text-2xl font-bold text-center mb-6 text-sky-700">
            Edit Data
          </h2>

          <div className="mb-2">
            <label className="font-semibold block mb-1">Nomor Unik</label>
            <input
              type="text"
              value={nomor}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length > 4) return;
                setNomor(val);
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="4 digit angka"
            />
           </div>

          <div className="mb-2">
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
              <div className="mb-2">
                <label className="font-semibold block mb-1">Kelas</label>
                <select
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Pilih Kelas</option>
                  {[...new Set(kelasList.map((k) => k.kelas))].map((kelas) => (
                    <option key={kelas} value={kelas}>
                      {kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="font-semibold block mb-1">Jurusan</label>
                <select
                  value={selectedJurusan}
                  onChange={(e) => setSelectedJurusan(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Pilih Jurusan</option>
                  {jurusanList.map((jur) => (
                    <option key={jur} value={jur}>
                      {jur.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {selectedKategori === "Guru" && (
            <div className="mb-2">
              <label className="font-semibold block mb-1">Mata Pelajaran</label>
              <input
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Mata Pelajaran"
              />
            </div>
          )}

          <div className="mb-2">
            <label className="font-semibold block mb-1">Nama</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Nama"
            />
          </div>

          <div className="mb-2">
            <label className="font-semibold block mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Email"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/h")}
            >
              <i className="ri-arrow-left-line"></i> Kembali
            </button>

            <button
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg"
              onClick={handleUpdateData}
            >
              <i className="ri-save-3-line"></i> Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editjir;
