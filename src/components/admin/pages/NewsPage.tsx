/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Layout from "../Layout";
import { API_BASE } from "../api";
import { useLanguage } from "../../../context/LanguageContext";

export default function NewsPage() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [news, setNews] = useState<any[]>([]);
  const [form, setForm] = useState({
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    date: "",
    image: "",
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notify, setNotify] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchNews = async () => {
    const res = await fetch(`${API_BASE}/news`);
    const data = await res.json();
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const showNotify = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotify({ message, type });
    setTimeout(() => setNotify(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      await fetch(`${API_BASE}/news/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      showNotify(
        isRTL ? "تم التعديل بنجاح ✏️" : "Updated successfully ✏️",
        "success"
      );
      setEditId(null);
    } else {
      await fetch(`${API_BASE}/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      showNotify(
        isRTL ? "تمت الإضافة بنجاح ✅" : "Added successfully ✅",
        "success"
      );
    }

    setForm({
      titleAr: "",
      titleEn: "",
      descriptionAr: "",
      descriptionEn: "",
      date: "",
      image: "",
    });
    fetchNews();
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await fetch(`${API_BASE}/news/${deleteId}`, { method: "DELETE" });
      fetchNews();
      setDeleteId(null);
      setShowModal(false);
      showNotify(
        isRTL ? "تم الحذف بنجاح 🗑️" : "Deleted successfully 🗑️",
        "success"
      );
    }
  };

  const handleUpdate = (item: any) => {
    setForm({
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      descriptionAr: item.descriptionAr,
      descriptionEn: item.descriptionEn,
      date: item.date,
      image: item.image,
    });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <div dir={isRTL ? "rtl" : "ltr"}>
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isRTL ? "📰 إدارة الأخبار" : "📰 Manage News"}
        </h1>

        {/* FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 justify-between"
          >
            <input
              className="w-[48%] p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder={isRTL ? "العنوان (عربي)" : "Title (AR)"}
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
            />
            <input
              className="w-[48%] p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder={isRTL ? "العنوان (إنجليزي)" : "Title (EN)"}
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
            />

            <textarea
              className="w-[48%] p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder={isRTL ? "الوصف (عربي)" : "Description (AR)"}
              value={form.descriptionAr}
              onChange={(e) =>
                setForm({ ...form, descriptionAr: e.target.value })
              }
            />
            <textarea
              className="w-[48%] p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder={isRTL ? "الوصف (إنجليزي)" : "Description (EN)"}
              value={form.descriptionEn}
              onChange={(e) =>
                setForm({ ...form, descriptionEn: e.target.value })
              }
            />

            <input
              className="w-[48%] p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            {/* IMAGE UPLOAD */}
            <div className="w-[48%] flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setForm({ ...form, image: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border shadow-md"
                />
              )}
            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
              type="submit"
            >
              {editId
                ? isRTL
                  ? "تعديل الخبر"
                  : "Update News"
                : isRTL
                ? "إضافة خبر"
                : "Add News"}
            </button>
          </form>
        </div>

        {/* NEWS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n) => (
            <div
              key={n._id}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col"
            >
              {n.image && (
                <img
                  src={n.image}
                  alt={isRTL ? n.titleAr : n.titleEn}
                  className="w-25 mx-auto my-3 rounded-md object-cover"
                />
              )}
              <h3 className="font-bold text-lg mb-1">
                {isRTL ? n.titleAr : n.titleEn}
              </h3>
              {new Date(n.date).toLocaleString(isRTL ? "ar-EG" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}

              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {isRTL ? n.descriptionAr : n.descriptionEn}
              </p>

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleUpdate(n)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition"
                >
                  {isRTL ? "تعديل" : "Update"}
                </button>
                <button
                  onClick={() => confirmDelete(n._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition"
                >
                  {isRTL ? "حذف" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DELETE MODAL */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] text-center">
              <h2 className="text-xl font-bold mb-4">
                {isRTL ? "هل أنت متأكد؟" : "Are you sure?"}
              </h2>
              <p className="text-gray-600 mb-6">
                {isRTL
                  ? "هل تريد حذف هذا الخبر؟ لا يمكن التراجع عن هذا الإجراء."
                  : "Do you really want to delete this news item? This action cannot be undone."}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold"
                >
                  {isRTL ? "حذف" : "Delete"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-lg font-semibold"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
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
