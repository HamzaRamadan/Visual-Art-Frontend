import SectionTitle from "../components/layout/SectionTitle";
import { useLanguageHook } from "../hooks/useLanguage";
import "./CompanyProfile.css";

const CompanyProfile = () => {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";

  return (
    <div className="min-h-screen bg-gray-50 py-16 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <div className="Company mb-12">
          <SectionTitle title={isRTL ? 'ملف تعريف الشركة' : 'Company Profile'} />
          <p className="text-lg text-gray-600">
            {isRTL
              ? "يمكنك عرض أو تحميل ملف تعريف الشركة الاحترافي"
              : "View or download our professional company profile"}
          </p>
        </div>

        <div className="Buttons flex justify-center gap-8 mb-12">
          <a
            href="/assets/Co Profile 70 Pages 03.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            {isRTL ? "👁️ عرض الملف" : "👁️ View Profile"}
          </a>

          <a
            href="/assets/Co Profile 70 Pages 03.pdf"
            download="Company_Profile.pdf"
            className="btn btn-secondary"
          >
            {isRTL ? "⬇️ تحميل الملف" : "⬇️ Download Profile"}
          </a>
        </div>

        {/* عرض الملف */}
        <div className="pdf-viewer-container">
  <img
    src="/assets/images/profileCompany.png"
    alt={isRTL ? "صورة ملف الشركة" : "Company Profile Image"}
    className="pdf-viewer"
  />
</div>

      </div>
    </div>
  );
};

export default CompanyProfile;
