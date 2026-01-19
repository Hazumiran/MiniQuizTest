/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchAPI } from "../api";
import LoadingAnimation from "../components/LoadingAnimation";
import toast from "react-hot-toast";

interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAPI("/auth/profile");
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      const data: Profile = res.data;
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!name || !email) {
      toast.error("Nama dan email tidak boleh kosong");
      return;
    }
    setIsSubmittingProfile(true);
    try {
      const res = await fetchAPI("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ name, email }),
      });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Profil berhasil diperbarui!");
    //   loadProfile();
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Silakan lengkapi isian password lama dan baru");
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await fetchAPI("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Password berhasil diubah!");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Informasi Dasar</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            disabled={isSubmittingProfile}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmittingProfile ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Ubah Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password Lama</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
          <button
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isChangingPassword ? "Mengubah..." : "Ganti Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
