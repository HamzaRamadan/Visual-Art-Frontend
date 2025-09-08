import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../../context/LanguageContext";
import { API_BASE } from "../api"; 

// =====================
// Types
// =====================
interface Localized {
  title: string;
  description: string;
  features: string[];
}

interface Stats {
  projects: number;
  clients: number;
  satisfaction: number;
}

interface ProductionForm {
  ar: Localized;
  en: Localized;
  stats: Stats;
}

interface ProductionData extends ProductionForm {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// =====================
// Component
// =====================
export default function AdminProductionCapacity() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [formData, setFormData] = useState<ProductionForm>({
    ar: { title: "", description: "", features: [""] },
    en: { title: "", description: "", features: [""] },
    stats: { projects: 0, clients: 0, satisfaction: 0 },
  });

  const [production, setProduction] = useState<ProductionData | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // =====================
  // Fetch
  // =====================
  const fetchProduction = async () => {
    try {
      const res = await fetch(`${API_BASE}/services`);
      const data: ProductionData[] = await res.json();
      setProduction(data[0] || null);
    } catch (err) {
      console.error("Error fetching production:", err);
      toast.error(isRTL ? "فشل تحميل البيانات" : "Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchProduction();
  }, []);

  // =====================
  // Handle changes
  // =====================
  const handleChange = (
    lang: keyof ProductionForm,
    field: keyof Localized | keyof Stats,
    value: string,
    index?: number
  ) => {
    if (lang === "stats") {
      setFormData({
        ...formData,
        stats: { ...formData.stats, [field]: Number(value) },
      });
    } else {
      if (field === "features" && index !== undefined) {
        const updated = [...formData[lang].features];
        updated[index] = value;
        setFormData({
          ...formData,
          [lang]: { ...formData[lang], features: updated },
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
  // Submit (Add / Edit)
  // =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await fetch(`${API_BASE}/services/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        toast.success(isRTL ? "تم تعديل البيانات ✅" : "Updated successfully ✅");
        setEditId(null);
      } else {
        if (production) {
          toast.error(isRTL ? "مسموح ببيانات واحدة فقط! ✋" : "Only one entry allowed! ✋");
          return;
        }
        await fetch(`${API_BASE}/services`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        toast.success(isRTL ? "تم حفظ البيانات ✅" : "Saved successfully ✅");
      }

      setFormData({
        ar: { title: "", description: "", features: [""] },
        en: { title: "", description: "", features: [""] },
        stats: { projects: 0, clients: 0, satisfaction: 0 },
      });
      fetchProduction();
    } catch (err) {
      console.error("Error saving production:", err);
      toast.error(isRTL ? "حدث خطأ أثناء الحفظ ❌" : "Error saving data ❌");
    }
  };

  // =====================
  // Edit
  // =====================
  const handleEdit = () => {
    if (production) {
      setFormData({
        ar: { ...production.ar },
        en: { ...production.en },
        stats: { ...production.stats },
      });
      setEditId(production._id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // =====================
  // Delete
  // =====================
  const confirmDelete = async () => {
    if (!production) return;
    try {
      await fetch(`${API_BASE}/services/${production._id}`, {
        method: "DELETE",
      });
      toast.success(isRTL ? "تم حذف البيانات ❌" : "Deleted successfully ❌");
      setProduction(null);
    } catch (err) {
      console.error("Error deleting production:", err);
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
            ? "تعديل بيانات القدرة الإنتاجية"
            : "Edit Production Capacity"
          : isRTL
          ? "إضافة بيانات القدرة الإنتاجية"
          : "Add Production Capacity"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {(Object.keys(formData) as (keyof ProductionForm)[]).map((lang) =>
          lang !== "stats" ? (
            <div key={lang} className="border p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">
                {lang === "ar"
                  ? isRTL
                    ? "العربية"
                    : "Arabic"
                  : isRTL
                  ? "الإنجليزية"
                  : "English"}
              </h3>

              <input
                type="text"
                placeholder={
                  isRTL
                    ? lang === "ar"
                      ? "العنوان بالعربية"
                      : "العنوان بالإنجليزية"
                    : lang === "ar"
                    ? "Title (AR)"
                    : "Title (EN)"
                }
                value={formData[lang].title}
                onChange={(e) => handleChange(lang, "title", e.target.value)}
                className="w-full border p-2 mb-2"
              />
              <textarea
                placeholder={
                  isRTL
                    ? lang === "ar"
                      ? "الوصف بالعربية"
                      : "الوصف بالإنجليزية"
                    : lang === "ar"
                    ? "Description (AR)"
                    : "Description (EN)"
                }
                value={formData[lang].description}
                onChange={(e) =>
                  handleChange(lang, "description", e.target.value)
                }
                className="w-full border p-2 mb-2"
              />
              {formData[lang].features.map((f, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={
                    isRTL
                      ? lang === "ar"
                        ? `الميزة ${i + 1}`
                        : `Feature ${i + 1}`
                      : `Feature ${i + 1}`
                  }
                  value={f}
                  onChange={(e) =>
                    handleChange(lang, "features", e.target.value, i)
                  }
                  className="w-full border p-2 mb-2"
                />
              ))}
            </div>
          ) : (
            <div key={lang} className="border p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">
                {isRTL ? "إحصائيات" : "Statistics"}
              </h3>
              <input
                type="number"
                placeholder={isRTL ? "عدد المشاريع" : "Projects"}
                value={formData.stats.projects}
                onChange={(e) =>
                  handleChange("stats", "projects", e.target.value)
                }
                className="w-full border p-2 mb-2"
              />
              <input
                type="number"
                placeholder={isRTL ? "عدد العملاء" : "Clients"}
                value={formData.stats.clients}
                onChange={(e) =>
                  handleChange("stats", "clients", e.target.value)
                }
                className="w-full border p-2 mb-2"
              />
              <input
                type="number"
                placeholder={isRTL ? "نسبة الرضا" : "Satisfaction %"}
                value={formData.stats.satisfaction}
                onChange={(e) =>
                  handleChange("stats", "satisfaction", e.target.value)
                }
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

      {/* Display */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">
          {isRTL ? "البيانات الموجودة" : "Existing Data"}
        </h2>
        {!production ? (
          <p className="text-gray-500">
            {isRTL ? "لا يوجد بيانات بعد" : "No data available"}
          </p>
        ) : (
          <div className="p-4 border rounded-lg shadow-sm">
            {/* Arabic */}
            <h3 className="text-lg font-semibold">{production.ar.title}</h3>
            <p className="text-sm text-gray-600">{production.ar.description}</p>
            <ul className="list-disc ml-5">
              {production.ar.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <hr className="my-3" />

            {/* English */}
            <h3 className="text-lg font-semibold">{production.en.title}</h3>
            <p className="text-sm text-gray-600">{production.en.description}</p>
            <ul className="list-disc ml-5">
              {production.en.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <hr className="my-3" />

            {/* Stats */}
            {production.stats && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {production.stats.projects}+
                  </span>
                  <p className="text-sm text-gray-500">
                    {isRTL ? "مشاريع" : "Projects"}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-green-600">
                    {production.stats.clients}+
                  </span>
                  <p className="text-sm text-gray-500">
                    {isRTL ? "عملاء" : "Clients"}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-purple-600">
                    {production.stats.satisfaction}%
                  </span>
                  <p className="text-sm text-gray-500">
                    {isRTL ? "نسبة الرضا" : "Satisfaction"}
                  </p>
                </div>
              </div>
            )}

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
            <h3 className="text-lg font-bold mb-4">
              {isRTL ? "هل أنت متأكد من الحذف؟" : "Are you sure?"}
            </h3>
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
