import { useEffect, useState, useRef } from "react";
import { API_BASE } from "../api";
import Layout from "../Layout";
import { useLanguage } from "../../../context/LanguageContext";

interface MainNewsType {
  _id?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export default function UploadMainNewsAndVideo() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const inputsRef = useRef<HTMLDivElement>(null);

  // ===== Main News State =====
  const [news, setNews] = useState<MainNewsType | null>(null);
  const [newsSaved, setNewsSaved] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsEmpty, setNewsEmpty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ===== Video State =====
  const [video, setVideo] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [showNewsModal, setShowNewsModal] = useState(false);

  // ===== Notification =====
  const [notify, setNotify] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ===== Fetch Main News =====
  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_BASE}/main-news`);
      const data = await res.json();
      if (!data || data.length === 0) {
        setNewsEmpty(true);
        setNews(null);
        setNewsSaved(false);
      } else {
        setNews(data[0]);
        setNewsEmpty(false);
        setNewsSaved(true);
      }
    } catch (err) {
      console.error("❌ Error fetching main news:", err);
      setNewsEmpty(true);
      setNews(null);
      setNewsSaved(false);
    }
  };

  // ===== Fetch Video =====
  const fetchVideo = async () => {
    try {
      const res = await fetch(`${API_BASE}/videos`);
      const data = await res.json();
      setVideo(data.video || null);
    } catch (err) {
      console.error("❌ Error fetching video:", err);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchVideo();
  }, []);

  // ===== Notifications =====
  const showNotify = (message: string, type: "success" | "error" = "success") => {
    setNotify({ message, type });
    setTimeout(() => setNotify(null), 3000);
  };

  // ===== Main News Handlers =====
  const handleNewsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!news) setNews({ titleAr: "", titleEn: "", descriptionAr: "", descriptionEn: "" });
    setNews((prev) => ({
      ...(prev ?? { titleAr: "", titleEn: "", descriptionAr: "", descriptionEn: "" }),
      [name]: value,
    }));
    setNewsSaved(false);
  };

  const handleNewsSubmit = async () => {
    if (!news) return;
    setNewsLoading(true);
    try {
      const method = news._id ? "PUT" : "POST";
      const url = news._id ? `${API_BASE}/main-news/${news._id}` : `${API_BASE}/main-news`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(news),
      });

      if (res.ok) {
        const data = await res.json();
        setNews(data);
        setNewsEmpty(false);
        setNewsSaved(true);
        setIsEditing(false);
        showNotify(isRTL ? "✅ تم حفظ البيانات بنجاح" : "✅ Saved successfully", "success");
      } else {
        showNotify(isRTL ? "❌ فشل الحفظ" : "❌ Failed to save", "error");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      showNotify(isRTL ? "❌ حدث خطأ" : "❌ An error occurred", "error");
    } finally {
      setNewsLoading(false);
    }
  };

  // ===== Video Handlers =====
  const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("video", file);

    setVideoLoading(true);
    try {
      const res = await fetch(`${API_BASE}/videos`, { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setVideo(data.video); // ⚡ استخدم الرابط المباشر
        showNotify(isRTL ? "✅ تم رفع الفيديو بنجاح" : "✅ Video uploaded successfully", "success");
      } else {
        showNotify(isRTL ? "❌ فشل رفع الفيديو" : "❌ Failed to upload video", "error");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      showNotify(isRTL ? "❌ خطأ أثناء الرفع" : "❌ Upload error", "error");
    } finally {
      setVideoLoading(false);
    }
  };

  const confirmDeleteVideo = () => setShowModal(true);

  const handleDeleteVideo = async () => {
    setVideoLoading(true);
    try {
      const res = await fetch(`${API_BASE}/videos`, { method: "DELETE" });
      if (res.ok) {
        setVideo(null);
        showNotify(isRTL ? "🗑️ تم حذف الفيديو" : "🗑️ Video deleted", "success");
      } else {
        showNotify(isRTL ? "❌ فشل حذف الفيديو" : "❌ Failed to delete video", "error");
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      showNotify(isRTL ? "❌ خطأ أثناء الحذف" : "❌ Delete error", "error");
    } finally {
      setVideoLoading(false);
      setShowModal(false);
    }
  };

  // ===== Delete Main News =====
  const confirmDeleteNews = () => setShowNewsModal(true);

  const handleDeleteNews = async () => {
    if (!news?._id) return;
    try {
      const res = await fetch(`${API_BASE}/main-news/${news._id}`, { method: "DELETE" });
      if (res.ok) {
        setNews(null);
        setNewsSaved(false);
        setNewsEmpty(true);
        showNotify(isRTL ? "🗑️ تم حذف الخبر" : "🗑️ News deleted", "success");
      } else {
        showNotify(isRTL ? "❌ فشل الحذف" : "❌ Failed to delete", "error");
      }
    } catch (err) {
      console.error(err);
      showNotify(isRTL ? "❌ خطأ أثناء الحذف" : "❌ Delete error", "error");
    } finally {
      setShowNewsModal(false);
    }
  };

  return (
    <Layout>
      <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6 gap-8">

        {/* ===== Main News Inputs ===== */}
        <div ref={inputsRef} className="w-full max-w-2xl flex flex-col gap-4 bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-4">{isRTL ? "📰  العنوان الرئيسي والوصف للأخبار" : "📰 Main News Title And Description"}</h1>

          {newsEmpty && (
            <p className="text-gray-500 text-center mb-4">
              {isRTL ? "لا توجد بيانات حالياً، الرجاء إضافة عنوان جديد." : "No data available. Please add a new main news."}
            </p>
          )}

          <input
            type="text"
            name="titleAr"
            value={news?.titleAr || ""}
            onChange={handleNewsChange}
            placeholder={isRTL ? "العنوان بالعربية" : "Title (Arabic)"}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            name="titleEn"
            value={news?.titleEn || ""}
            onChange={handleNewsChange}
            placeholder={isRTL ? "العنوان بالإنجليزية" : "Title (English)"}
            className="border p-2 rounded-lg"
          />
          <textarea
            name="descriptionAr"
            value={news?.descriptionAr || ""}
            onChange={handleNewsChange}
            placeholder={isRTL ? "الوصف بالعربية" : "Description (Arabic)"}
            className="border p-2 rounded-lg"
            rows={3}
          />
          <textarea
            name="descriptionEn"
            value={news?.descriptionEn || ""}
            onChange={handleNewsChange}
            placeholder={isRTL ? "الوصف بالإنجليزية" : "Description (English)"}
            className="border p-2 rounded-lg"
            rows={3}
          />

          <button
            onClick={handleNewsSubmit}
            disabled={newsLoading}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mt-2"
          >
            {newsLoading
              ? (isRTL ? "⏳ جارٍ الحفظ..." : "⏳ Saving...")
              : isEditing
              ? (isRTL ? "💾 حفظ التعديلات" : "💾 Save Changes")
              : (isRTL ? "💾 حفظ" : "💾 Save")}
          </button>
        </div>

        {/* ===== Display Saved Main News ===== */}
        {newsSaved && news && (
          <div className="w-full max-w-2xl bg-gray-50 p-4 rounded-xl shadow-inner flex flex-col gap-3">
            <h2 className="text-xl font-bold">{isRTL ? "العنوان" : "Title"}:</h2>
            <p className="text-gray-700">{news.titleAr} / {news.titleEn}</p>

            <h2 className="text-xl font-bold">{isRTL ? "الوصف" : "Description"}:</h2>
            <p className="text-gray-700">{news.descriptionAr} / {news.descriptionEn}</p>

            <div className="flex gap-4 mt-2">
              <button
                onClick={() => {
                  setIsEditing(true);
                  inputsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
              >
                ✏️ {isRTL ? "تعديل" : "Edit"}
              </button>

              <button
                onClick={confirmDeleteNews}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                🗑️ {isRTL ? "حذف" : "Delete"}
              </button>
            </div>
          </div>
        )}

        {/* ===== Video Section ===== */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-4">
          <label className="cursor-pointer bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition">
            {videoLoading ? (isRTL ? "⏳ جارٍ الرفع..." : "⏳ Uploading...") : (isRTL ? "📤 ارفع فيديو جديد" : "📤 Upload New Video")}
            <input type="file" accept="video/*" className="hidden" onChange={handleUploadVideo} disabled={videoLoading} />
          </label>

          {video && (
            <>
              <video src={video} controls className="w-full max-w-2xl rounded-lg shadow-lg" />
              <button
                onClick={confirmDeleteVideo}
                disabled={videoLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
              >
                🗑️ {isRTL ? "حذف الفيديو" : "Delete Video"}
              </button>
            </>
          )}
        </div>

        {/* ===== Video Delete Modal ===== */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] text-center">
              <h2 className="text-xl font-bold mb-4">{isRTL ? "هل أنت متأكد؟" : "Are you sure?"}</h2>
              <p className="text-gray-600 mb-6">{isRTL ? "هل تريد حذف الفيديو نهائيًا؟" : "Do you really want to delete this video permanently?"}</p>
              <div className="flex justify-center gap-4">
                <button onClick={handleDeleteVideo} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold">
                  {isRTL ? "حذف" : "Delete"}
                </button>
                <button onClick={() => setShowModal(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-lg font-semibold">
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== News Delete Modal ===== */}
        {showNewsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] text-center">
              <h2 className="text-xl font-bold mb-4">{isRTL ? "هل أنت متأكد؟" : "Are you sure?"}</h2>
              <p className="text-gray-600 mb-6">{isRTL ? "هل تريد حذف العنوان الرئيسى والوصف نهائيًا؟" : "Do you really want to delete main title and description permanently?"}</p>
              <div className="flex justify-center gap-4">
                <button onClick={handleDeleteNews} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold">
                  {isRTL ? "حذف" : "Delete"}
                </button>
                <button onClick={() => setShowNewsModal(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-lg font-semibold">
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== Notifications ===== */}
        {notify && (
          <div className={`fixed top-5 ${isRTL ? "left-5" : "right-5"} z-[9999] px-6 py-3 rounded-xl shadow-lg text-white font-medium transition-all duration-500
            ${notify.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            {notify.message}
          </div>
        )}
      </div>
    </Layout>
  );
}
