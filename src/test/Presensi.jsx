import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Presensi = () => {
  const navigate = useNavigate();

  const [dataOrang, setDataOrang] = useState([]);
  const [dataPresensi, setDataPresensi] = useState([]);
  const [nis, setNis] = useState("");
  const [orangDitemukan, setOrangDitemukan] = useState(null);
  const [pilihan, setPilihan] = useState("");
  const [keteranganIzin, setKeteranganIzin] = useState("");

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

  useEffect(() => {
    const fetchPresensi = async () => {
      try {
        const res = await axios.get(API_PRESENSI);
        setDataPresensi(res.data);
      } catch (error) {
        console.error("Error data presensi:", error);
      }
    };
    fetchPresensi();
  }, []);

  const getJamNow = () =>
    new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const resetSemua = () => {
    setNis("");
    setOrangDitemukan(null);
    setPilihan("");
    setKeteranganIzin("");
  };

  const handleNisChange = async (e) => {
    const value = e.target.value;
    setNis(value);

    const orang = dataOrang.find((o) => o.nis === value);
    setOrangDitemukan(orang || null);

    if (!orang) return;

    const tanggal = new Date().toISOString().split("T")[0];
    const presensiHariIni = dataPresensi.find(
      (d) => d.nis === orang.nis && d.tanggal === tanggal
    );

    // ABSEN PULANG OTOMATIS
    if (presensiHariIni && presensiHariIni.jamMasuk && !presensiHariIni.jamPulang) {
      try {
        await axios.put(`${API_PRESENSI}/${presensiHariIni.id}`, {
          ...presensiHariIni,
          jamPulang: getJamNow(),
        });

        Swal.fire({
          icon: "success",
          title: `${orang.nama} Absen Pulang`,
          timer: 1500,
          showConfirmButton: false,
        });

        resetSemua();
        navigate("/RekapPresensi");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal menyimpan absen pulang",
        });
      }
    }
  };

  const prosesHadir = async () => {
    if (!orangDitemukan) return;

    const tanggal = new Date().toISOString().split("T")[0];
    const presensiHariIni = dataPresensi.find(
      (d) => d.nis === orangDitemukan.nis && d.tanggal === tanggal
    );

    if (presensiHariIni && presensiHariIni.jamMasuk && presensiHariIni.jamPulang) {
      Swal.fire({
        icon: "warning",
        title: "Sudah Absen",
        text: "Anda hanya bisa absen 1x per hari!",
      });
      resetSemua();
      return;
    }

    try {
      if (!presensiHariIni) {
        await axios.post(API_PRESENSI, {
          nis: orangDitemukan.nis,
          nama: orangDitemukan.nama,
          tanggal,
          jamMasuk: getJamNow(),
          jamPulang: "",
          kehadiran: "HADIR",
          keterangan: "",
        });

        Swal.fire({
          icon: "success",
          title: `${orangDitemukan.nama} Absen Masuk`,
          timer: 1500,
          showConfirmButton: false,
        });
      }

      resetSemua();
      navigate("/RekapPresensi");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan presensi",
      });
    }
  };

  const prosesIzin = async () => {
    if (!orangDitemukan) return;

    if (!keteranganIzin.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Keterangan wajib diisi!",
      });
      return;
    }

    const tanggal = new Date().toISOString().split("T")[0];
    const presensiHariIni = dataPresensi.find(
      (d) => d.nis === orangDitemukan.nis && d.tanggal === tanggal
    );

    if (presensiHariIni) {
      Swal.fire({
        icon: "warning",
        title: "Sudah Absen",
        text: "Anda hanya bisa absen 1x per hari!",
      });
      resetSemua();
      return;
    }

    try {
      await axios.post(API_PRESENSI, {
        nis: orangDitemukan.nis,
        nama: orangDitemukan.nama,
        tanggal,
        jamMasuk: "",
        jamPulang: "",
        kehadiran: "IZIN",
        keterangan: keteranganIzin,
      });

      Swal.fire({
        icon: "info",
        title: `${orangDitemukan.nama} Izin`,
        timer: 1500,
        showConfirmButton: false,
      });

      resetSemua();
      navigate("/RekapPresensi");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan izin",
      });
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <div className="flex-1 p-6">
        <div className="bg-white p-6 shadow-lg rounded-xl mb-10 max-w-xl mt-20 mx-auto">

          <label className="font-bold text-2xl text-gray-700 mb-1 block">
            Presensi
          </label>

          {/* PILIH OPSI */}
          <div className="mt-5 flex gap-4 justify-center">
            <button
              onClick={() => setPilihan("HADIR")}
              className={`px-5 py-2 rounded-lg font-bold ${pilihan === "HADIR" ? "bg-sky-600 text-white" : "bg-sky-300"
                }`}
            >
              Hadir
            </button>
            <button
              onClick={() => setPilihan("IZIN")}
              className={`px-5 py-2 rounded-lg font-bold ${pilihan === "IZIN" ? "bg-yellow-600 text-white" : "bg-yellow-300"
                }`}
            >
              Izin
            </button>
          </div>

          {/* INPUT NIS & CARD ORANG */}
          {pilihan && (
            <div className="mt-5">
              <input
                type="text"
                value={nis}
                onChange={handleNisChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-400 text-xl text-center"
                placeholder="Masukkan Nomor Unik"
                autoFocus
              />

              {/* CARD DATA ORANG */}
              {orangDitemukan && (
                <div className="mt-4 bg-gray-100 border rounded-lg p-4 shadow">
                  <h3 className="text-xl font-bold mb-1">{orangDitemukan.nama}</h3>
                  <p className="text-gray-700">Nomor Unik : {orangDitemukan.nis}</p>
                  <p className="text-gray-700">Kategori : {orangDitemukan.kategori}</p>
                </div>
              )}

              {/* KETERANGAN IZIN */}
              {pilihan === "IZIN" && orangDitemukan && (
                <textarea
                  value={keteranganIzin}
                  onChange={(e) => setKeteranganIzin(e.target.value)}
                  placeholder="Masukkan keterangan izin..."
                  className="w-full mt-4 border border-gray-400 p-3 rounded-lg h-24"
                ></textarea>
              )}

              {/* TOMBOL KONFIRMASI */}
              {orangDitemukan && pilihan === "HADIR" && (
                <button
                  onClick={prosesHadir}
                  className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
                >
                  Konfirmasi Hadir
                </button>
              )}

              {orangDitemukan && pilihan === "IZIN" && (
                <button
                  onClick={prosesIzin}
                  className="mt-5 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg"
                >
                  Konfirmasi Izin
                </button>
              )}
            </div>
          )}

        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/w")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-lg transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default Presensi;
