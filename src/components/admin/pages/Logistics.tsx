import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../../context/LanguageContext";
import { API_BASE } from "../api"; // <-- استخدمنا هنا

// =====================
// Types
// =====================
interface Localized {
  title: string;
  description: string;
  features: string[];
}

interface Stats {
  warehouses: number;
  trucks: number;
  accuracy: number;
}

interface LogisticsForm {
  ar: Localized;
  en: Localized;
  stats: Stats;
}

interface LogisticsData extends LogisticsForm {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// =====================
// Component
// =====================
export default function AdminLogistics() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [formData, setFormData] = useState<LogisticsForm>({
    ar: { title: "", description: "", features: [""] },
    en: { title: "", description: "", features: [""] },
    stats: { warehouses: 0, trucks: 0, accuracy: 0 },
  });

  const [logistics, setLogistics] = useState<LogisticsData | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // =====================
  // Fetch logistics
  // =====================
  const fetchLogistics = async () => {
    try {
      const res = await fetch(`${API_BASE}/logistics`);
      const data: LogisticsData[] = await res.json();
      setLogistics(data[0] || null);
    } catch (err) {
      console.error("Error fetching logistics:", err);
      toast.error(isRTL ? "فشل تحميل البيانات" : "Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchLogistics();
  }, []);

  // =====================
  // Handle changes
  // =====================
  const handleChange = (
    lang: keyof LogisticsForm,
    field: keyof Localized | keyof Stats,
    value: string,
    index?: number
  ) => {
    if (lang === "stats") {
      setFormData({
        ...formData,
        stats: {
          ...formData.stats,
          [field]: Number(value),
        },
      });
    } else {
      if (field === "features" && index !== undefined) {
        const updatedFeatures = [...formData[lang].features];
        updatedFeatures[index] = value;
        setFormData({
          ...formData,
          [lang]: { ...formData[lang], features: updatedFeatures },
        });
      } else {
        setFormData({
          ...formData,
          [lang]: { ...formData[lang], [field]: value } as Localized,
        });
      }
    }
  };

  // =====================
  // Submit (Add or Edit)
  // =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await fetch(`${API_BASE}/logistics/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        toast.success(isRTL ? "تم تعديل البيانات ✅" : "Updated successfully ✅");
        setEditId(null);
      } else {
        if (logistics) {
          toast.error(isRTL ? "مسموح ببيانات واحدة فقط! ✋" : "Only one entry allowed! ✋");
          return;
        }
        await fetch(`${API_BASE}/logistics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        toast.success(isRTL ? "تم حفظ البيانات ✅" : "Saved successfully ✅");
      }

      setFormData({
        ar: { title: "", description: "", features: [""] },
        en: { title: "", description: "", features: [""] },
        stats: { warehouses: 0, trucks: 0, accuracy: 0 },
      });
      fetchLogistics();
    } catch (err) {
      console.error("Error saving logistics:", err);
      toast.error(isRTL ? "حدث خطأ أثناء الحفظ ❌" : "Error saving data ❌");
    }
  };

  // =====================
  // Edit
  // =====================
  const handleEdit = () => {
    if (logistics) {
      setFormData({
        ar: { ...logistics.ar },
        en: { ...logistics.en },
        stats: { ...logistics.stats },
      });
      setEditId(logistics._id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // =====================
  // Delete
  // =====================
  const confirmDelete = async () => {
    if (!logistics) return;
    try {
      await fetch(`${API_BASE}/logistics/${logistics._id}`, {
        method: "DELETE",
      });
      toast.success(isRTL ? "تم حذف البيانات ❌" : "Deleted successfully ❌");
      setLogistics(null);
    } catch (err) {
      console.error("Error deleting logistics:", err);
      toast.error(isRTL ? "فشل حذف البيانات" : "Failed to delete ❌");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // =====================
  // Render
  // =====================
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="p-6 max-w-5xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-2xl font-bold mb-4">
        {editId
          ? isRTL
            ? "تعديل بيانات الخدمات اللوجستية"
            : "Edit Logistics Data"
          : isRTL
          ? "إضافة بيانات الخدمات اللوجستية"
          : "Add Logistics Data"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {(Object.keys(formData) as (keyof LogisticsForm)[]).map((lang) =>
          lang !== "stats" ? (
            <div key={lang} className="border p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">
                {lang === "ar" ? (isRTL ? "العربية" : "Arabic") : isRTL ? "الإنجليزية" : "English"}
              </h3>

              <input
                type="text"
                placeholder={isRTL ? (lang === "ar" ? "العنوان بالعربية" : "العنوان بالإنجليزية") : lang === "ar" ? "Title (AR)" : "Title (EN)"}
                value={formData[lang].title}
                onChange={(e) => handleChange(lang, "title", e.target.value)}
                className="w-full border p-2 mb-2"
              />

              <textarea
                placeholder={isRTL ? (lang === "ar" ? "الوصف بالعربية" : "الوصف بالإنجليزية") : lang === "ar" ? "Description (AR)" : "Description (EN)"}
                value={formData[lang].description}
                onChange={(e) => handleChange(lang, "description", e.target.value)}
                className="w-full border p-2 mb-2"
              />

              {formData[lang].features.map((feature, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={
                    isRTL
                      ? lang === "ar"
                        ? `الميزة ${i + 1}`
                        : `Feature ${i + 1}`
                      : lang === "ar"
                      ? `Feature ${i + 1}`
                      : `Feature ${i + 1}`
                  }
                  value={feature}
                  onChange={(e) => handleChange(lang, "features", e.target.value, i)}
                  className="w-full border p-2 mb-2"
                />
              ))}
            </div>
          ) : (
            <div key={lang} className="border p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{isRTL ? "إحصائيات" : "Statistics"}</h3>
              <input
                type="number"
                placeholder={isRTL ? "عدد المخازن" : "Warehouses"}
                value={formData.stats.warehouses}
                onChange={(e) => handleChange("stats", "warehouses", e.target.value)}
                className="w-full border p-2 mb-2"
              />
              <input
                type="number"
                placeholder={isRTL ? "عدد الشاحنات" : "Trucks"}
                value={formData.stats.trucks}
                onChange={(e) => handleChange("stats", "trucks", e.target.value)}
                className="w-full border p-2 mb-2"
              />
              <input
                type="number"
                placeholder={isRTL ? "نسبة دقة التسليم" : "Accuracy %"}
                value={formData.stats.accuracy}
                onChange={(e) => handleChange("stats", "accuracy", e.target.value)}
                className="w-full border p-2 mb-2"
              />
            </div>
          )
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md"
        >
          {editId ? (isRTL ? "تعديل" : "Edit") : isRTL ? "حفظ" : "Save"}
        </button>
      </form>

      {/* List */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">{isRTL ? "البيانات الموجودة" : "Existing Data"}</h2>
        {!logistics ? (
          <p className="text-gray-500">{isRTL ? "لا يوجد بيانات بعد" : "No data available"}</p>
        ) : (
          <div className="p-4 border rounded-lg shadow-sm">
            {/* Arabic */}
            {logistics.ar && (
              <>
                <h3 className="text-lg font-semibold">{logistics.ar.title || (isRTL ? "بدون عنوان" : "No Title")}</h3>
                <p className="text-sm text-gray-600">{logistics.ar.description || (isRTL ? "بدون وصف" : "No Description")}</p>
                <ul className="list-disc list-inside text-gray-700">
                  {logistics.ar.features.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </>
            )}

            <hr className="my-2" />

            {/* English */}
            {logistics.en && (
              <>
                <h3 className="text-lg font-semibold">{logistics.en.title || "No Title"}</h3>
                <p className="text-sm text-gray-600">{logistics.en.description || "No Description"}</p>
                <ul className="list-disc list-inside text-gray-700">
                  {logistics.en.features.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </>
            )}

            <hr className="my-2" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="font-bold text-lg">{logistics.stats.warehouses}+</div>
                <div className="text-sm text-gray-600">{isRTL ? "مخازن نشطة" : "Active Warehouses"}</div>
              </div>
              <div>
                <div className="font-bold text-lg">{logistics.stats.trucks}+</div>
                <div className="text-sm text-gray-600">{isRTL ? "شاحنات يومياً" : "Daily Trucks"}</div>
              </div>
              <div>
                <div className="font-bold text-lg">{logistics.stats.accuracy}%</div>
                <div className="text-sm text-gray-600">{isRTL ? "دقة التسليم" : "Delivery Accuracy"}</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleEdit}
                className="px-3 py-1 bg-yellow-500 text-white rounded-lg"
              >
                {isRTL ? "تعديل" : "Edit"}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg"
              >
                {isRTL ? "حذف" : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">{isRTL ? "هل أنت متأكد من الحذف؟" : "Are you sure?"}</h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                {isRTL ? "حذف" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
