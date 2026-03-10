import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── Demo Data ───────────────────────────────────────────────
const DEMO_TRIPS = [
  {
    id: "china-2026",
    name: "Voyage en Chine",
    subtitle: "中国旅行",
    destination: "Chine",
    startDate: "2026-04-10",
    endDate: "2026-05-02",
    cover: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
    color: "#c0392b",
  },
  {
    id: "japan-2025",
    name: "Tokyo & Kyoto",
    subtitle: "日本の旅",
    destination: "Japon",
    startDate: "2025-10-05",
    endDate: "2025-10-19",
    cover: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    color: "#d4556b",
  },
  {
    id: "italy-2025",
    name: "Dolce Vita",
    subtitle: "Un été en Italie",
    destination: "Italie",
    startDate: "2025-07-12",
    endDate: "2025-07-26",
    cover: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
    color: "#2e7d5e",
  },
];

const DEMO_POSTS = {
  "china-2026": [
    { id: 1, type: "place", title: "The Great Wall at Mutianyu", location: "Mutianyu, Beijing", lat: 40.43, lng: 116.57, date: "2026-04-12", description: "Lever de soleil sur la muraille. Le brouillard se dissipe lentement, révélant des kilomètres de pierre serpentant à travers les montagnes. Moment suspendu dans le temps.", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80", likes: 234 },
    { id: 2, type: "food", title: "Xiaolongbao authentiques", location: "Din Tai Fung, Shanghai", lat: 31.23, lng: 121.47, date: "2026-04-14", description: "Des raviolis parfaits. La peau translucide laisse entrevoir le bouillon brûlant à l'intérieur. Gingembre + vinaigre noir = combo magique.", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80", likes: 189, rating: 5, dish: "Xiaolongbao (小笼包)" },
    { id: 3, type: "place", title: "Yu Garden à l'aube", location: "Old City, Shanghai", lat: 31.22, lng: 121.49, date: "2026-04-15", description: "Arrivé à 6h avant la foule. Les bassins de carpes koï reflètent les pavillons centenaires. Le calme absolu au milieu de la mégalopole.", image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80", likes: 312 },
    { id: 4, type: "food", title: "Hot Pot du Sichuan", location: "Chengdu, Sichuan", lat: 30.57, lng: 104.06, date: "2026-04-18", description: "Le bouillon rouge lave qui bouillonne. Mes lèvres sont en feu depuis 20 minutes mais impossible de s'arrêter. Le bœuf tranché fin fond en bouche.", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80", likes: 276, rating: 4, dish: "Hotpot Sichuan (四川火锅)" },
    { id: 5, type: "place", title: "Rizières de Longji", location: "Longsheng, Guilin", lat: 25.79, lng: 110.10, date: "2026-04-21", description: "Des terrasses sculptées dans la montagne depuis des siècles. L'eau reflète le ciel comme des milliers de miroirs. La définition de la patience humaine.", image: "https://images.unsplash.com/photo-1537531383496-f4749b88b964?w=800&q=80", likes: 421 },
  ],
  "japan-2025": [
    { id: 10, type: "place", title: "Fushimi Inari au crépuscule", location: "Fushimi, Kyoto", lat: 34.96, lng: 135.77, date: "2025-10-08", description: "10 000 torii vermillon qui forment un tunnel hypnotique vers le sommet. Au coucher du soleil, la lumière filtre entre les piliers comme dans un rêve.", image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&q=80", likes: 387 },
    { id: 11, type: "food", title: "Ramen Ichiran", location: "Shibuya, Tokyo", lat: 35.65, lng: 139.70, date: "2025-10-06", description: "Le bouillon tonkotsu crémeux, les nouilles al dente, l'œuf mollet parfait. Mangé seul dans ma booth individuelle, en silence. Rituel.", image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&q=80", likes: 245, rating: 5, dish: "Tonkotsu Ramen (豚骨ラーメン)" },
    { id: 12, type: "place", title: "Shibuya Crossing de nuit", location: "Shibuya, Tokyo", lat: 35.65, lng: 139.70, date: "2025-10-07", description: "3000 personnes qui traversent en même temps dans un ballet parfaitement orchestré. Les néons se reflètent sur l'asphalte mouillé.", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80", likes: 298 },
  ],
  "italy-2025": [
    { id: 20, type: "place", title: "Cinque Terre au lever", location: "Manarola, Ligurie", lat: 44.10, lng: 9.72, date: "2025-07-14", description: "Les maisons colorées empilées sur la falaise, éclairées par les premiers rayons. L'eau turquoise en contrebas. Une aquarelle vivante.", image: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=800&q=80", likes: 456 },
    { id: 21, type: "food", title: "Cacio e Pepe", location: "Trastevere, Roma", lat: 41.88, lng: 12.46, date: "2025-07-13", description: "Trois ingrédients. Pâtes, pecorino, poivre noir. La simplicité absolue élevée au rang d'art. Le chef a 74 ans et fait ça depuis 50 ans.", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80", likes: 334, rating: 5, dish: "Cacio e Pepe" },
  ],
};

// ─── Icons ───────────────────────────────────────────────────
const I = {
  Map: () => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16"/><path d="M16 6v16"/></svg>,
  Feed: () => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Food: () => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  Plus: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Heart: ({ filled }) => <svg width="19" height="19" viewBox="0 0 24 24" fill={filled?"currentColor":"none"} stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Pin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Star: ({ filled }) => <svg width="14" height="14" viewBox="0 0 24 24" fill={filled?"#f59e0b":"none"} stroke="#f59e0b" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Back: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>,
  Camera: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Globe: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1C6.7 1 4 3.7 4 7c0 5.2 6 11.5 6 11.5s6-6.3 6-11.5C16 3.7 13.3 1 10 1z" fill="currentColor" opacity="0.2"/><path d="M10 1C6.7 1 4 3.7 4 7c0 5.2 6 11.5 6 11.5s6-6.3 6-11.5C16 3.7 13.3 1 10 1z" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="10" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>,
  Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
  Compass: () => (
    <svg width="180" height="44" viewBox="0 0 180 44" fill="none">
      {/* Pin/i logomark */}
      <path d="M16 0C10.5 0 6 4.5 6 10c0 8 10 18 10 18s10-10 10-18C26 4.5 21.5 0 16 0z" fill="#4a9e7e"/>
      <circle cx="16" cy="10" r="4.5" fill="white"/>
      <circle cx="16" cy="10" r="2" fill="#4a9e7e"/>
      {/* Wordmark */}
      <text x="36" y="21" fontFamily="Nunito, sans-serif" fontSize="22" fontWeight="800" fill="#2d2d2d" dominantBaseline="middle">inception</text>
    </svg>
  ),
};

// ─── Helpers ─────────────────────────────────────────────────
const fmtDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
const fmtDateShort = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const daysBetween = (a, b) => Math.ceil((new Date(b) - new Date(a)) / 86400000);

// Center-crop & resize uploaded images via canvas
const resizeImage = (file, maxW = 1200, ratio = 4/5) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const targetW = Math.min(img.width, maxW);
      const targetH = Math.round(targetW / ratio);

      // Calculate center crop from source
      let srcW, srcH, srcX, srcY;
      const srcRatio = img.width / img.height;
      const tgtRatio = ratio;
      if (srcRatio > tgtRatio) {
        // Source is wider → crop sides
        srcH = img.height;
        srcW = Math.round(img.height * tgtRatio);
        srcX = Math.round((img.width - srcW) / 2);
        srcY = 0;
      } else {
        // Source is taller → crop top/bottom
        srcW = img.width;
        srcH = Math.round(img.width / tgtRatio);
        srcX = 0;
        srcY = Math.round((img.height - srcH) / 2);
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetW, targetH);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// ─── Styles ──────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
::-webkit-scrollbar{width:0}
:root{--bg:#ffffff;--card:#ffffff;--text:#2d2d2d;--text2:#999;--accent:#4a9e7e;--accent-light:#4a9e7e12;--border:#f2f2f2;--shadow:0 2px 8px rgba(0,0,0,0.06);--radius:20px;--font:'Nunito',sans-serif}
body{background:var(--bg)}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);position:relative;font-family:var(--font);color:var(--text);overflow-x:hidden}

.header{position:sticky;top:0;z-index:100;background:white;padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px}
.header-back{background:none;border:none;cursor:pointer;color:var(--text);display:flex;align-items:center;padding:4px}
.header-text{flex:1;min-width:0}
.header-title{font-size:18px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.header-title span{font-size:14px;color:var(--accent);margin-left:6px;font-weight:600}
.header-sub{font-size:12px;color:var(--text2);margin-top:1px;font-weight:500}

.home{padding:0 0 40px}
.home-hero{padding:44px 24px 28px;text-align:center}
.home-logo{margin-bottom:14px}
.home-greeting{font-size:15px;font-weight:600;color:var(--text);margin-bottom:4px}
.home-title{font-size:32px;font-weight:800;letter-spacing:-0.5px;line-height:1.1;margin-bottom:6px;color:var(--text)}
.home-subtitle{font-size:13px;color:var(--text2);font-weight:500}

.home-stats{display:flex;gap:8px;margin:0 16px 24px}
.home-stat{flex:1;background:var(--accent-light);border-radius:16px;padding:14px 6px;text-align:center}
.home-stat-n{font-size:24px;font-weight:800;color:var(--accent)}
.home-stat-l{font-size:10px;color:var(--text2);text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;font-weight:600}

.home-section-label{padding:0 20px 14px;font-size:16px;font-weight:700;color:var(--text)}

.trips-grid{padding:0 16px;display:flex;flex-direction:column;gap:14px}
.trip-card{position:relative;border-radius:var(--radius);overflow:hidden;background:white;border:1px solid var(--border);cursor:pointer;transition:transform 0.2s;animation:fadeUp 0.4s ease both}
.trip-card:active{transform:scale(0.98)}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.trip-cover{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}
.trip-overlay{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,0.55) 0%,transparent 50%)}
.trip-info{position:absolute;bottom:0;left:0;right:0;padding:16px 18px;color:white}
.trip-name{font-size:20px;font-weight:700;line-height:1.2;margin-bottom:3px}
.trip-dest{font-size:12px;opacity:0.9;font-weight:500;display:flex;align-items:center;gap:5px}
.trip-meta{position:absolute;top:12px;right:12px;display:flex;gap:6px}
.trip-badge{background:white;padding:4px 10px;border-radius:20px;font-size:11px;color:var(--text);font-weight:600;display:flex;align-items:center;gap:4px}
.trip-dot{width:6px;height:6px;border-radius:50%;display:inline-block}
.new-trip-btn{margin:16px 16px 0;padding:16px;border:none;border-radius:var(--radius);background:var(--accent);cursor:pointer;width:calc(100% - 32px);display:flex;align-items:center;justify-content:center;gap:8px;color:white;font-family:var(--font);font-size:15px;font-weight:700;transition:opacity 0.2s}
.new-trip-btn:active{opacity:0.85}

.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:white;border-top:1px solid var(--border);display:flex;justify-content:space-around;align-items:center;padding:6px 0 calc(6px + env(safe-area-inset-bottom));z-index:200}
.nav-item{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 14px;border:none;background:none;cursor:pointer;color:var(--text2);transition:color 0.2s;font-family:var(--font);font-size:10px;font-weight:600}
.nav-item.active{color:var(--accent)}
.nav-add{width:48px;height:48px;border-radius:50%;background:var(--accent);color:white;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.2s}
.nav-add:active{transform:scale(0.92)}

.feed{padding:14px 16px 100px;display:flex;flex-direction:column;gap:16px}
.post-card{background:white;border-radius:var(--radius);overflow:hidden;border:1px solid var(--border);transition:transform 0.2s;animation:fadeUp 0.4s ease both;cursor:pointer}
.post-card:active{transform:scale(0.985)}
.post-img-wrap{position:relative;width:100%;aspect-ratio:4/5;overflow:hidden;background:#f5f5f5}
.post-img{width:100%;height:100%;object-fit:cover}
.post-badge{position:absolute;top:12px;left:12px;background:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;display:flex;align-items:center;gap:4px}
.post-body{padding:14px 16px 16px}
.post-loc{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--accent);font-weight:600;margin-bottom:5px}
.post-title{font-size:18px;font-weight:700;line-height:1.3;margin-bottom:6px}
.post-desc{font-size:13px;line-height:1.6;color:var(--text2);font-weight:500}
.post-footer{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)}
.post-date{font-size:12px;color:var(--text2);font-weight:500}
.post-like{display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;color:var(--text2);font-size:13px;font-family:var(--font);font-weight:600;padding:4px}
.post-like.liked{color:var(--accent)}
.food-rating{display:flex;gap:2px;margin-top:6px}
.dish-tag{display:inline-block;margin-top:6px;padding:4px 10px;background:var(--accent-light);border-radius:10px;font-size:12px;color:var(--accent);font-weight:600}

.map-container{padding:0 0 100px}
.map-box{margin:16px;height:calc(100vh - 240px);min-height:300px;background:#f7f7f7;border-radius:var(--radius);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.map-dot{position:absolute;width:12px;height:12px;background:var(--accent);border-radius:50%;border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.15);cursor:pointer;z-index:2}
.map-dot::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:var(--accent);opacity:0.15;animation:ping 2s ease-out infinite}
@keyframes ping{0%{transform:scale(1);opacity:0.3}100%{transform:scale(2.5);opacity:0}}
.map-label{position:absolute;background:white;padding:4px 8px;border-radius:8px;font-size:10px;font-weight:600;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.08);pointer-events:none;transform:translate(-50%,-130%);z-index:3}
.map-svg{position:absolute;inset:0;z-index:1}
.city-list{padding:12px 16px;display:flex;flex-direction:column;gap:8px}
.city-card{display:flex;align-items:center;gap:12px;padding:14px 16px;background:white;border-radius:14px;border:1px solid var(--border);animation:fadeUp 0.3s ease both}
.city-dot{width:8px;height:8px;background:var(--accent);border-radius:50%;flex-shrink:0}
.city-name{font-size:15px;font-weight:600}
.city-count{margin-left:auto;font-size:12px;color:var(--text2);font-weight:600}

.food-page{padding:14px 16px 100px}
.food-stats{display:flex;gap:8px;margin-bottom:18px}
.food-stat{flex:1;background:var(--accent-light);border-radius:14px;padding:14px;text-align:center}
.food-stat-n{font-size:24px;font-weight:800;color:var(--accent)}
.food-stat-l{font-size:10px;color:var(--text2);text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;font-weight:600}
.food-list{display:flex;flex-direction:column;gap:12px}
.food-card{display:flex;gap:12px;background:white;border-radius:16px;overflow:hidden;border:1px solid var(--border);animation:fadeUp 0.3s ease both;cursor:pointer}
.food-card-img{width:100px;min-height:100px;object-fit:cover;flex-shrink:0}
.food-card-body{padding:12px 14px 12px 0;display:flex;flex-direction:column;justify-content:center}
.food-card-dish{font-size:15px;font-weight:700;margin-bottom:3px}
.food-card-loc{font-size:12px;color:var(--text2);margin-bottom:4px;font-weight:500}

.detail{position:fixed;inset:0;background:white;z-index:250;overflow-y:auto;animation:fadeIn 0.25s ease}
.detail .app{max-width:430px;margin:0 auto}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.detail-back{position:fixed;top:14px;left:50%;transform:translateX(min(-50%,calc(-215px + 16px)));z-index:260;width:36px;height:36px;background:white;border:none;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,0.1)}
.detail-img{width:100%;aspect-ratio:3/4;object-fit:cover}
.detail-body{padding:20px 20px 40px}
.detail-meta{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.detail-title{font-size:24px;font-weight:700;line-height:1.25;margin-bottom:12px}
.detail-desc{font-size:14px;line-height:1.7;color:#666;font-weight:500}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:300;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.15s ease}
.modal{width:100%;max-width:430px;background:white;border-radius:20px 20px 0 0;padding:20px 20px calc(24px + env(safe-area-inset-bottom));max-height:88vh;overflow-y:auto;animation:slideUp 0.25s ease}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal-handle{width:36px;height:4px;background:#e0e0e0;border-radius:2px;margin:0 auto 16px}
.modal-title{font-size:20px;font-weight:700;margin-bottom:20px;text-align:center}
.fg{margin-bottom:14px}
.fl{display:block;font-size:12px;font-weight:700;color:var(--text2);margin-bottom:6px}
.fi,.ft,.fs{width:100%;padding:12px 14px;border:1.5px solid var(--border);border-radius:12px;font-size:14px;font-family:var(--font);color:var(--text);background:#fafafa;transition:border-color 0.2s;outline:none}
.fi:focus,.ft:focus,.fs:focus{border-color:var(--accent)}
.ft{min-height:80px;resize:vertical}
.fr{display:flex;gap:10px}
.fr>*{flex:1}
.photo-btn{width:100%;padding:24px;border:2px dashed #e0e0e0;border-radius:14px;background:#fafafa;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--text2);font-family:var(--font);font-size:13px;font-weight:600}
.photo-btn:hover{border-color:var(--accent);color:var(--accent)}
.photo-preview{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:14px;cursor:pointer}
.submit-btn{width:100%;padding:14px;border:none;border-radius:14px;background:var(--accent);color:white;font-family:var(--font);font-size:15px;font-weight:700;cursor:pointer;margin-top:8px}
.submit-btn:active{opacity:0.85}
.rating-sel{display:flex;gap:4px}
.rating-sel button{background:none;border:none;cursor:pointer;padding:2px}
.type-btn{flex:1;padding:10px;border-radius:12px;font-family:var(--font);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 40px;text-align:center;color:var(--text2)}
.empty-icon{margin-bottom:16px;opacity:0.25}
.empty-title{font-size:18px;font-weight:700;color:var(--text);margin-bottom:6px}
.empty-desc{font-size:13px;line-height:1.6;font-weight:500}
.toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:var(--text);color:white;padding:10px 20px;border-radius:12px;font-size:13px;font-family:var(--font);font-weight:600;z-index:400;animation:toastIn 0.25s ease,toastOut 0.25s ease 2s forwards;white-space:nowrap}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes toastOut{from{opacity:1}to{opacity:0}}

.delete-btn{background:none;border:none;cursor:pointer;color:var(--text2);padding:6px;border-radius:8px;transition:color 0.2s;display:flex;align-items:center;justify-content:center}
.delete-btn:hover{color:#e55}
.confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:350;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.15s ease;padding:24px}
.confirm-box{background:white;border-radius:20px;padding:28px 24px 20px;max-width:300px;width:100%;text-align:center;animation:slideUp 0.2s ease}
.confirm-title{font-size:18px;font-weight:700;margin-bottom:6px}
.confirm-desc{font-size:13px;color:var(--text2);line-height:1.5;margin-bottom:18px;font-weight:500}
.confirm-actions{display:flex;gap:10px}
.confirm-cancel{flex:1;padding:12px;border:1.5px solid var(--border);border-radius:12px;background:none;font-family:var(--font);font-size:13px;font-weight:600;cursor:pointer;color:var(--text)}
.confirm-delete{flex:1;padding:12px;border:none;border-radius:12px;background:#e55;color:white;font-family:var(--font);font-size:13px;font-weight:700;cursor:pointer}
.confirm-delete:active{opacity:0.85}
.trip-delete{position:absolute;top:12px;left:12px;z-index:5;width:30px;height:30px;background:white;border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text2);opacity:0;transition:opacity 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.1)}
.trip-card:hover .trip-delete,.trip-card:active .trip-delete{opacity:1}
.detail-delete{position:fixed;top:14px;right:50%;transform:translateX(min(50%,calc(215px - 16px)));z-index:260;width:36px;height:36px;background:white;border:none;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,0.1);color:var(--text2)}
.detail-delete:hover{color:#e55}
`;

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function ConfirmDialog({ title, description, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-desc">{description}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>Annuler</button>
          <button className="confirm-delete" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, onClick, onLike, liked, delay = 0 }) {
  return (
    <div className="post-card" style={{ animationDelay: `${delay}ms` }} onClick={onClick}>
      <div className="post-img-wrap">
        <img className="post-img" src={post.image} alt={post.title} loading="lazy" />
        <div className="post-badge">{post.type === "food" ? "🍜 Food" : "📍 Lieu"}</div>
      </div>
      <div className="post-body">
        <div className="post-loc"><I.Pin /> {post.location}</div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-desc">{post.description.length > 120 ? post.description.slice(0, 120) + "…" : post.description}</p>
        {post.type === "food" && post.rating && (
          <div className="food-rating">{[1,2,3,4,5].map(s=><I.Star key={s} filled={s<=post.rating}/>)}</div>
        )}
        {post.dish && <span className="dish-tag">{post.dish}</span>}
        <div className="post-footer">
          <span className="post-date">{fmtDate(post.date)}</span>
          <button className={`post-like ${liked?"liked":""}`} onClick={e=>{e.stopPropagation();onLike(post.id)}}>
            <I.Heart filled={liked}/> {post.likes + (liked ? 1 : 0)}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailView({ post, onBack, liked, onLike, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  if (!post) return null;
  return (
    <div className="detail">
      <div className="app">
        <button className="detail-back" onClick={onBack}><I.Back /></button>
        <button className="detail-delete" onClick={() => setShowConfirm(true)}><I.Trash /></button>
        <img className="detail-img" src={post.image} alt={post.title} />
        <div className="detail-body">
          <div className="detail-meta">
            <span className="post-badge" style={{ position: "static" }}>{post.type === "food" ? "🍜 Food" : "📍 Lieu"}</span>
            <span className="post-date">{fmtDate(post.date)}</span>
          </div>
          <h2 className="detail-title">{post.title}</h2>
          <div className="post-loc" style={{ marginBottom: 16 }}><I.Pin /> {post.location}</div>
          <p className="detail-desc">{post.description}</p>
          {post.type === "food" && post.rating && (
            <div className="food-rating" style={{ marginTop: 16 }}>{[1,2,3,4,5].map(s=><I.Star key={s} filled={s<=post.rating}/>)}</div>
          )}
          {post.dish && <span className="dish-tag" style={{ marginTop: 12 }}>{post.dish}</span>}
          <div style={{ marginTop: 20 }}>
            <button className={`post-like ${liked?"liked":""}`} onClick={()=>onLike(post.id)}>
              <I.Heart filled={liked}/> {post.likes + (liked ? 1 : 0)}
            </button>
          </div>
        </div>
      </div>
      {showConfirm && (
        <ConfirmDialog
          title="Supprimer ce post ?"
          description="Cette action est irréversible. Le post sera définitivement supprimé de ce voyage."
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => { setShowConfirm(false); onDelete(post.id); }}
        />
      )}
    </div>
  );
}

function MapView({ posts, tripColor }) {
  const cities = useMemo(() => {
    const c = {};
    posts.forEach(p => {
      const city = p.location.split(",").pop().trim();
      if (!c[city]) c[city] = { posts: [], lat: p.lat, lng: p.lng };
      c[city].posts.push(p);
    });
    return c;
  }, [posts]);

  if (posts.length === 0) return (
    <div className="map-container"><div className="empty" style={{ minHeight: "60vh" }}>
      <div className="empty-icon"><I.Map /></div>
      <div className="empty-title">Aucun lieu encore</div>
      <div className="empty-desc">Ajoute ton premier post pour voir la carte s'animer.</div>
    </div></div>
  );

  const allLats = posts.map(p => p.lat);
  const allLngs = posts.map(p => p.lng);
  const pad = 2;
  const bounds = {
    minLat: Math.min(...allLats) - pad, maxLat: Math.max(...allLats) + pad,
    minLng: Math.min(...allLngs) - pad, maxLng: Math.max(...allLngs) + pad,
  };
  const toPos = (lat, lng) => ({
    x: ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * 76 + 12,
    y: ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat || 1)) * 76 + 12,
  });

  const entries = Object.entries(cities);
  const pts = entries.map(([n, d]) => ({ name: n, ...toPos(d.lat, d.lng), count: d.posts.length }));

  return (
    <div className="map-container">
      <div className="map-box">
        <svg className="map-svg" viewBox="0 0 100 100" fill="none">
          {pts.length > 1 && <polyline points={pts.map(p=>`${p.x},${p.y}`).join(" ")} stroke={tripColor||"var(--accent)"} strokeWidth="0.4" strokeDasharray="2 2" opacity="0.4"/>}
        </svg>
        {pts.map((p,i)=>(
          <div key={p.name}>
            <div className="map-dot" style={{ left:`${p.x}%`, top:`${p.y}%`, background: tripColor||"var(--accent)", animationDelay:`${i*200}ms` }}/>
            <div className="map-label" style={{ left:`${p.x}%`, top:`${p.y}%` }}>{p.name}</div>
          </div>
        ))}
      </div>
      <div className="city-list">
        {entries.map(([name, data], i)=>(
          <div key={name} className="city-card" style={{ animationDelay:`${i*80}ms` }}>
            <div className="city-dot" style={{ background: tripColor||"var(--accent)" }}/>
            <span className="city-name">{name}</span>
            <span className="city-count">{data.posts.length} post{data.posts.length>1?"s":""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FoodView({ posts, onSelect }) {
  const food = posts.filter(p => p.type === "food");
  const avg = food.length ? (food.reduce((s,p)=>s+(p.rating||0),0)/food.length) : 0;
  const cityCount = new Set(food.map(p=>p.location.split(",").pop().trim())).size;

  if (food.length === 0) return (
    <div className="food-page"><div className="empty">
      <div className="empty-icon"><I.Food /></div>
      <div className="empty-title">Pas encore de plats</div>
      <div className="empty-desc">Poste ta première découverte culinaire !</div>
    </div></div>
  );

  return (
    <div className="food-page">
      <div className="food-stats">
        <div className="food-stat"><div className="food-stat-n">{food.length}</div><div className="food-stat-l">Plats</div></div>
        <div className="food-stat"><div className="food-stat-n">{avg.toFixed(1)}</div><div className="food-stat-l">Moyenne</div></div>
        <div className="food-stat"><div className="food-stat-n">{cityCount}</div><div className="food-stat-l">Villes</div></div>
      </div>
      <div className="food-list">
        {food.map((p,i)=>(
          <div key={p.id} className="food-card" style={{ animationDelay:`${i*80}ms` }} onClick={()=>onSelect(p)}>
            <img className="food-card-img" src={p.image} alt={p.dish} loading="lazy"/>
            <div className="food-card-body">
              <div className="food-card-dish">{p.dish||p.title}</div>
              <div className="food-card-loc">{p.location}</div>
              {p.rating && <div className="food-rating">{[1,2,3,4,5].map(s=><I.Star key={s} filled={s<=p.rating}/>)}</div>}
              <span className="post-date" style={{ marginTop: 4 }}>{fmtDate(p.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Post Modal ──────────────────────────────────────────────
function PostModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ type:"place", title:"", location:"", description:"", image:"", dish:"", rating:0 });
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file, 1200, 4/5);
      setPreview(resized);
      set("image", resized);
    }
  };
  const submit = () => {
    if (!form.title || !form.location) return;
    onSubmit({ ...form, id: Date.now(), date: new Date().toISOString().split("T")[0], likes: 0,
      lat: 35+Math.random()*5, lng: 105+Math.random()*15,
      image: form.image || "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80"
    });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <h2 className="modal-title">Nouveau post</h2>
        <div className="fg">
          <label className="fl">Type</label>
          <div style={{ display:"flex", gap: 8 }}>
            {["place","food"].map(t=>(
              <button key={t} className="type-btn" onClick={()=>set("type",t)}
                style={{ border:`1.5px solid ${form.type===t?"var(--accent)":"var(--border)"}`,
                  background: form.type===t?"var(--accent-light)":"var(--bg)",
                  color: form.type===t?"var(--accent)":"var(--text2)" }}>
                {t==="place"?"📍 Lieu":"🍜 Food"}
              </button>
            ))}
          </div>
        </div>
        <div className="fg">
          <label className="fl">Photo</label>
          <input type="file" accept="image/*" ref={fileRef} hidden onChange={handlePhoto}/>
          {preview ? <img src={preview} alt="" className="photo-preview" style={{ aspectRatio: "4/5" }} onClick={()=>fileRef.current.click()}/> :
            <button className="photo-btn" onClick={()=>fileRef.current.click()}><I.Camera/> Ajouter une photo</button>}
        </div>
        <div className="fg"><label className="fl">Titre</label><input className="fi" placeholder="Ex: Lever de soleil sur la muraille" value={form.title} onChange={e=>set("title",e.target.value)}/></div>
        <div className="fg"><label className="fl">Lieu</label><input className="fi" placeholder="Ex: Mutianyu, Beijing" value={form.location} onChange={e=>set("location",e.target.value)}/></div>
        <div className="fg"><label className="fl">Description</label><textarea className="ft" placeholder="Raconte ton expérience…" value={form.description} onChange={e=>set("description",e.target.value)}/></div>
        {form.type==="food"&&<>
          <div className="fg"><label className="fl">Nom du plat</label><input className="fi" placeholder="Ex: Xiaolongbao (小笼包)" value={form.dish} onChange={e=>set("dish",e.target.value)}/></div>
          <div className="fg"><label className="fl">Note</label><div className="rating-sel">{[1,2,3,4,5].map(s=><button key={s} onClick={()=>set("rating",s)}><I.Star filled={s<=form.rating}/></button>)}</div></div>
        </>}
        <button className="submit-btn" onClick={submit}>Publier →</button>
      </div>
    </div>
  );
}

// ─── Trip Modal ──────────────────────────────────────────────
const COLORS = ["#c0392b","#d4556b","#2e7d5e","#2874a6","#8e44ad","#d68910","#1a1a2e"];
function TripModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name:"", destination:"", subtitle:"", startDate:"", endDate:"", color: COLORS[0] });
  const [preview, setPreview] = useState(null);
  const [coverData, setCoverData] = useState("");
  const fileRef = useRef();
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handleCover = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file, 1200, 16/10);
      setPreview(resized);
      setCoverData(resized);
    }
  };
  const submit = () => {
    if (!form.name || !form.destination) return;
    onSubmit({
      ...form,
      id: "trip-" + Date.now(),
      cover: coverData || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
    });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <h2 className="modal-title">Nouveau voyage</h2>
        <div className="fg">
          <label className="fl">Photo de couverture</label>
          <input type="file" accept="image/*" ref={fileRef} hidden onChange={handleCover}/>
          {preview ? <img src={preview} alt="" className="photo-preview" style={{ aspectRatio: "16/10" }} onClick={()=>fileRef.current.click()}/> :
            <button className="photo-btn" onClick={()=>fileRef.current.click()}><I.Camera/> Choisir une photo</button>}
        </div>
        <div className="fg"><label className="fl">Nom du voyage</label><input className="fi" placeholder="Ex: Road trip au Japon" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
        <div className="fg"><label className="fl">Sous-titre (optionnel)</label><input className="fi" placeholder="Ex: 日本の旅" value={form.subtitle} onChange={e=>set("subtitle",e.target.value)}/></div>
        <div className="fg"><label className="fl">Destination</label><input className="fi" placeholder="Ex: Japon" value={form.destination} onChange={e=>set("destination",e.target.value)}/></div>
        <div className="fr">
          <div className="fg"><label className="fl">Début</label><input className="fi" type="date" value={form.startDate} onChange={e=>set("startDate",e.target.value)}/></div>
          <div className="fg"><label className="fl">Fin</label><input className="fi" type="date" value={form.endDate} onChange={e=>set("endDate",e.target.value)}/></div>
        </div>
        <div className="fg">
          <label className="fl">Couleur</label>
          <div style={{ display:"flex", gap: 8 }}>
            {COLORS.map(c=>(
              <button key={c} onClick={()=>set("color",c)} style={{
                width: 32, height: 32, borderRadius: "50%", background: c,
                border: form.color===c ? "3px solid var(--text)" : "3px solid transparent",
                cursor: "pointer", transition: "border 0.2s",
              }}/>
            ))}
          </div>
        </div>
        <button className="submit-btn" onClick={submit}>Créer le voyage →</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("home");
  const [trips, setTrips] = useState(DEMO_TRIPS);
  const [allPosts, setAllPosts] = useState(DEMO_POSTS);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tab, setTab] = useState("feed");
  const [liked, setLiked] = useState(new Set());
  const [detail, setDetail] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { type: 'trip', id } 

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null), 2500); };
  const toggleLike = useCallback(id => setLiked(prev => { const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; }), []);

  const openTrip = trip => { setCurrentTrip(trip); setTab("feed"); setScreen("trip"); };
  const goHome = () => { setScreen("home"); setCurrentTrip(null); };

  const tripPosts = currentTrip ? (allPosts[currentTrip.id] || []) : [];

  const addPost = post => {
    setAllPosts(prev => ({
      ...prev,
      [currentTrip.id]: [post, ...(prev[currentTrip.id] || [])],
    }));
    setShowPostModal(false);
    setTab("feed");
    showToast("Post publié ! 🎉");
  };

  const deletePost = (postId) => {
    setAllPosts(prev => ({
      ...prev,
      [currentTrip.id]: (prev[currentTrip.id] || []).filter(p => p.id !== postId),
    }));
    setDetail(null);
    showToast("Post supprimé");
  };

  const deleteTrip = (tripId) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    setAllPosts(prev => { const next = { ...prev }; delete next[tripId]; return next; });
    setConfirmDelete(null);
    showToast("Voyage supprimé");
  };

  const addTrip = trip => {
    setTrips(prev => [trip, ...prev]);
    setAllPosts(prev => ({ ...prev, [trip.id]: [] }));
    setShowTripModal(false);
    showToast("Voyage créé ! ✈️");
  };

  // ── HOME ──
  if (screen === "home") {
    return (
      <>
        <style>{css}</style>
        <div className="app">
          <div className="home">
            <div className="home-hero">
              <div className="home-logo"><I.Compass /></div>
              <p className="home-greeting">{(() => {
                const h = new Date().getHours();
                if (h < 6) return "Bonne nuit, explorateur \u{1F319}";
                if (h < 12) return "Bonjour, explorateur \u{2600}\u{FE0F}";
                if (h < 18) return "Bon après-midi, explorateur \u{1F30D}";
                return "Bonsoir, explorateur \u{2728}";
              })()}</p>
              <p className="home-subtitle">Vos voyages, votre histoire</p>
            </div>

            <div className="home-stats">
              <div className="home-stat">
                <div className="home-stat-n">{trips.length}</div>
                <div className="home-stat-l">Voyages</div>
              </div>
              <div className="home-stat">
                <div className="home-stat-n">{Object.values(allPosts).reduce((s, p) => s + p.length, 0)}</div>
                <div className="home-stat-l">Posts</div>
              </div>
              <div className="home-stat">
                <div className="home-stat-n">{new Set(Object.values(allPosts).flat().map(p => p.location.split(",").pop().trim())).size}</div>
                <div className="home-stat-l">Villes</div>
              </div>
              <div className="home-stat">
                <div className="home-stat-n">{Object.values(allPosts).flat().filter(p => p.type === "food").length}</div>
                <div className="home-stat-l">Plats</div>
              </div>
            </div>

            <div className="home-section-label">Mes voyages</div>

            <div className="trips-grid">
              {trips.map((trip, i) => {
                const posts = allPosts[trip.id] || [];
                const days = trip.startDate && trip.endDate ? daysBetween(trip.startDate, trip.endDate) : null;
                return (
                  <div key={trip.id} className="trip-card" style={{ animationDelay: `${i * 100}ms` }} onClick={() => openTrip(trip)}>
                    <button className="trip-delete" onClick={e => { e.stopPropagation(); setConfirmDelete({ type:"trip", id: trip.id, name: trip.name }); }}><I.Trash /></button>
                    <img className="trip-cover" src={trip.cover} alt={trip.name} loading="lazy" />
                    <div className="trip-overlay" />
                    <div className="trip-meta">
                      <div className="trip-badge"><span className="trip-dot" style={{ background: trip.color }} /> {posts.length} posts</div>
                      {days && <div className="trip-badge"><I.Calendar /> {days}j</div>}
                    </div>
                    <div className="trip-info">
                      <div className="trip-name">{trip.name}</div>
                      <div className="trip-dest"><I.Pin /> {trip.destination}{trip.startDate && <> · {fmtDateShort(trip.startDate)}</>}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="new-trip-btn" onClick={() => setShowTripModal(true)}><I.Plus /> Nouveau voyage</button>
          </div>
          {showTripModal && <TripModal onClose={() => setShowTripModal(false)} onSubmit={addTrip} />}
          {confirmDelete && confirmDelete.type === "trip" && (
            <ConfirmDialog
              title="Supprimer ce voyage ?"
              description={`"${confirmDelete.name}" et tous ses posts seront définitivement supprimés.`}
              onCancel={() => setConfirmDelete(null)}
              onConfirm={() => deleteTrip(confirmDelete.id)}
            />
          )}
          {toast && <div className="toast">{toast}</div>}
        </div>
      </>
    );
  }

  // ── TRIP ──
  const accent = currentTrip?.color || "#c0392b";
  const accentStyle = { "--accent": accent, "--accent-light": accent + "12" };

  return (
    <>
      <style>{css}</style>
      <div className="app" style={accentStyle}>
        <div className="header">
          <button className="header-back" onClick={goHome}><I.Back /></button>
          <div className="header-text">
            <h1 className="header-title">
              {currentTrip.name}
              {currentTrip.subtitle && <span>{currentTrip.subtitle}</span>}
            </h1>
            <p className="header-sub">
              {currentTrip.destination}
              {currentTrip.startDate && <> · {fmtDateShort(currentTrip.startDate)}</>}
            </p>
          </div>
        </div>

        {tab === "feed" && (
          tripPosts.length === 0 ? (
            <div className="feed"><div className="empty">
              <div className="empty-icon"><I.Camera /></div>
              <div className="empty-title">Pas encore de posts</div>
              <div className="empty-desc">Appuie sur + pour partager ta première découverte.</div>
            </div></div>
          ) : (
            <div className="feed">
              {tripPosts.map((post, i) => (
                <PostCard key={post.id} post={post} delay={i * 100} liked={liked.has(post.id)} onLike={toggleLike} onClick={() => setDetail(post)} />
              ))}
            </div>
          )
        )}

        {tab === "map" && <MapView posts={tripPosts} tripColor={accent} />}
        {tab === "food" && <FoodView posts={tripPosts} onSelect={setDetail} />}

        <nav className="nav">
          <button className={`nav-item ${tab==="feed"?"active":""}`} onClick={()=>setTab("feed")}><I.Feed /> FEED</button>
          <button className={`nav-item ${tab==="map"?"active":""}`} onClick={()=>setTab("map")}><I.Map /> CARTE</button>
          <button className="nav-add" style={{ background: accent, boxShadow: `0 2px 12px ${accent}40` }} onClick={()=>setShowPostModal(true)}><I.Plus /></button>
          <button className={`nav-item ${tab==="food"?"active":""}`} onClick={()=>setTab("food")}><I.Food /> FOOD</button>
          <button className="nav-item" onClick={goHome}><I.Globe /> TRIPS</button>
        </nav>

        {detail && <DetailView post={detail} onBack={()=>setDetail(null)} liked={liked.has(detail.id)} onLike={toggleLike} onDelete={deletePost}/>}
        {showPostModal && <PostModal onClose={()=>setShowPostModal(false)} onSubmit={addPost}/>}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
