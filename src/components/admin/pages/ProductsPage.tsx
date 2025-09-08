/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Layout from "../Layout";
import { API_BASE } from "../api";
import { useLanguage } from "../../../context/LanguageContext";

// Toast component
const Toast = ({ message, type, onClose }: any) => (
  <div
    className={`px-4 py-2 rounded-lg shadow-lg text-white transition-opacity ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    {message}
    <button onClick={onClose} className="ml-2 font-bold">×</button>
  </div>
);

// Confirmation popup component
const ConfirmPopup = ({ message, onConfirm, onCancel }: any) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
    <div className="bg-white p-6 rounded-xl shadow-lg w-96">
      <p className="mb-4">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default function ProductsPage() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    titleAr: "", titleEn: "",
    categoryAr: "", categoryEn: "",
    descriptionAr: "", descriptionEn: "",
    img: "", imgList: [] as string[],
    featuresAr: [] as string[], featuresEn: [] as string[],
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<File[]>([]);
  const [newFeatureAr, setNewFeatureAr] = useState("");
  const [newFeatureEn, setNewFeatureEn] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; show: boolean }>({ id: "", show: false });

  // const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTIwYmQ1N2M0MWIzZDlmOTYyMWIwYSIsImlhdCI6MTc1NjY0NTk0NCwiZXhwIjoxNzU3MjUwNzQ0fQ._5qxazTx8HOb9eyfy-a7yrdKziZrYAsd8dbIREFIC2s";

  const token = localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "";


  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE}/products`, { headers: { Authorization: token } });
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let mainImage = form.img;
      let extraImages = form.imgList;
      if (file) mainImage = await fileToBase64(file);
      if (fileList.length > 0) extraImages = await Promise.all(fileList.map(f => fileToBase64(f)));

      const payload = {
        ar: [{ title: form.titleAr, description: form.descriptionAr, category: form.categoryAr, img: mainImage, imgList: extraImages, features: form.featuresAr }],
        en: [{ title: form.titleEn, description: form.descriptionEn, category: form.categoryEn, img: mainImage, imgList: extraImages, features: form.featuresEn }]
      };

      const url = editId ? `${API_BASE}/products/${editId}` : `${API_BASE}/products`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      setForm({
        titleAr: "", titleEn: "",
        categoryAr: "", categoryEn: "",
        descriptionAr: "", descriptionEn: "",
        img: "", imgList: [], featuresAr: [], featuresEn: [],
      });
      setFile(null); setFileList([]); setEditId(null); setNewFeatureAr(""); setNewFeatureEn("");

      fetchProducts();
      showToast(editId ? (isRTL ? "تم التعديل بنجاح" : "Updated successfully") : (isRTL ? "تمت الإضافة بنجاح" : "Added successfully"), "success");
      if (editId) window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      showToast(isRTL ? "حدث خطأ أثناء العملية" : "An error occurred", "error");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => setConfirmDelete({ id, show: true });

  const confirmDeleteAction = async () => {
    const id = confirmDelete.id;
    setConfirmDelete({ id: "", show: false });
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: "DELETE", headers: { Authorization: token } });
      fetchProducts();
      showToast(isRTL ? "تم الحذف بنجاح" : "Deleted successfully", "success");
    } catch (err) { console.error(err); showToast(isRTL ? "حدث خطأ أثناء الحذف" : "Delete failed", "error"); }
  };

  const handleEdit = (product: any) => {
    setEditId(product._id);
    setForm({
      titleAr: product.ar?.[0]?.title || "",
      titleEn: product.en?.[0]?.title || "",
      categoryAr: product.ar?.[0]?.category || "",
      categoryEn: product.en?.[0]?.category || "",
      descriptionAr: product.ar?.[0]?.description || "",
      descriptionEn: product.en?.[0]?.description || "",
      img: product.ar?.[0]?.img || "",
      imgList: product.ar?.[0]?.imgList || [],
      featuresAr: product.ar?.[0]?.features || [],
      featuresEn: product.en?.[0]?.features || [],
    });
    setFile(null); setFileList([]); setNewFeatureAr(""); setNewFeatureEn("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addFeature = () => {
    if (newFeatureAr.trim()) { setForm(prev => ({ ...prev, featuresAr: [...prev.featuresAr, newFeatureAr.trim()] })); setNewFeatureAr(""); }
    if (newFeatureEn.trim()) { setForm(prev => ({ ...prev, featuresEn: [...prev.featuresEn, newFeatureEn.trim()] })); setNewFeatureEn(""); }
  };

  return (
    <Layout>
      <div dir={isRTL ? "rtl" : "ltr"}>
        {/* Toast container */}
        {toast && (
          <div className="fixed top-5 right-5 z-[9999]">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6 text-center">{isRTL ? "إدارة المنتجات" : "Manage Products"}</h1>

        {confirmDelete.show && <ConfirmPopup message={isRTL ? "هل أنت متأكد؟" : "Are you sure?"} onCancel={() => setConfirmDelete({ id: "", show: false })} onConfirm={confirmDeleteAction} />}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-10 bg-white p-6 rounded-xl shadow-md">
          {/* Titles */}
          <input className="p-3 border rounded-lg" placeholder={isRTL ? "العنوان (عربي)" : "Title (AR)"} value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
          <input className="p-3 border rounded-lg" placeholder={isRTL ? "العنوان (إنجليزي)" : "Title (EN)"} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />

          {/* Categories */}
          <input className="p-3 border rounded-lg" placeholder={isRTL ? "الفئة (عربي)" : "Category (AR)"} value={form.categoryAr} onChange={(e) => setForm({ ...form, categoryAr: e.target.value })} />
          <input className="p-3 border rounded-lg" placeholder={isRTL ? "الفئة (إنجليزي)" : "Category (EN)"} value={form.categoryEn} onChange={(e) => setForm({ ...form, categoryEn: e.target.value })} />

          {/* Descriptions */}
          <textarea className="p-3 border rounded-lg min-h-[100px]" placeholder={isRTL ? "الوصف (عربي)" : "Description (AR)"} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
          <textarea className="p-3 border rounded-lg min-h-[100px]" placeholder={isRTL ? "الوصف (إنجليزي)" : "Description (EN)"} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />

          {/* Features */}
          <div className="col-span-1 flex flex-col gap-2">
            <label>{isRTL ? "المميزات (عربي)" : "Features (AR)"}</label>
            <div className="flex gap-2">
              <input type="text" className="p-2 border rounded-lg flex-1" value={newFeatureAr} onChange={(e) => setNewFeatureAr(e.target.value)} />
              <button type="button" onClick={addFeature} className="bg-blue-600 text-white px-3 rounded-lg">{isRTL ? "أضف" : "Add"}</button>
            </div>
            <ul className="list-disc pl-5">{form.featuresAr.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label>{isRTL ? "المميزات (إنجليزي)" : "Features (EN)"}</label>
            <div className="flex gap-2">
              <input type="text" className="p-2 border rounded-lg flex-1" value={newFeatureEn} onChange={(e) => setNewFeatureEn(e.target.value)} />
              <button type="button" onClick={addFeature} className="bg-blue-600 text-white px-3 rounded-lg">{isRTL ? "أضف" : "Add"}</button>
            </div>
            <ul className="list-disc pl-5">{form.featuresEn.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </div>

          {/* Upload Images - Side by Side */}
          <div className="col-span-2 flex gap-6">
            {/* Main Image */}
            <div className="flex-1 flex flex-col gap-2">
              <label>{isRTL ? "الصورة الرئيسية" : "Main Image"}</label>
              <input type="file" accept="image/*" onChange={(e) => { if (e.target.files) setFile(e.target.files[0]); }} />
              {file && <img src={URL.createObjectURL(file)} alt="Preview" className="w-32 h-32 object-cover rounded-md border shadow-md mt-2" />}
            </div>

            {/* Extra Images */}
            <div className="flex-1 flex flex-col gap-2">
              <label>{isRTL ? "صور إضافية" : "Extra Images"}</label>
              <input type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files) setFileList(Array.from(e.target.files)); }} />
              {fileList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {fileList.map((f, i) => (
                    <img key={i} src={URL.createObjectURL(f)} alt={`extra-${i}`} className="w-20 h-20 object-cover rounded-md border" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className={`col-span-2 ${editId ? "bg-green-600" : "bg-blue-600"} text-white py-2 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2`}>
            {loading && <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>}
            {editId ? (isRTL ? "تعديل المنتج" : "Update Product") : (isRTL ? "إضافة منتج" : "Add Product")}
          </button>
        </form>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition flex flex-col justify-between">
              <div>
                {p.ar?.[0]?.img && <img src={p.ar[0].img} alt={p.en?.[0]?.title} className="w-full h-40 object-cover rounded-md mb-3" />}
                {p.ar?.[0]?.imgList && p.ar[0].imgList.length > 0 && <div className="flex flex-wrap gap-2 mb-3">{p.ar[0].imgList.map((imgUrl: string, i: number) => <img key={i} src={imgUrl} alt={`extra-${i}`} className="w-16 h-16 object-cover rounded-md border" />)}</div>}
                <h3 className="font-bold text-lg">{isRTL ? p.ar?.[0]?.title : p.en?.[0]?.title}</h3>
                <p className="text-gray-600 text-sm mb-1">{isRTL ? p.ar?.[0]?.category : p.en?.[0]?.category}</p>
                <p className="text-gray-700 text-sm">{isRTL ? p.ar?.[0]?.description : p.en?.[0]?.description}</p>
                {p.ar?.[0]?.features && p.ar[0].features.length > 0 && <ul className="list-disc pl-5 mt-2">{p.ar[0].features.map((f: string, i: number) => <li key={i}>{f}</li>)}</ul>}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:opacity-90 transition">{isRTL ? "تعديل" : "Edit"}</button>
                <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:opacity-90 transition">{isRTL ? "حذف" : "Delete"}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
