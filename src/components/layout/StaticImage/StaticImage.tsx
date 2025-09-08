import React, { useEffect, useState } from "react";
import "./StaticImage.css";
import { API_BASE } from "../../admin/api";

interface Ad {
  _id: string;
  images: string[];
}

const StaticImage: React.FC = () => {
  const [ ,setAds] = useState<Ad[]>([]);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ جلب الصور من الباك
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(`${API_BASE}/ads`);
        if (!res.ok) throw new Error("Failed to fetch ads");
        const data: Ad[] = await res.json();

        // 🖼️ استخراج كل الصور من كل الإعلانات
        const images = data.flatMap((ad) =>
          ad.images.map((img) =>
            img.startsWith("http")
              ? img
              : `${API_BASE.replace("/api", "")}${img}`
          )
        );

        setAds(data);
        setAllImages(images);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAds();
  }, []);

  // ⏱️ تغيير الصورة كل 5 ثواني
  useEffect(() => {
    if (allImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allImages]);

  return (
    <section className="parallax-slider">
      {allImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`slide-${index}`}
          className={`parallax-image ${index === currentIndex ? "active" : ""}`}
        />
      ))}

      {/* لو مفيش صور */}
      {allImages.length === 0 && (
        <p className="text-center text-gray-500">No images available</p>
      )}
    </section>
  );
};

export default StaticImage;
