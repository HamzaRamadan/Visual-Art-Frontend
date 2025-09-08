/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
import { useLanguage } from "../../../context/LanguageContext";

export default function Register() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "admin" }), // التسجيل للأدمن فقط
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || (isRTL ? "فشل التسجيل" : "Register failed"));

      setSuccess(isRTL ? "تم إنشاء الحساب بنجاح، الآن سجل دخولك!" : "Account created successfully, now login!");
      setName(""); setEmail(""); setPassword("");
      setTimeout(() => navigate("/loginToDashBoard"), 2000);
    } catch (err: any) {
      setError(err.message || (isRTL ? "حدث خطأ" : "An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" dir={isRTL ? "rtl" : "ltr"}>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center mb-4">{isRTL ? "تسجيل حساب جديد" : "Register"}</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <input
          type="text"
          placeholder={isRTL ? "الاسم" : "Name"}
          className="p-3 border rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder={isRTL ? "البريد الإلكتروني" : "Email"}
          className="p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={isRTL ? "كلمة المرور" : "Password"}
          className="p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-600 text-white py-3 rounded-lg hover:opacity-90 transition">
          {loading ? (isRTL ? "جاري التسجيل..." : "Loading...") : (isRTL ? "تسجيل" : "Register")}
        </button>
      </form>
    </div>
  );
}
