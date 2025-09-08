import "./News.css";
import { useLanguageHook } from "../../hooks/useLanguage";
import SectionTitle from "../../components/layout/SectionTitle";
import { useEffect, useState } from "react";
import { API_BASE } from "../../components/admin/api";

interface NewsType {
  _id?: string;
  id?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  date: string;
  image: string;
}

interface MainNewsType {
  _id?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

const News = () => {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";

  const defaultText = {
    title: "معرض مصنع الفارابي للطباعة 2025",
    description: "معرض مصنع الفارابي للطباعة 2025",
  };

  const [mainNews, setMainNews] = useState<MainNewsType | null>(null);
  const [newsCards, setNewsCards] = useState<NewsType[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const resMain = await fetch(`${API_BASE}/main-news`);
        const dataMain = await resMain.json();
        if (dataMain && dataMain.length > 0) setMainNews(dataMain[0]);

        const resNews = await fetch(`${API_BASE}/news`);
        const dataNews = await resNews.json();
        setNewsCards(dataNews);

        const resVideo = await fetch(`${API_BASE}/videos`);
        const dataVideo = await resVideo.json();
        setVideo(dataVideo?.video || null);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>{isRTL ? "جارٍ التحميل..." : "Loading..."}</p>

        {/* ✅ CSS للـ spinner */}
        <style>
          {`
            .spinner-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 2rem;
            }

            .spinner {
              --spinner-size: 60px;
              --spinner-border: 6px;
              --spinner-color: #3498db;

              width: var(--spinner-size);
              height: var(--spinner-size);
              border: var(--spinner-border) solid #f3f3f3;
              border-top: var(--spinner-border) solid var(--spinner-color);
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-bottom: 1rem;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className={`news-page ${isRTL ? "rtl" : "ltr"}`}>
      <SectionTitle title={isRTL ? "الأخبار" : "News"} />

      <div className="news-container">
        <div className="news-text">
          <h2>
            {mainNews
              ? isRTL
                ? mainNews.titleAr
                : mainNews.titleEn
              : defaultText.title}
          </h2>
          <p>
            {mainNews
              ? isRTL
                ? mainNews.descriptionAr
                : mainNews.descriptionEn
              : defaultText.description}
          </p>
        </div>
        <div className="news-video">
          {video ? (
            <video controls className="w-full max-w-2xl rounded-lg shadow-lg">
              <source src={video} type="video/mp4" />
              {isRTL
                ? "متصفحك لا يدعم الفيديو"
                : "Your browser does not support the video tag."}
            </video>
          ) : (
            <p className="font-bold text-[25px] ml-28">
              {isRTL ? "لا يوجد فيديو مرفوع حالياً" : "No video uploaded yet"}
            </p>
          )}
        </div>
      </div>

      <div className="news-cards">
        {newsCards.map((news) => (
          <div className="news-card" key={news._id || news.id}>
            <img src={news.image} alt={isRTL ? news.titleAr : news.titleEn} />
            <div className="news-card-content">
              <h3>{isRTL ? news.titleAr : news.titleEn}</h3>
              <p>{isRTL ? news.descriptionAr : news.descriptionEn}</p>
              <span className="news-card-date">
                {new Date(news.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
