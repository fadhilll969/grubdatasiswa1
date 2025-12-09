import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Presensi = () => {
  const navigate = useNavigate();

  const [dataOrang, setDataOrang] = useState([]);
  const [dataPresensi, setDataPresensi] = useState([]);

  const [nis, setNis] = useState("");

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
        console.error("Gagal mengambil data:", error);
      }
    };
    fetchOrang();
  }, []);

  useEffect(() => {
    const fetchPresensi = async () => {
      try {
        const res = await axios.get(API_PRESENSI);
        setDataPresensi(res.data);
      } catch (error) {
        console.error("Gagal mengambil data presensi:", error);
      }
    };
    fetchPresensi();
  }, []);

   const getJamNow = () =>
    new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

 const tambahPresensiOtomatis = async (value) => {
  const tanggal = new Date().toISOString().split("T")[0];

  const orang = dataOrang.find((o) => o.nis === value);
  if (!orang) return;

  const sudahAda = dataPresensi.find(
    (d) => d.nis === value && d.tanggal === tanggal
  );

  try {
     if (sudahAda && sudahAda.jamMasuk && sudahAda.jamPulang) {
      Swal.fire({
        icon: "warning",
        title: "Sudah Absen Hari Ini",
        text: `${orang.nama} sudah absen masuk & pulang hari ini.`,
      });
      return; // STOP
    }

     if (!sudahAda) {
      await axios.post(API_PRESENSI, {
        nis: orang.nis,
        nama: orang.nama,
        tanggal,
        jamMasuk: getJamNow(),
        jamPulang: "",
      });

      Swal.fire({
        icon: "success",
        title: orang.nama + " Absen Masuk",
        timer: 1400,
        showConfirmButton: false,
      });

      navigate("/RekapPresensi");
      return;
    }

     if (sudahAda && !sudahAda.jamPulang) {
      await axios.put(`${API_PRESENSI}/${sudahAda.id}`, {
        ...sudahAda,
        jamPulang: getJamNow(),
      });

      Swal.fire({
        icon: "success",
        title: orang.nama + " Absen Pulang",
        timer: 1400,
        showConfirmButton: false,
      });

      navigate("/RekapPresensi");
      return;
    }

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Gagal menyimpan presensi",
    });
  }
};
const handleNisChange = (e) => {
  const value = e.target.value;
  setNis(value);

   if (value.length >= 4) {
    tambahPresensiOtomatis(value);
    setNis("");
  }
};

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <div className="flex-1 p-6">
        <div className="bg-white p-6 shadow-lg rounded-xl mb-10 max-w-xl mt-20 mx-auto">

          <label className="font-bold text-2xl text-gray-700 mb-1 block">
            Presensi
          </label>

          <input
            type="text"
            value={nis}
            onChange={handleNisChange}
            className="w-full mt-6 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-400 text-xl text-center"
            placeholder="Masukkan Nomor Unik"
            autoFocus
          />

          <p className="text-center text-gray-600 mt-3">
          
          </p>

        </div>
      </div>
    </div>
  );
};

export default Presensi;
