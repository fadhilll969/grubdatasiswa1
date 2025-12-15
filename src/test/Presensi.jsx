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
          .map((s) => ({
            nis: s.nomor,
            nama: s.nama,
            kategori: s.kategori,
          }));
        setDataOrang(daftarOrang);
      } catch (error) {
        console.error(error);
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
        console.error(error);
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


  const handleNisChange = (e) => {
    const value = e.target.value;
    setNis(value);

    const orang = dataOrang.find((o) => o.nis === value);
    setOrangDitemukan(orang || null);
  };


  const prosesHadir = async () => {
    if (!orangDitemukan) return;

    const tanggal = new Date().toISOString().split("T")[0];
    const presensiHariIni = dataPresensi.find(
      (d) => d.nis === orangDitemukan.nis && d.tanggal === tanggal
    );

    if (presensiHariIni) {
      Swal.fire({
        icon: "warning",
        title: "Sudah Absen Hari Ini",
      });
      resetSemua();
      return;
    }

    try {
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
        title: "Keterangan wajib diisi",
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
        title: "Sudah Absen Hari Ini",
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
        icon: "success",
        title: `${orangDitemukan.nama} Telah Izin`,
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


  const prosesPulang = async () => {
    if (!orangDitemukan) return;

    const tanggal = new Date().toISOString().split("T")[0];
    const presensiHariIni = dataPresensi.find(
      (d) => d.nis === orangDitemukan.nis && d.tanggal === tanggal
    );

    if (!presensiHariIni || !presensiHariIni.jamMasuk) {
      Swal.fire({
        icon: "warning",
        title: "Belum Absen Masuk",
      });
      return;
    }

    if (presensiHariIni.jamPulang) {
      Swal.fire({
        icon: "warning",
        title: "Sudah Absen Pulang",
      });
      resetSemua();
      return;
    }

    try {
      await axios.put(`${API_PRESENSI}/${presensiHariIni.id}`, {
        ...presensiHariIni,
        jamPulang: getJamNow(),
      });

      Swal.fire({
        icon: "success",
        title: `${orangDitemukan.nama} Absen Pulang`,
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
  };


  return (
    <div className="min-h-screen bg-sky-200 flex">
      <div className="flex-1 p-6">
        <div className="bg-white p-6 shadow-lg rounded-xl mb-10 max-w-xl mt-20 mx-auto">
          <label className="font-bold text-2xl text-gray-700 block">
            Presensi
          </label>

          <div className="mt-5 flex gap-4 justify-center">
            <button
              onClick={() => setPilihan("HADIR")}
              className={`px-5 py-2 rounded-lg font-bold ${pilihan === "HADIR"
                ? "bg-sky-600 text-white"
                : "bg-sky-400 hover:bg-sky-600"
                }`}
            >
              Hadir
            </button>
            <button
              onClick={() => setPilihan("PULANG")}
              className={`px-5 py-2 rounded-lg font-bold ${pilihan === "PULANG"
                ? "bg-red-600 text-white"
                : "bg-red-400 hover:bg-red-600"
                }`}
            >
              Pulang
            </button>
            <button
              onClick={() => setPilihan("IZIN")}
              className={`px-5 py-2 rounded-lg font-bold ${pilihan === "IZIN"
                ? "bg-yellow-600 text-white"
                : "bg-yellow-400 hover:bg-yellow-600"
                }`}
            >
              Izin
            </button>
          </div>

          {pilihan && (
            <div className="mt-5">
              <input
                type="text"
                value={nis}
                onChange={handleNisChange}
                className="w-full border p-3 rounded-lg text-xl text-center"
                placeholder="Masukkan Nomor Unik"
                autoFocus
              />

              {orangDitemukan && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold text-xl">
                    {orangDitemukan.nama}
                  </h3>
                  <p>Nomor : {orangDitemukan.nis}</p>
                  <p>Kategori : {orangDitemukan.kategori}</p>
                </div>
              )}

              {pilihan === "IZIN" && orangDitemukan && (
                <textarea
                  className="w-full mt-4 border p-3 rounded-lg"
                  placeholder="Keterangan izin..."
                  value={keteranganIzin}
                  onChange={(e) => setKeteranganIzin(e.target.value)}
                />
              )}

              {orangDitemukan && pilihan === "HADIR" && (
                <button
                  onClick={prosesHadir}
                  className="mt-5 w-full bg-green-600 text-white py-3 rounded-lg font-bold"
                >
                  Konfirmasi Hadir
                </button>
              )}

              {orangDitemukan && pilihan === "IZIN" && (
                <button
                  onClick={prosesIzin}
                  className="mt-5 w-full bg-yellow-600 text-white py-3 rounded-lg font-bold"
                >
                  Konfirmasi Izin
                </button>
              )}

              {orangDitemukan && pilihan === "PULANG" && (
                <button
                  onClick={prosesPulang}
                  className="mt-5 w-full bg-red-600 text-white py-3 rounded-lg font-bold"
                >
                  Konfirmasi Pulang
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/w")}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold"
          >
            <i className="ri-arrow-left-line"></i> Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default Presensi;
