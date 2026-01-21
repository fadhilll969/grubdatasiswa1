import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Presensi = () => {
  const [dataOrang, setDataOrang] = useState([]);
  const [dataPresensi, setDataPresensi] = useState([]);
  const [nis, setNis] = useState("");
  const [orangDitemukan, setOrangDitemukan] = useState(null);
  const [pilihan, setPilihan] = useState("");
  const [keteranganIzin, setKeteranganIzin] = useState("");
  const [sudahProses, setSudahProses] = useState(false);

  const API_PRESENSI = "http://localhost:5000/presensi";
  const API_DOSS = "http://localhost:5000/doss";
  const tanggalHariIni = new Date().toISOString().split("T")[0];

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const getJamNow = () =>
    new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  // ================= FETCH MASTER =================
  useEffect(() => {
    axios
      .get(API_DOSS)
      .then((res) =>
        setDataOrang(
          res.data
            .filter((x) => ["Siswa", "Guru", "Karyawan"].includes(x.kategori))
            .map((s) => ({ nis: s.nomor, nama: s.nama, kategori: s.kategori }))
        )
      )
      .catch(() => Swal.fire("Error", "Gagal memuat data master", "error"));
  }, []);

  const fetchPresensi = async () => {
    const res = await axios.get(API_PRESENSI);
    setDataPresensi(res.data);
  };

  useEffect(() => {
    fetchPresensi();
  }, []);

  // ================= HANDLER =================
  const handleNisChange = (e) => {
    const value = e.target.value.trim();
    setNis(value);
    const orang = dataOrang.find((o) => o.nis === value) || null;
    setOrangDitemukan(orang);
    setSudahProses(false);
  };

  const resetSemua = () => {
    setNis("");
    setOrangDitemukan(null);
    setPilihan("");
    setKeteranganIzin("");
    setSudahProses(false);
  };

  const presensiHariIni = orangDitemukan
    ? dataPresensi.find((d) => d.nis === orangDitemukan.nis && d.tanggal === tanggalHariIni)
    : null;

  const validasiJamMasuk = () => new Date().getHours() >= 6;
  const validasiJamPulang = () => new Date().getHours() >= 12;

  // ================= PROSES HADIR =================
  const prosesMasukPulang = async () => {
    if (!orangDitemukan) return;

    // ❌ BLOK JIKA SUDAH IZIN
    if (presensiHariIni && presensiHariIni.kehadiran === "IZIN") {
      await delay(400);
      return Swal.fire({
        icon: "warning",
        title: "Tidak bisa absen",
        text: "Anda sudah izin hari ini",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    if (!presensiHariIni) {
      if (!validasiJamMasuk())
        return Swal.fire("Belum waktunya absen masuk", "", "warning");

      await axios.post(API_PRESENSI, {
        nis: orangDitemukan.nis,
        nama: orangDitemukan.nama,
        tanggal: tanggalHariIni,
        jamMasuk: getJamNow(),
        jamPulang: "",
        kehadiran: "HADIR",
        keterangan: "",
      });

      await delay(600);
      Swal.fire({ icon: "success", title: "Absen Masuk Berhasil", timer: 1500, showConfirmButton: false });
    } else if (!presensiHariIni.jamPulang) {
      if (!validasiJamPulang())
        return Swal.fire("Belum waktunya absen pulang", "", "warning");

      await axios.put(`${API_PRESENSI}/${presensiHariIni.id}`, {
        ...presensiHariIni,
        jamPulang: getJamNow(),
      });

      await delay(600);
      Swal.fire({ icon: "success", title: "Absen Pulang Berhasil", timer: 1500, showConfirmButton: false });
    } else {
      return Swal.fire("Sudah absen hari ini", "", "info");
    }

    await fetchPresensi();
    await delay(1600);
    resetSemua();
  };

  // ================= PROSES IZIN =================
  const prosesIzin = async () => {
    // ❌ BLOK HADIR → TIDAK BOLEH IZIN
    if (presensiHariIni && presensiHariIni.kehadiran === "HADIR") {
      await delay(400);
      return Swal.fire({
        icon: "warning",
        title: "Tidak bisa izin",
        text: "Anda sudah absen masuk hari ini",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    if (!keteranganIzin.trim())
      return Swal.fire("Keterangan wajib diisi", "", "warning");

    if (presensiHariIni)
      return Swal.fire("Sudah absen hari ini", "", "warning");

    await axios.post(API_PRESENSI, {
      nis: orangDitemukan.nis,
      nama: orangDitemukan.nama,
      tanggal: tanggalHariIni,
      jamMasuk: "",
      jamPulang: "",
      kehadiran: "IZIN",
      keterangan: keteranganIzin,
    });

    await delay(600);
    Swal.fire({ icon: "success", title: "Izin Berhasil", timer: 1500, showConfirmButton: false });

    await fetchPresensi();
    await delay(1600);
    resetSemua();
  };

  // ================= AUTO SUBMIT =================
  useEffect(() => {
    if (!orangDitemukan || !pilihan || sudahProses) return;

    // ❌ BLOK IZIN jika sudah HADIR
    if (pilihan === "IZIN" && presensiHariIni && presensiHariIni.kehadiran === "HADIR") {
      setSudahProses(true);
      Swal.fire({
        icon: "warning",
        title: "Tidak bisa izin",
        text: "Anda sudah absen masuk hari ini",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    // ❌ BLOK HADIR jika sudah IZIN
    if (pilihan === "HADIR" && presensiHariIni && presensiHariIni.kehadiran === "IZIN") {
      setSudahProses(true);
      Swal.fire({
        icon: "warning",
        title: "Tidak bisa absen",
        text: "Anda sudah izin hari ini",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setSudahProses(true);

    if (pilihan === "HADIR") prosesMasukPulang();
    if (pilihan === "IZIN" && keteranganIzin.trim()) prosesIzin();
  }, [orangDitemukan, pilihan, keteranganIzin]);

  // ================= UI =================
  return (
    <div className="min-h-screen bg-sky-200 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center">Presensi</h1>

        <div className="flex gap-3 justify-center mt-4">
          {["HADIR", "IZIN"].map((p) => (
            <button
              key={p}
              onClick={() => setPilihan(p)}
              className={`px-4 py-2 rounded-lg text-white font-bold ${p === "HADIR" ? "bg-green-600" : "bg-yellow-500"}`}
            >
              {p}
            </button>
          ))}
        </div>

        {pilihan && (
          <>
            <input
              className="w-full border p-3 rounded-lg mt-4"
              placeholder="Scan / Masukkan Nomor"
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
          </>
        )}
      </div>
    </div>
  );
};

export default Presensi;
