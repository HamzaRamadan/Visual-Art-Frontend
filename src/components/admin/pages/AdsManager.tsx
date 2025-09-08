/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { API_BASE } from "../api";
import Layout from "../Layout";
import { useLanguage } from "../../../context/LanguageContext";

interface Ad {
  _id: string;
  images: string[];
}

export default function AdsManager() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ للحذف
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    adId: string;
    image?: string;
    type: "ad" | "image";
  } | null>(null);

  const [notify, setNotify] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotify = (message: string, type: "success" | "error" = "success") => {
    setNotify({ message, type });
    setTimeout(() => setNotify(null), 3000);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch(`${API_BASE}/ads`);
      if (!res.ok) throw new Error("Failed to fetch ads");
      const data = await res.json();
      setAds(data);
    } catch (err) {
      console.error(err);
      setError(isRTL ? "فشل في تحميل الإعلانات" : "Failed to fetch ads");
    }
  };

  // ✅ Upload new ad
  const handleUpload = async () => {
    if (!selectedFiles) return;
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/ads`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      await fetchAds();
      setSelectedFiles(null);
      showNotify(isRTL ? "✅ تم رفع الصور بنجاح" : "✅ Images uploaded successfully");
    } catch (err) {
      console.error(err);
      setError(isRTL ? "فشل في رفع الصور" : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Ad
  const handleDeleteAd = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/ads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setAds((prev) => prev.filter((ad) => ad._id !== id));
      showNotify(isRTL ? "🗑️ تم حذف الإعلان" : "🗑️ Ad deleted successfully");
    } catch (err) {
      console.error(err);
      setError(isRTL ? "فشل في حذف الإعلان" : "Delete failed");
    }
  };

  // ✅ Delete Image only
  const handleDeleteImage = async (adId: string, imagePath: string) => {
    try {
      const res = await fetch(`${API_BASE}/ads/${adId}/image`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePath }),
      });
      if (!res.ok) throw new Error("Delete image failed");

      setAds((prev) =>
        prev.map((ad) =>
          ad._id === adId
            ? { ...ad, images: ad.images.filter((img) => img !== imagePath) }
            : ad
        )
      );
      showNotify(isRTL ? "🗑️ تم حذف الصورة" : "🗑️ Image deleted successfully");
    } catch (err) {
      console.error(err);
      setError(isRTL ? "فشل في حذف الصورة" : "Delete image failed");
    }
  };

  // ✅ Open confirmation
  const confirmDelete = (adId: string, type: "ad" | "image", image?: string) => {
    setDeleteTarget({ adId, type, image });
    setConfirmOpen(true);
  };

  const proceedDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "ad") {
      handleDeleteAd(deleteTarget.adId);
    } else if (deleteTarget.type === "image" && deleteTarget.image) {
      handleDeleteImage(deleteTarget.adId, deleteTarget.image);
    }
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  // ✅ Helper: resolve image path (Cloudinary vs Local)
  const resolveImagePath = (img: string) => {
    if (img.startsWith("http")) {
      return img; // Cloudinary URL
    }
    return `${API_BASE.replace("/api", "")}${img}`; // Local uploads
  };

  return (
    <Layout>
      <div dir={isRTL ? "rtl" : "ltr"} className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {isRTL ? "📢 إدارة الإعلانات" : "📢 Ads Manager"}
        </h1>

        {error && <p className="text-red-500">{error}</p>}

        {/* Upload Form */}
        <div className="mb-6 border p-4 rounded-lg bg-white shadow">
          <input
            type="file"
            multiple
            onChange={(e) => setSelectedFiles(e.target.files)}
            className="mb-2"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            {loading
              ? isRTL
                ? "جاري الرفع..."
                : "Uploading..."
              : isRTL
              ? "📤 رفع الصور"
              : "📤 Upload Images"}
          </button>
        </div>

        {/* Ads List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ads.map((ad) => (
            <div
              key={ad._id}
              className="border rounded-lg shadow bg-white p-4 flex flex-col"
            >
              <div className="grid grid-cols-2 gap-2 mb-4">
                {ad.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={resolveImagePath(img)}
                      alt="Ad"
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      onClick={() => confirmDelete(ad._id, "image", img)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100"
                    >
                      {isRTL ? "حذف" : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => confirmDelete(ad._id, "ad")}
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
              >
                {isRTL ? "🗑️ حذف الإعلان" : "🗑️ Delete Ad"}
              </button>
            </div>
          ))}
        </div>

        {/* Confirmation Popup */}
        {confirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">
                {isRTL ? "تأكيد الحذف" : "Confirm Delete"}
              </h2>
              <p className="mb-4">
                {deleteTarget?.type === "ad"
                  ? isRTL
                    ? "هل أنت متأكد أنك تريد حذف هذا الإعلان؟"
                    : "Are you sure you want to delete this Ad?"
                  : isRTL
                  ? "هل أنت متأكد أنك تريد حذف هذه الصورة؟"
                  : "Are you sure you want to delete this Image?"}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={proceedDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  {isRTL ? "نعم، احذف" : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFY */}
        {notify && (
          <div
            className={`fixed top-5 right-5 z-[9999] px-6 py-3 rounded-xl shadow-lg text-white font-medium transition-all duration-500
              ${notify.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          >
            {notify.message}
          </div>
        )}
      </div>
    </Layout>
  );
}
