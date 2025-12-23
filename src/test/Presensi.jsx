import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Presensi = () => {
  const [dataOrang, setDataOrang] = useState([]);
  const [dataPresensi, setDataPresensi] = useState([]);
  const [nis, setNis] = useState("");
  const [orangDitemukan, setOrangDitemukan] = useState(null);
  const [pilihan, setPilihan] = useState("");
  const [keteranganIzin, setKeteranganIzin] = useState("");

  const API_PRESENSI = "http://localhost:5000/presensi";
  const API_DOSS = "http://localhost:5000/doss";

  const tanggalHariIni = new Date().toISOString().split("T")[0];

  const getJamNow = () =>
    new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });


  useEffect(() => {
    const fetchOrang = async () => {
      try {
        const res = await axios.get(API_DOSS);
        const daftar = res.data
          .filter((x) => ["Siswa", "Guru", "Karyawan"].includes(x.kategori))
          .map((s) => ({
            nis: s.nomor,
            nama: s.nama,
            kategori: s.kategori,
          }));
        setDataOrang(daftar);
      } catch {
        Swal.fire({ icon: "error", title: "Gagal memuat data orang" });
      }
    };
    fetchOrang();
  }, []);

  const fetchPresensi = async () => {
    try {
      const res = await axios.get(API_PRESENSI);
      setDataPresensi(res.data);
    } catch {
      Swal.fire({ icon: "error", title: "Gagal memuat data presensi" });
    }
  };

  useEffect(() => {
    fetchPresensi();
  }, []);

  const resetSemua = () => {
    setNis("");
    setOrangDitemukan(null);
    setPilihan("");
    setKeteranganIzin("");
  };

  const handleNisChange = (e) => {
    const value = e.target.value;
    setNis(value);
    setOrangDitemukan(dataOrang.find((o) => o.nis === value) || null);
  };

  const presensiHariIni = orangDitemukan
    ? dataPresensi.find(
      (d) => d.nis === orangDitemukan.nis && d.tanggal === tanggalHariIni
    )
    : null;

  // Validasi jam masuk
  const validasiJamMasuk = () => {
    const jamSekarang = new Date().getHours();
    return jamSekarang >= 6;
  };

  // Validasi jam pulang
  const validasiJamPulang = () => {
    const jamSekarang = new Date().getHours();
    return jamSekarang >= 12;
  };


  const prosesMasukPulang = async () => {
    if (!orangDitemukan) {
      Swal.fire({ icon: "error", title: "Nomor tidak terdaftar" });
      return;
    }

    if (!presensiHariIni) {
      if (!validasiJamMasuk()) {
        Swal.fire({
          icon: "warning",
          title: "Belum jam absen masuk",
        });
        return;
      }

      try {
        await axios.post(API_PRESENSI, {
          nis: orangDitemukan.nis,
          nama: orangDitemukan.nama,
          tanggal: tanggalHariIni,
          jamMasuk: getJamNow(),
          jamPulang: "",
          kehadiran: "HADIR",
          keterangan: "",
        });
        await fetchPresensi();
        Swal.fire({
          icon: "success",
          title: "Absen Masuk Berhasil",
          timer: 1500,
          showConfirmButton: false,
        });
        resetSemua();
      } catch {
        Swal.fire({ icon: "error", title: "Gagal menyimpan presensi" });
      }
    } else if (!presensiHariIni.jamPulang) {
      if (!validasiJamPulang()) {
        Swal.fire({
          icon: "warning",
          title: "Belum waktunya absen pulang",
        });
        return;
      }

      try {
        await axios.put(`${API_PRESENSI}/${presensiHariIni.id}`, {
          ...presensiHariIni,
          jamPulang: getJamNow(),
        });
        await fetchPresensi();
        Swal.fire({
          icon: "success",
          title: "Absen Pulang Berhasil",
          timer: 1500,
          showConfirmButton: false,
        });
        resetSemua();
      } catch {
        Swal.fire({ icon: "error", title: "Gagal menyimpan absen pulang" });
      }
    } else {
      Swal.fire({ icon: "warning", title: "Sudah absen pulang hari ini" });
    }
  };

  const prosesIzin = async () => {
    if (!orangDitemukan) {
      Swal.fire({ icon: "error", title: "Nomor tidak terdaftar" });
      return;
    }
    if (!keteranganIzin.trim()) {
      Swal.fire({ icon: "warning", title: "Keterangan wajib diisi" });
      return;
    }
    if (presensiHariIni) {
      Swal.fire({ icon: "warning", title: "Sudah absen hari ini" });
      return;
    }

    try {
      await axios.post(API_PRESENSI, {
        nis: orangDitemukan.nis,
        nama: orangDitemukan.nama,
        tanggal: tanggalHariIni,
        jamMasuk: "",
        jamPulang: "",
        kehadiran: "IZIN",
        keterangan: keteranganIzin,
      });
      await fetchPresensi();
      Swal.fire({
        icon: "success",
        title: "Izin Berhasil",
        timer: 1500,
        showConfirmButton: false,
      });
      resetSemua();
    } catch {
      Swal.fire({ icon: "error", title: "Gagal menyimpan izin" });
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center">Presensi</h1>

        <div className="flex gap-3 justify-center mt-4">
          {["HADIR", "IZIN"].map((p) => {
            const warna = {
              HADIR: "bg-green-600 hover:bg-green-700",
              IZIN: "bg-yellow-500 hover:bg-yellow-600",
            };
            const warnaAktif = {
              HADIR: "bg-green-700",
              IZIN: "bg-yellow-600",
            };
            return (
              <button
                key={p}
                onClick={() => setPilihan(p)}
                className={`px-4 py-2 rounded-lg font-bold text-white ${pilihan === p ? warnaAktif[p] : warna[p]
                  }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {pilihan && (
          <>
            <input
              className="w-full border p-3 rounded-lg mt-4"
              placeholder="Masukkan Nomor Unik"
              value={nis}
              onChange={handleNisChange}
              autoFocus
            />

            {orangDitemukan && (
              <div className="mt-3 bg-gray-100 p-3 rounded">
                <b>{orangDitemukan.nama}</b>
                <p>{orangDitemukan.kategori}</p>
              </div>
            )}

            {pilihan === "IZIN" && orangDitemukan && (
              <textarea
                className="w-full mt-3 border p-3 rounded"
                placeholder="Keterangan izin"
                value={keteranganIzin}
                onChange={(e) => setKeteranganIzin(e.target.value)}
              />
            )}

            {orangDitemukan && pilihan === "HADIR" && (
              <button
                onClick={prosesMasukPulang}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mt-4"
              >
                {presensiHariIni
                  ? presensiHariIni.jamPulang
                    ? "Sudah Pulang"
                    : "Konfirmasi Pulang"
                  : "Konfirmasi Masuk"}
              </button>
            )}

            {orangDitemukan && pilihan === "IZIN" && (
              <button
                onClick={prosesIzin}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg mt-4"
              >
                Konfirmasi Izin
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Presensi;
