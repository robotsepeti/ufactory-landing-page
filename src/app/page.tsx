"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Menu, X, ChevronRight, CheckCircle2,
  Cpu, Code, Globe, Settings, Shield,
  ShoppingBag, Briefcase, ArrowLeft, Play,
  Activity, Lock, Target, Server, Crosshair
} from 'lucide-react';

/* ============================================
   CountUp: animates a number from 0 → target
   Pulls the leading number out of Turkish values like "5,0 kg" or "±0,02 mm"
   ============================================ */
const CountUp = ({ value, duration = 1400 }: { value: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(value);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const match = value.match(/^(\D*)(-?[\d.,±]+)(.*)$/);
    if (!match) return;
    const prefix = match[1] ?? '';
    const numberText = (match[2] ?? '').replace(/±/g, '');
    const raw = numberText.replace(/\./g, '').replace(',', '.');
    const suffix = match[3] ?? '';
    const target = parseFloat(raw);
    if (!isFinite(target)) return;
    const hasPlusMinus = match[2].includes('±');
    const decimals = (raw.split('.')[1] || '').length;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = target * eased;
        const formatted = current.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        const text = `${prefix}${hasPlusMinus ? '±' : ''}${formatted}${suffix}`;
        setDisplay(text);
        if (t < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.4 });

    obs.observe(node);
    return () => obs.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
};

/* ============================================
   Magnetic: pulls a button slightly toward the cursor
   ============================================ */
const Magnetic = ({ children, strength = 0.25, className = '' }: { children: React.ReactNode; strength?: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    node.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <span ref={ref} className={`magnetic ${className}`} onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </span>
  );
};

/* ============================================
   Tilt: 3D hover-tilt for cards
   ============================================ */
const useTilt = (max = 8) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 2 * max;
    const rotateX = -(py - 0.5) * 2 * max;
    node.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    node.style.setProperty('--mx', `${px * 100}%`);
    node.style.setProperty('--my', `${py * 100}%`);
  };

  const reset = () => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
  };

  return { ref, onMove, reset };
};

/* ============================================
   TiltCard: convenient wrapper using useTilt
   ============================================ */
const TiltCard = ({
  children,
  className = '',
  style,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) => {
  const { ref, onMove, reset } = useTilt(6);
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
      onKeyDown={onClick ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={style}
      className={`tilt-card relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ${className}`}
    >
      {children}
      <span className="tilt-shine" />
    </div>
  );
};

/* ============================================
   ImageBlurUp: image that loads blurred then sharpens
   ============================================ */
const ImageBlurUp = ({
  src, alt, className = '', draggable,
}: { src: string; alt: string; className?: string; draggable?: boolean }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // Önbellekten gelen görsellerde onLoad hidrasyondan önce tetiklenebilir; bu durumda da netleştir
  useEffect(() => {
    const node = imgRef.current;
    if (node && node.complete && node.naturalWidth > 0) setLoaded(true);
  }, [src]);
  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      draggable={draggable}
      onLoad={() => setLoaded(true)}
      className={`img-blur-up ${loaded ? 'is-loaded' : ''} ${className}`}
    />
  );
};

/* ============================================
   Reveal: scroll-triggered fade + slide-up
   ============================================ */
type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';

const Reveal = ({
  children,
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  once = true,
  threshold = 0.15,
}: {
  children: React.ReactNode;
  as?: React.ElementType;
  variant?: RevealVariant;
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  once?: boolean;
  threshold?: number;
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [once, threshold]);

  const variantClass = `reveal-${variant}`;
  const delayClass = delay ? `reveal-delay-${delay}` : '';

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`reveal ${variantClass} ${delayClass} ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
};

interface Product {
  id: string;
  name: string;
  tagline: string;
  image: string;
  videoBg?: string;
  gallery?: string[];
  url: string;
  description: string;
  price?: string;
  specs: Record<string, string>;
  features?: string[];
  badge?: string;
  color: string;
  variants?: {
    name: string;
    desc: string;
    url: string;
    price?: string;
    galleryIndex?: number;
    specs?: Record<string, string>;
  }[];
}

const CORPORATE_EMAIL = 'kurumsal@robotsepeti.com';
const WHATSAPP_NUMBER = '905426976214';
const WHATSAPP_DISPLAY = '+90 542 697 62 14';

/* WhatsApp logosu (resmi logo formunda, satır içi SVG) */
const WhatsAppIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.5 9.5 0 0 1-4.84-1.33l-.35-.21-3.6.94.96-3.5-.23-.36a9.46 9.46 0 0 1-1.45-5.05c0-5.24 4.27-9.5 9.52-9.5 2.54 0 4.93.99 6.72 2.79a9.43 9.43 0 0 1 2.78 6.72c0 5.24-4.27 9.5-9.5 9.5zm8.09-17.6A11.37 11.37 0 0 0 12.05.55C5.73.55.6 5.68.6 12c0 2.02.53 3.99 1.53 5.72L.5 23.45l5.87-1.54a11.4 11.4 0 0 0 5.67 1.45h.01c6.31 0 11.45-5.13 11.45-11.45 0-3.06-1.19-5.94-3.36-8.1z"/>
  </svg>
);

const gmailLink = (subject: string, body: string) =>
  'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(CORPORATE_EMAIL) +
  '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

const quoteMailLink = (product: Product, variantIndex: number) => {
  const variant = product.variants?.[variantIndex];
  const model = variant ? `${variant.name} (${variant.desc})` : '-';
  const subject = `Teklif talebi: ${product.name}${variant ? ' — ' + variant.name : ''}`;
  const body =
    'Merhaba,\n\n' +
    'Aşağıdaki ürün için fiyat teklifi almak istiyorum.\n\n' +
    `Ürün: ${product.name}\n` +
    `Model: ${model}\n` +
    (variant?.url || product.url ? `Ürün bağlantısı: ${variant?.url || product.url}\n` : '') +
    '\nAdet:\nFirma adı:\nAd soyad:\nTelefon:\n\nTeşekkürler.';
  return gmailLink(subject, body);
};

const HERO_VIDEOS = ['/videos/xarm.mp4', '/videos/lite6.mp4', '/videos/850_small.mp4'];

const TIMELINE_DATA = [
  { year: 'uArm', title: 'Konveyör ve kızak sistemleri', desc: 'Konveyör, nesneleri robotun önüne taşıyan bant sistemidir. Slider ise robot koluna yatay hareket sağlayan kızaktır. İki sistem ayrı ürünlerdir; uArm robot kolu ürünlere dâhil değildir.' },
  { year: 'xArm', title: '5, 6 ve 7 eksenli robot kolları', desc: 'xArm 5 Lite, xArm 6 ve xArm 7 sırasıyla 3 kg, 5 kg ve 3,5 kg taşıma kapasitesi sunar. Eklem sayısı ve çalışma alanı, uygulamanın hareket gereksinimlerine göre seçilir.' },
  { year: 'Lite6', title: 'Kompakt altı eksenli robot kolu', desc: '600 g taşıma kapasitesi ve 440 mm erişimiyle masaüstü montaj, eğitim ve araştırma görevleri için kullanılabilir. Elektrikli Gripper Lite ve Vacuum Lite aksesuarlarıyla desteklenir.' },
  { year: '850', title: '850 mm erişim ve 5 kg taşıma kapasitesi', desc: 'UFACTORY 850, daha uzun erişim gereken montaj ve parça taşıma uygulamaları için altı eksenli bir seçenektir. Kontrolcü, uç işleyici ve bağlantı seçenekleri sipariş kapsamına göre belirlenir.' },
];

const TimelineItem = ({ data, index }: { data: typeof TIMELINE_DATA[0], index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, rootMargin: '100px' });
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div ref={domRef} className="mb-12 md:mb-24 flex md:justify-between items-start md:items-center w-full flex-col md:flex-row relative">
      {/* Mobile Timeline Line */}
      <div className="absolute left-[19px] top-0 bottom-[-48px] w-[2px] bg-gradient-to-b from-orange-500/50 to-transparent md:hidden"></div>
      
      {/* Empty space for alternating layout on desktop */}
      <div className={`hidden md:block w-5/12 ${isEven ? 'md:order-3' : 'md:order-1'}`}></div>
      
      {/* Center Node */}
      <div className={`z-20 flex items-center justify-center order-1 md:order-2 w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-white bg-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-[opacity,transform,box-shadow] duration-700 mb-4 md:mb-0 shrink-0 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className={`w-3 h-3 md:w-6 md:h-6 rounded-full bg-white transition-transform duration-1000 delay-300 ${isVisible ? 'scale-100' : 'scale-0'}`}></div>
      </div>
      
      {/* Content Box */}
      <div className={`order-2 ${isEven ? 'md:order-1 text-right' : 'md:order-3 text-left'} w-[calc(100%-3.5rem)] ml-14 md:w-5/12 md:ml-0 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-200/50 transition-[opacity,transform,box-shadow] duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-y-12 ' + (isEven ? 'md:-translate-x-16' : 'translate-x-0 md:translate-x-16')}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-t-3xl opacity-50"></div>
        <h3 className="font-black text-orange-500 text-3xl md:text-5xl mb-2 tracking-tight">{data.year}</h3>
        <h4 className="font-bold text-slate-900 text-xl md:text-2xl mb-3">{data.title}</h4>
        <p className="text-sm md:text-base leading-relaxed text-slate-600">{data.desc}</p>
      </div>
    </div>
  );
};

// Ürün veritabanı — tüm bağlantılar doğrudan RobotSepeti ürün sayfalarına gider.
// Görseller RobotSepeti ürün sayfalarından alınmıştır (public/images/products/rs-*).
const RS = 'https://www.robotsepeti.com/';
const img = (name: string) => `/images/products/rs-${name}`;
const products: Record<'xarm' | 'lite' | 'accessories' | 'uarm', Product[]> = {
  xarm: [
    {
      id: 'xarm7',
      name: 'UFACTORY xArm 7',
      tagline: '7 eksenli kinematik artıklık',
      image: img('xarm7-1.webp'),
      gallery: [img('xarm7-1.webp'), img('xarm7-2.jpg'), img('xarm7-3.jpg'), img('xarm7-4.png')],
      videoBg: '/videos/xarm7_yt.mp4',
      url: RS + 'xarm-7-kolaboratif-robot-cobot-isbirlikci-robot-kol-6kg-700mm-7dof',
      description: 'xArm 7, endüstriyel uygulamalarda esnek hareket sağlayan 7 eksenli bir robot koludur. Kinematik yedekliliği, dar alanlarda engellerden kaçınmayı destekler. Karbon fiber gövdesiyle 13,7 kg ağırlığındadır.',
      specs: {
        'Taşıma kapasitesi': '3,5 kg',
        'Erişim': '700 mm',
        'Tekrarlanabilirlik': '±0,1 mm',
        'DoF': '7 eksen',
        'Azami hız': '1 m/s',
        'Gövde ağırlığı': '13,7 kg'
      },
      features: ['Kinematik yedeklilik', 'Dar alanlarda engelden kaçınma', '1, 3, 5, 6 ve 7. eksenlerde ±360° dönüş', 'ISO Class 5 temiz oda onayı'],
      badge: 'Araştırma ve VR',
      color: 'from-purple-600 to-pink-600',
      variants: [
        { name: 'Model A', desc: 'AC kontrol kutusu + 1,5 m kablo', url: RS + 'xarm-7-kolaboratif-robot-cobot-isbirlikci-robot-kol-6kg-700mm-7dof' },
        { name: 'Model B', desc: 'DC kontrol kutusu + 1,5 m kablo', url: RS + 'xarm-7-kolaboratif-cobot-isbirlikci-robot-6kg-700mm-7dof-ver-b' },
        { name: 'Model C', desc: 'AC kontrol kutusu + 3 m kablo', url: RS + 'xarm-7-kolaboratif-cobot-isbirlikci-robot-6kg-700mm-7dof-ver-c' },
        { name: 'Model D', desc: 'AC kontrol kutusu + 15 m kablo', url: RS + 'xarm-7-kolaboratif-cobot-isbirlikci-robot-6kg-700mm-7dof-ver-d' },
        { name: 'Model E', desc: 'DC kontrol kutusu + 3 m kablo', url: RS + 'xarm-7-kolaboratif-cobot-isbirlikci-robot-kol-35kg-700mm-7-dof-ver-e' }
      ]
    },
    {
      id: 'xarm6',
      name: 'UFACTORY xArm 6',
      tagline: 'Endüstriyel üretim standardı',
      image: img('xarm6-1.jpg'),
      gallery: [img('xarm6-1.jpg'), img('xarm6-2.jpg'), img('xarm6-3.jpg'), img('xarm6-4.png'), img('xarm6-5.jpg')],
      videoBg: '/videos/xarm.mp4',
      url: RS + 'xarm-6-kolaboratif-robot-cobot-isbirlikci-robot-kol-5kg-700mm-6dof',
      description: 'xArm 6, üretim hatlarında parça alma ve yerleştirme, montaj ve CNC tezgâh yükleme işlemleri için tasarlanmış 6 eksenli bir robot koludur. 5 kg taşıma kapasitesiyle parça taşıma ve kavrama uygulamalarında kullanılabilir.',
      specs: {
        'Taşıma kapasitesi': '5,0 kg',
        'Erişim': '700 mm',
        'Tekrarlanabilirlik': '±0,1 mm',
        'DoF': '6 eksen',
        'Azami hız': '1 m/s',
        'Gövde ağırlığı': '12,2 kg'
      },
      features: ['3B uzayda tam yönlendirme', 'Ağır yük taşıma dengesi', '126 mm kompakt taban alanı', 'AC/DC kontrol kutusu'],
      badge: 'En popüler',
      color: 'from-blue-600 to-cyan-600',
      variants: [
        { name: 'Model A', desc: 'AC kontrol kutusu + 1,5 m kablo', url: RS + 'xarm-6-kolaboratif-robot-cobot-isbirlikci-robot-kol-5kg-700mm-6dof' },
        { name: 'Model B', desc: 'DC kontrol kutusu + 1,5 m kablo', url: RS + 'xarm-6-kolaboratif-cobot-isbirlikci-robot-5kg-700mm-6dof-ver-b' },
        { name: 'Model C', desc: 'AC kontrol kutusu + 3 m kablo', url: RS + 'xarm-6-kolaboratif-cobot-isbirlikci-robot-5kg-700mm-6dof-ver-c' },
        { name: 'Model D', desc: 'AC kontrol kutusu + 15 m kablo', url: RS + 'xarm-6-kolaboratif-cobot-isbirlikci-robot-5kg-700mm-6dof-ver-d' },
        { name: 'Model E', desc: 'DC kontrol kutusu + 3 m kablo', url: RS + 'xarm-6-kolaboratif-cobot-isbirlikci-robot-kol-5kg-700mm-6-dof-ver-e' }
      ]
    },
    {
      id: 'uf850',
      name: 'UFACTORY 850',
      tagline: 'Yüksek hassasiyet, uzun erişim',
      image: img('uf850-1.png'),
      gallery: [img('uf850-1.png'), img('uf850-2.png'), img('uf850-3.png'), img('uf850-4.jpg')],
      videoBg: '/videos/850_small.mp4',
      url: RS + 'ufactory-850-cobot-isbirlikci-robot-kol-5kg-850mm-6-dof-karbon-fiber',
      description: 'Daha uzun erişim mesafesine (850 mm) ihtiyaç duyan otomasyon projeleri için tasarlanmıştır. 17 bitlik yüksek çözünürlüklü enkoder sayesinde ±0,02 mm tekrar konumlandırma hassasiyeti sunar.',
      specs: {
        'Taşıma kapasitesi': '5,0 kg',
        'Erişim': '850 mm',
        'Tekrarlanabilirlik': '±0,02 mm',
        'DoF': '6 eksen',
        'Güç tüketimi': '240 W (azami 1.000 W)',
        'Gövde ağırlığı': '20,0 kg'
      },
      features: ['±0,02 mm tekrarlanabilirlik', 'Dâhilî 100 Mbit Ethernet kablosu', '17 bitlik yüksek çözünürlüklü enkoder', 'PCB lehimleme ve lazer kaynağı'],
      badge: 'Yüksek hassasiyet',
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'xarm5',
      name: 'UFACTORY xArm 5 Lite',
      tagline: 'Ekonomik SCARA alternatifi',
      image: img('xarm5-1.jpg'),
      gallery: [img('xarm5-1.jpg'), img('xarm5-2.jpg'), img('xarm5-3.jpg'), img('xarm5-4.jpg'), img('xarm5-5.jpg')],
      url: RS + 'xarm-5-kolaboratif-robot-cobot-isbirlikci-robot-kol-3kg-700mm-5dof',
      description: 'xArm 5 Lite, yatay düzlemde parça alma ve yerleştirme ile otomasyon görevleri için tasarlanmış 5 eksenli bir robot koludur. SCARA robotlara alternatif olarak kullanılabilir.',
      specs: {
        'Taşıma kapasitesi': '3,0 kg',
        'Erişim': '700 mm',
        'Tekrarlanabilirlik': '±0,1 mm',
        'DoF': '5 eksen',
        'Asgari güç tüketimi': '8,4 W',
        'Gövde ağırlığı': '11,2 kg'
      },
      features: ['Yatırım geri dönüşü (ROI)', 'Düzlemsel hareket (pitch 0°)', 'SCARA robotlara alternatif', 'Kahve kiosku otomasyonuyla uyumlu'],
      badge: 'Giriş seviyesi',
      color: 'from-emerald-600 to-teal-600',
      variants: [
        { name: 'Model A', desc: 'AC kontrol kutusu + 1,5 m kablo', url: RS + 'xarm-5-kolaboratif-robot-cobot-isbirlikci-robot-kol-3kg-700mm-5dof' },
        { name: 'Model B', desc: 'DC kontrol kutusu + 1,5 m kablo', url: RS + 'xarm-lite-5-kolaboratif-cobot-isbirlikci-robot-3kg-700mm-5dof-ver-b' },
        { name: 'Model C', desc: 'AC kontrol kutusu + 3 m kablo', url: RS + 'xarm-lite-5-kolaboratif-cobot-isbirlikci-robot-3kg-700mm-5dof-ver-c' },
        { name: 'Model D', desc: 'AC kontrol kutusu + 15 m kablo', url: RS + 'xarm-lite-5-kolaboratif-cobot-isbirlikci-robot-3kg-700mm-5dof-ver-d' },
        { name: 'Model E', desc: 'DC kontrol kutusu + 3 m kablo', url: RS + 'xarm-5-lite-kolaboratif-cobot-isbirlikci-robot-3kg-700mm-5-dof-ver-e' }
      ]
    }
  ],
  lite: [
    {
      id: 'lite6',
      name: 'UFACTORY Lite6',
      tagline: 'Kompakt masaüstü robot kolu',
      image: img('lite6-1.jpg'),
      gallery: [img('lite6-1.jpg'), img('lite6kit-1.jpg')],
      videoBg: '/videos/lite6.mp4',
      url: RS + 'lite-6-kolaboratif-robot-cobot-isbirlikci-robot-kol-1kg-440mm-6dof',
      description: 'Lite6, alanın sınırlı olduğu laboratuvar uygulamaları ve hafif endüstriyel görevler için 600 g taşıma kapasitesi sunar. Dâhilî kontrol kutusu ve 130 × 140 mm kompakt taban alanıyla tak ve çalıştır kullanım sağlar.',
      specs: {
        'Taşıma kapasitesi': '600 g',
        'Erişim': '440 mm',
        'Tekrarlanabilirlik': '±0,5 mm',
        'DoF': '6 eksen',
        'Kontrol kutusu': 'Gövdeye dâhil',
        'Gövde ağırlığı': '7,2 kg'
      },
      features: ['Dâhilî kontrol kutusu', '130 × 140 mm kompakt taban alanı', 'ROS ve ROS 2 uyumluluğu', 'Harmonik redüktör ve BLDC'],
      badge: 'Ar-Ge ve eğitim',
      color: 'from-slate-700 to-slate-900',
      variants: [
        { name: 'Lite6', desc: 'Robot kolu', galleryIndex: 0, url: RS + 'lite-6-kolaboratif-robot-cobot-isbirlikci-robot-kol-1kg-440mm-6dof' },
        { name: 'Lite6 kiti', desc: 'Robot kolu + elektrikli ve vakum tutucu', galleryIndex: 1, url: RS + 'lite-6-kolaboratif-robot-kiti' }
      ]
    }
  ],
  accessories: [
    {
      id: 'gripper-xarm',
      name: 'UFACTORY xArm Gripper G2',
      tagline: '2 parmaklı elektrikli paralel tutucu',
      image: img('g2-1.jpg'),
      gallery: [img('g2-1.jpg'), img('g2-2.jpg')],
      url: RS + 'ufactory-xarm-gripper-g2-elektrikli-paralel-robot-tutucu',
      description: 'xArm Gripper G2, endüstriyel otomasyon uygulamalarında 5 kg taşıma kapasitesi ve 50 N azami kavrama kuvveti sunar. Dâhilî 12 bitlik mutlak enkoder, hız, kuvvet ve konum kontrolünü destekler. Pogo pin arayüzü, harici bağlantı kablosu ihtiyacını azaltır. Değiştirilebilir parmak uçlarıyla farklı parça geometrilerine uyarlanabilir.',
      specs: { 'Strok mesafesi': '84 ± 1 mm', 'Kavrama kuvveti': '10–50 N', 'Kapanma hızı': '15–225 mm/s' },
      features: ['12 bitlik mutlak enkoder', 'Programlanabilir hız, kuvvet ve konum', 'Pogo pin arayüzüyle bağlantı', '2 milyondan fazla çalışma çevrimi'],
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 'bio',
      name: 'UFACTORY xArm BIO Gripper G2',
      tagline: 'Elektrikli paralel sıvı taşıma tutucusu',
      image: img('bio-1.webp'),
      videoBg: '/videos/bio_gripper.mp4',
      gallery: [img('bio-1.webp'), img('bio-2.webp'), img('bio-3.webp'), img('bio-4.webp')],
      url: RS + 'ufactory-xarm-bio-gripper-g2-elektrikli-paralel-robot-tutucu',
      description: 'BIO Gripper G2, sıvı transferi ve laboratuvar otomasyonu için geliştirilen elektrikli bir tutucudur. Değiştirilebilir parmak uçlarıyla farklı deney tüplerine uyarlanabilir. Hız, konum ve kuvvet kontrolü, kavrama işleminin uygulamaya göre ayarlanmasını sağlar.',
      specs: { 'Strok (açıklık)': '71–150 mm', 'Kavrama kuvveti': '20 N', 'Haberleşme': 'RS-485 (Modbus RTU)' },
      features: ['Düşme ve kavrama algılama', 'Hız (0–4.000) ve kuvvet kontrolü', 'Değiştirilebilir uç tasarımı', '24 V DC anma gerilimi, 1,5 A tepe akımı'],
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 'vacuum',
      name: 'UFACTORY xArm Vacuum Gripper',
      tagline: 'Dâhilî pompalı vakum tutucu',
      image: img('vac-1.jpg'),
      gallery: [img('vac-1.jpg'), img('vac-2.jpg'), img('vac-3.jpg'), img('vac-4.jpg')],
      url: RS + 'ufactory-xarm-vacuum-gripper',
      description: 'Elektrikli vakum jeneratörü, harici kompresör ihtiyacını ortadan kaldırır. −55 kPa vakum seviyesi ve 5 kg taşıma kapasitesiyle düz yüzeyli metal parçaları veya karton kutuları kavramak için kullanılabilir.',
      specs: { 'Vakum seviyesi': '−55 kPa (%78)', 'Hava akışı': '4 L/dakika', 'Kapasite': '5 kg' },
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 'gripper-lite',
      name: 'Gripper Lite ve Vacuum Lite',
      tagline: 'Lite6 için uç işleyiciler',
      image: img('glite-2.jpg'),
      gallery: [img('glite-2.jpg'), img('glite-1.jpg'), img('vlite-3.jpg'), img('vlite-1.jpg'), img('vlite-2.jpg')],
      url: RS + 'gripper-lite-ufactory-lite-6-robot-kol-icin-tutucu',
      description: 'Lite6 için Gripper Lite ve Vacuum Lite olmak üzere iki tutucu seçeneği bulunur. Elektrikli Gripper Lite, 350 g ağırlığında olup 5 N kavrama kuvveti ve 16 mm strok sunar. Vacuum Lite ise 250 g ağırlığındadır ve −40 kPa vakum basıncıyla çalışır.',
      specs: { 'Kuvvet / basınç': '5 N / −40 kPa', 'Ağırlık': '250–350 g', 'Geri bildirim': 'Nesne algılama' },
      color: 'from-gray-600 to-gray-800',
      variants: [
        { name: 'Gripper Lite', desc: 'Elektrikli tutucu', galleryIndex: 0, specs: { 'Strok': '16 mm', 'Kavrama kuvveti': '5 N', 'Ağırlık': '350 g' }, url: RS + 'gripper-lite-ufactory-lite-6-robot-kol-icin-tutucu' },
        { name: 'Vacuum Lite', desc: 'Vakum tutucu', galleryIndex: 2, specs: { 'Vakum basıncı': '−40 kPa', 'Ağırlık': '250 g', 'Geri bildirim': 'Nesne algılama' }, url: RS + 'vacuum-gripper-lite-lite-6-robot-kol-icin-vakum-tutucu' }
      ]
    },
    {
      id: 'ft-sensor',
      name: '6 eksenli kuvvet/tork sensörü',
      tagline: '6 eksende kuvvet ve tork ölçümü',
      image: img('ft-1.jpg'),
      gallery: [img('ft-1.jpg'), img('ft-2.jpg'), img('ft-3.jpg')],
      url: RS + '6-eksen-kuvvet-tork-sensoru-xarm-robot-kol-uyumlu',
      description: 'X, Y ve Z eksenlerindeki kuvvet ve tork bileşenlerini ölçer. Kuvvet çözünürlüğü 100 mN, tork çözünürlüğü 5 mN·m’dir. Hassas polisaj ve mil-delik montajı uygulamalarında kuvvet ve empedans kontrolü için kullanılabilir.',
      specs: { 'Kuvvet aralığı': '150–200 N', 'Tork aralığı': '4 N·m', 'Çözünürlük': '100 mN / 5 mN·m' },
      color: 'from-slate-700 to-slate-900',
      variants: [
        { name: 'Sensör', desc: 'xArm uyumlu kuvvet/tork sensörü', url: RS + '6-eksen-kuvvet-tork-sensoru-xarm-robot-kol-uyumlu' }
      ]
    },
    {
      id: 'linear-motor',
      name: 'Doğrudan tahrikli lineer motor',
      tagline: 'Robot kolu için yatay hareket',
      image: img('lin700-1.webp'),
      gallery: [img('lin700-1.webp'), img('lin700-2.jpg'), img('lin700-3.jpg'), img('lin700-4.webp'), img('lin700-5.jpg')],
      url: RS + 'direct-drive-lineer-motor-xarm-6-uyumlu',
      description: 'Doğrudan tahrikli lineer ray sistemi, robotu birden fazla iş istasyonu arasında taşır. 700, 1.000 ve 1.500 mm strok seçenekleri bulunur. Sistem, 1 m/s hız ve 200 kg taşıma kapasitesi sunar.',
      specs: { 'Menzil (strok)': '700 / 1.000 / 1.500 mm', 'Hız': '1 m/s', 'Taşıma kapasitesi': '200 kg' },
      color: 'from-slate-700 to-slate-900',
      variants: [
        { name: '700 mm', desc: 'xArm uyumlu lineer motor', url: RS + 'direct-drive-lineer-motor-xarm-6-uyumlu' },
        { name: '1.000 mm', desc: 'Lineer motor kiti', url: RS + 'direct-drive-lineer-motor-kiti-1000mm' },
        { name: '1.500 mm', desc: 'Lineer motor kiti', url: RS + 'direct-drive-lineer-motor-kiti-1500mm' },
        { name: 'xArm 6 + motor', desc: 'xArm 6 ile birlikte', url: RS + 'xarm-6-kolaboratif-robot-direct-drive-lineer-motor' }
      ]
    }
  ],
  uarm: [
    {
      id: 'conveyor-kit',
      name: 'uArm konveyör bant sistemi',
      tagline: 'Nesne taşıma ve besleme',
      image: img('conv-3.jpg'),
      gallery: [img('conv-3.jpg'), img('conv-4.webp'), img('conv-2.jpg'), img('conv-1.jpg')],
      url: RS + 'uarm-robotik-egitim-kiti-conveyor-konveyor',
      description: 'uArm robot kolunun yanında çalışan mini konveyör, nesneleri taşıyıcı bant üzerinde robotun çalışma alanına getirir. Eğimli besleme bandı nesneleri ana hatta aktarır; sistem ultrasonik sensör, renk sensörü ve kızılötesi sayıcıyla kontrol edilir. Paket, konveyör ve besleme bandıyla birlikte kontrolör, bağlantı plakası, iki uArm statoru, güç kaynağı ve bağlantı kablolarını içerir. Görsellerdeki uArm Swift Pro robot kolları pakete dâhil değildir; ayrıca temin edilir.',
      specs: { 'Uyumlu robot': 'uArm Swift Pro', 'Taşınan yük': '500 g', 'Azami hız': '100 mm/s', 'Giriş gerilimi': 'DC 12 V', 'Nominal güç': '5 W', 'Robot kolu': 'Dâhil değil' },
      features: ['Konveyör ve eğimli besleme bandı', 'Ultrasonik sensör, renk sensörü ve kızılötesi sayıcıyla kontrol', 'Kontrolör ve bağlantı kabloları', 'Bağlantı plakası ve iki robot kolu statoru'],
      badge: 'Taşıyıcı bant',
      color: 'from-indigo-600 to-blue-800',
    },
    {
      id: 'uarm-slider',
      name: 'uArm Slider kızak sistemi',
      tagline: 'Robot kolu için yatay hareket platformu',
      image: img('slider-5.webp'),
      gallery: [img('slider-5.webp'), img('slider-4.webp'), img('slider-3.jpg'), img('slider-2.jpg'), img('slider-1.jpg')],
      url: RS + 'uarm-egitim-kiti-slider-conveyor',
      description: 'uArm robot kolunun monte edildiği motorlu kayar platform, robotu ray boyunca yatayda hareket ettirir. Kızak, step motor ve dişli kutusuyla tahrik edilir. Limit anahtarı başlangıç noktasını belirler, ultrasonik sensör yatay konum bilgisini sağlar ve renk sensörü nesne kavrama noktasının belirlenmesinde kullanılır. Paket, kızak, uArm kontrolörü, sensörler, güç kaynağı, bağlantı kabloları ve montaj altlığını içerir. Görsellerdeki uArm robot kolu dâhil değildir; ayrıca temin edilir.',
      specs: { 'Çalışma aralığı': '635 mm', 'Azami hız': '100 mm/s', 'Taşıma kapasitesi': '4 kg', 'Giriş gerilimi': 'DC 12 V', 'Kontrol kartı': 'Arduino Mega 2560', 'Boyutlar': '756 × 291 × 87 mm', 'Robot kolu': 'Dâhil değil' },
      features: ['Step motor ve dişli kutusuyla tahrik', 'Ultrasonik sensör, renk sensörü ve limit anahtarı', 'uArm kontrolörü ve bağlantı kabloları', 'Tek robot kolu için montaj altlığı'],
      badge: 'Motorlu kızak',
      color: 'from-indigo-600 to-blue-800'
    },
    {
      id: 'laser-head',
      name: 'uArm Laser Head',
      tagline: 'Lazer gravür ve yüzey işleme',
      image: img('laser-3.jpg'),
      gallery: [img('laser-3.jpg'), img('laser-1.jpg'), img('laser-2.jpg'), img('laser-4.jpg'), img('laser-5.jpg')],
      url: RS + 'uarm-laser-head-lazer-gravur-kafasi',
      description: 'uArm Laser Head, robot koluna takılarak lazer gravür uygulamalarında kullanılır. Ahşap, MDF, karton ve deri yüzeyler üzerinde gravür ve yüzey işleme yapılmasını sağlar.',
      specs: { 'Uygulama': 'Gravür / kesim', 'Materyal': 'Ahşap, MDF, deri', 'Ekipman': 'Güvenlik gözlüğü dâhil' },
      color: 'from-red-600 to-orange-800'
    }
  ]
};


const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'xarm' | 'lite' | 'accessories' | 'uarm'>('xarm');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [zoomOrigin, setZoomOrigin] = useState('center center');
  const [heroVideoSrc, setHeroVideoSrc] = useState('/videos/xarm.mp4');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const productHeadingRef = useRef<HTMLHeadingElement>(null);

  // Product URLs survive refresh and browser Back/Forward.
  useEffect(() => {
    const syncProduct = () => {
      const id = window.location.hash.match(/^#urun=([a-z0-9-]+)$/)?.[1];
      const entry = (Object.entries(products) as ['xarm' | 'lite' | 'accessories' | 'uarm', Product[]][])
        .map(([tab, items]) => ({ tab, product: items.find(item => item.id === id) }))
        .find(item => item.product);
      setGalleryIndex(0);
      setSelectedVariant(0);
      setShowVideo(Boolean(entry?.product?.videoBg));
      setSelectedProduct(entry?.product ?? null);
      if (entry) setActiveTab(entry.tab);
    };
    syncProduct();
    window.addEventListener('hashchange', syncProduct);
    return () => window.removeEventListener('hashchange', syncProduct);
  }, []);

  useLayoutEffect(() => {
    if (!selectedProduct && window.location.hash !== '#katalog') return;
    const target = document.getElementById('katalog');
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 96, behavior: 'instant' });
    if (selectedProduct) productHeadingRef.current?.focus({ preventScroll: true });
  }, [selectedProduct]);

  useEffect(() => {
    const videos = [...document.querySelectorAll('video')];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        const video = target as HTMLVideoElement;
        if (isIntersecting && !reduce.matches && !saveData && !document.hidden) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: 0.1 });
    videos.forEach(video => { video.pause(); observer.observe(video); });
    const refresh = () => {
      videos.forEach(video => {
        const box = video.getBoundingClientRect();
        if (!document.hidden && !reduce.matches && !saveData && box.top < innerHeight && box.bottom > 0) video.play().catch(() => {});
        else video.pause();
      });
    };
    document.addEventListener('visibilitychange', refresh);
    reduce.addEventListener('change', refresh);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', refresh);
      reduce.removeEventListener('change', refresh);
      videos.forEach(video => video.pause());
    };
  }, [selectedProduct, activeTab, showVideo, heroVideoSrc]);

  // Tab indicator (sliding pill) — measures the active button so the gradient pill animates between tabs
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [tabIndicator, setTabIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const recalcTabIndicator = () => {
    const container = tabsContainerRef.current;
    const btn = tabRefs.current[activeTab];
    if (!container || !btn) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setTabIndicator({ left: bRect.left - cRect.left, top: bRect.top - cRect.top, width: bRect.width, height: bRect.height });
  };

  useLayoutEffect(() => {
    recalcTabIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedProduct]);

  useEffect(() => {
    const onResize = () => recalcTabIndicator();
    window.addEventListener('resize', onResize);
    // recalc once after fonts/layout settle
    const t = setTimeout(recalcTabIndicator, 50);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedProduct]);

  // Reading progress bar — tracks scroll percentage through the document
  const [scrollProgress, setScrollProgress] = useState(0);
  // Subtle hero parallax (the hero video drifts slowly as we scroll past)
  const [heroParallax, setHeroParallax] = useState(0);

  // Active section (for navbar indicator)
  const [activeSection, setActiveSection] = useState<string>('');

  // Hero cursor follower (desktop only)
  const heroRef = useRef<HTMLElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  // Spark burst state — clicks on CTA trigger a short particle burst
  const [sparks, setSparks] = useState<{ id: number; dx: number; dy: number; color: string }[]>([]);
  const sparkIdRef = useRef(0);

  const triggerSparks = () => {
    const colors = ['#f97316', '#dc2626', '#fbbf24', '#fb923c', '#ffffff'];
    const burst = Array.from({ length: 14 }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 80;
      return {
        id: ++sparkIdRef.current,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
    setSparks(burst);
    window.setTimeout(() => setSparks([]), 800);
  };

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      setScrollProgress(p);
      setHeroParallax(Math.min(window.scrollY * 0.35, 400));
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Active section detector — highlights the matching nav link as user scrolls
  useEffect(() => {
    const ids = ['katalog', 'yazilim', 'vakalar', 'avantajlar', 'iletisim'];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Hero cursor follower — track local mouse position over the hero section
  const handleHeroMouse = (e: React.MouseEvent<HTMLElement>) => {
    const node = heroRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };
  const handleHeroLeave = () => setCursor((c) => ({ ...c, visible: false }));

  const handleVideoEnded = () => {
    const currentIndex = HERO_VIDEOS.indexOf(heroVideoSrc);
    const nextIndex = (currentIndex + 1) % HERO_VIDEOS.length;
    setHeroVideoSrc(HERO_VIDEOS[nextIndex]);
    setVideoProgress(0);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress || 0);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const handleMouseLeave = () => {
    setZoomOrigin('center center');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleProductSelect = (product: Product) => {
    // Native fragment navigation preserves hashchange and browser Back/Forward.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`#urun=${product.id}`);
  };

  const handleBackToGrid = () => {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign('#katalog');
  };

  // Sektör kartlarındaki butonlar ilgili ürünün detayını katalogda açar
  const openProductById = (tab: 'xarm' | 'lite' | 'accessories' | 'uarm', id: string) => {
    const product = products[tab].find((p) => p.id === id);
    if (!product) return;
    setActiveTab(tab);
    handleProductSelect(product);
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-orange-500 selection:text-white">

      {/* Reading progress bar */}
      <div
        className="reading-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Navbar */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24 items-center">
            <div className="flex-shrink-0 flex items-center gap-3 group">
              {/* Robot Sepeti Logo */}
              <a href="https://www.robotsepeti.com/" target="_blank" rel="noopener noreferrer" aria-label="RobotSepeti mağazasına git" className="flex items-center">
                <img src="/images/robotsepeti_logo_cropped.png" alt="RobotSepeti — UFACTORY Türkiye yetkili distribütörü" className="h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]" />
              </a>
              {/* Divider */}
              <div className="h-8 w-px bg-slate-300"></div>
              {/* UFACTORY Logo */}
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 40 40" className="w-10 h-10 md:w-12 md:h-12" fill="none">
                  <polygon points="20,2 37,11 37,29 20,38 3,29 3,11" fill="#EC6408" stroke="#EC6408" strokeWidth="1"/>
                  <text x="20" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">UF</text>
                </svg>
                <span className="text-slate-900 font-black text-base md:text-xl tracking-widest hidden sm:block">UFACTORY</span>
              </div>
            </div>

            <div className="hidden lg:flex space-x-8 items-center font-medium text-sm tracking-wide">
              <a href="#katalog"    className={`nav-link text-slate-600 hover:text-slate-900 transition-colors ${activeSection === 'katalog' ? 'is-active' : ''}`}>Teknik özellikler</a>
              <a href="#yazilim"    className={`nav-link text-slate-600 hover:text-slate-900 transition-colors ${activeSection === 'yazilim' ? 'is-active' : ''}`}>Yazılım ekosistemi</a>
              <a href="#vakalar"    className={`nav-link text-slate-600 hover:text-slate-900 transition-colors ${activeSection === 'vakalar' ? 'is-active' : ''}`}>Sektörler</a>
              <a href="#avantajlar" className={`nav-link text-slate-600 hover:text-slate-900 transition-colors ${activeSection === 'avantajlar' ? 'is-active' : ''}`}>Avantajlar ve SSS</a>
              <Magnetic>
                <a href="#iletisim" className="btn-glow bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] flex items-center gap-2">
                  Projeyi anlat
                </a>
              </Magnetic>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button onClick={toggleMenu} className="text-slate-900" aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={isMenuOpen}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col font-semibold text-slate-700">
              {[
                ['#katalog', 'Teknik özellikler'],
                ['#yazilim', 'Yazılım ekosistemi'],
                ['#vakalar', 'Sektörler'],
                ['#avantajlar', 'Avantajlar ve SSS'],
                ['#iletisim', 'Projeyi anlat'],
              ].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setIsMenuOpen(false)} className="py-3 px-2 border-b border-slate-100 last:border-0 hover:text-orange-600">{label}</a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main>
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouse}
        onMouseLeave={handleHeroLeave}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900"
      >
        <div
          className="absolute inset-0 z-0"
          style={{ transform: `translate3d(0, ${heroParallax * 0.4}px, 0)`, willChange: 'transform' }}
        >
          {/* Hero Video */}
          <video
            ref={videoRef}
            preload="auto"
            autoPlay
            muted
            playsInline
            poster="/images/products/rs-xarm6-1.jpg"
            onEnded={handleVideoEnded}
            onTimeUpdate={handleTimeUpdate}
            aria-label="UFACTORY endüstriyel robot kolu serisi"
            className="w-full h-full object-cover scale-110"
            src={heroVideoSrc}
          ></video>
          
          {/* Sadece en alta ufak bir geçiş gölgesi eklendi (Sayfanın alt kısmına yumuşak bağlanması için) */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
          
          {/* Custom Video Progress Bar (Zaman Çizgisi) */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200/50 z-20 backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
              style={{ width: `${videoProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Cursor follower (hero only, desktop) */}
        <div
          className="cursor-follower"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            opacity: cursor.visible ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {/* New Corner-Aligned Content Area */}
        <div className="absolute inset-0 z-10 pointer-events-none p-6 md:p-12 flex flex-col justify-between pt-32 pb-8">

          {/* Top Row: Distributor Info (Top Left) */}
          <div className="flex justify-between items-start w-full">
            <div className="max-w-full bg-white/80 backdrop-blur-md px-4 sm:px-5 py-3 rounded-2xl shadow-lg border border-white/60 pointer-events-auto transition-transform duration-300 hover:scale-[1.02]">
              <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 tracking-wide flex flex-col items-start sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="typewriter">UFACTORY Türkiye yetkili distribütörü</span>
                <span className="text-white bg-orange-600 px-2 py-0.5 rounded text-xs font-black tracking-widest shadow-sm animate-fade-up" style={{ animationDelay: '2.5s' }}>ROBOTSEPETİ</span>
              </h1>
            </div>
          </div>

          {/* Bottom Row: CTA (Bottom Right) */}
          <div className="flex justify-end items-end w-full">
            <div className="pointer-events-auto">
              <Magnetic strength={0.3}>
                <a href="#katalog" className="btn-glow bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm md:text-base hover:bg-orange-600 transition-all duration-300 flex items-center gap-2 shadow-2xl shadow-slate-900/30 hover:shadow-orange-500/40 hover:-translate-y-0.5 group">
                  Kataloğu keşfet <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* Wave divider — Hero → Intro */}
      <div className="wave-divider -mt-1 bg-slate-50" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z" fill="#f8fafc"/>
          <path d="M0,48 C240,96 480,16 720,48 C960,80 1200,32 1440,64 L1440,80 L0,80 Z" fill="#f1f5f9" opacity="0.6"/>
        </svg>
      </div>

      {/* INTRO SECTION */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal as="h2" variant="up" className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
            UFACTORY robot kolu serileri nelerdir?
          </Reveal>
          <Reveal as="p" variant="up" delay={2} className="text-lg text-slate-600 leading-relaxed">
            UFACTORY, üretim, montaj, parça taşıma ve robotik araştırmalar için robot kolları geliştirir. <strong>xArm 6</strong> 5 kg, <strong>xArm 7</strong> ise 3,5 kg taşıma kapasitesine sahiptir. Python, C++ ve ROS araçlarıyla kontrol edilebilir; model seçimi taşıma kapasitesi, erişim ve uygulamanın hareket gereksinimlerine göre yapılır.
          </Reveal>
        </div>
      </section>

      {/* INTERACTIVE CATALOG SECTION */}
      <section id="katalog" className="py-24 bg-slate-50 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-300 via-transparent to-transparent bg-[length:20px_20px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div hidden={Boolean(selectedProduct)} className="relative mb-16">
            <div className="text-center">
              <Reveal as="h2" variant="up" className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                Teknik özellikler ve taşıma kapasitesi
              </Reveal>
              <Reveal as="p" variant="up" delay={2} className="text-slate-600 text-lg max-w-2xl mx-auto mb-10">
                İhtiyacınıza uygun taşıma kapasitesi (payload) ve erişim mesafesine sahip, esnek üretime uygun UFACTORY modellerini ve teknik özelliklerini inceleyin.
              </Reveal>

              <Reveal variant="scale" delay={3} className="inline-block">
                <div
                  ref={tabsContainerRef}
                  className="relative inline-flex flex-wrap justify-center gap-1 bg-white rounded-full p-1.5 border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Sliding gradient indicator */}
                  <span
                    className="tab-indicator"
                    style={{
                      left: `${tabIndicator.left}px`,
                      top: `${tabIndicator.top}px`,
                      height: `${tabIndicator.height}px`,
                      bottom: 'auto',
                      width: `${tabIndicator.width}px`,
                      opacity: tabIndicator.width ? 1 : 0,
                    }}
                  />
                  {(['xarm', 'lite', 'accessories', 'uarm'] as const).map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        ref={(el) => { tabRefs.current[tab] = el; }}
                        onClick={() => setActiveTab(tab)}
                        aria-pressed={isActive}
                        className={`tab-pill ${isActive ? 'is-active text-white' : 'text-slate-600 hover:text-slate-900'} px-6 sm:px-8 py-3 rounded-full font-bold text-sm`}
                      >
                        {tab === 'xarm' ? 'Endüstriyel xArm ve 850' : tab === 'lite' ? 'Masaüstü Lite6' : tab === 'accessories' ? 'Uç işleyiciler ve aksesuarlar' : 'uArm aksesuarları'}
                      </button>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </div>

          {/* GRID VIEW */}
          {!selectedProduct && (
          <div
            key={activeTab}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-scale"
          >
            {products[activeTab].map((product, idx) => (
              <TiltCard
                key={product.id}
                onClick={() => handleProductSelect(product)}
                style={{ animationDelay: `${idx * 90}ms` }}
                className="animate-fade-up group cursor-pointer rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-orange-500/50 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22)] flex flex-col min-h-[520px]"
              >
                <div className="h-[280px] shrink-0 relative overflow-hidden bg-white border-b border-slate-100 flex items-center justify-center">
                  {product.badge && (
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full z-20 tracking-widest uppercase shadow-sm">
                      {product.badge}
                    </div>
                  )}
                  {/* Ürün videosu varsa net şekilde (soluklaştırma olmadan), yoksa RobotSepeti ürün fotoğrafı */}
                  {product.videoBg ? (
                    <video
                      preload="metadata"
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={product.image}
                      aria-label={`${product.name} — RobotSepeti UFACTORY Türkiye`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src={product.videoBg}
                    />
                  ) : (
                    <ImageBlurUp
                      src={product.image}
                      alt={`${product.name} — RobotSepeti UFACTORY Türkiye`}
                      className="absolute inset-0 w-full h-full object-contain p-6 bg-white group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>

                <div className="tilt-card-inner p-8 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h3>
                    <p className="text-orange-700 text-xs font-bold tracking-widest uppercase mb-4">{product.tagline}</p>
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">{product.description}</p>
                  </div>
                  <div className="flex items-center text-orange-500 font-bold text-sm mt-4 group-hover:text-orange-600 transition-colors uppercase tracking-wider">
                    Teknik detayları gör <ChevronRight size={16} className="ml-1 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
          )}

          {/* DETAILED VIEW */}
          {selectedProduct && (
            <div key={selectedProduct.id} className="animate-detail-in origin-top">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/60 relative">
                
                {/* Back Button */}
                <button 
                  onClick={handleBackToGrid}
                  aria-label="Tüm ürünlere dön"
                  className="absolute top-6 left-6 z-30 w-12 h-12 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center text-slate-900 hover:text-white hover:bg-orange-500 transition-all duration-300 border border-slate-200 shadow-lg hover:shadow-orange-500/30 hover:scale-110"
                >
                  <ArrowLeft size={22} />
                </button>

                <div className="grid lg:grid-cols-2">
                  {/* LEFT: Media Gallery Panel */}
                  <div className="relative h-[480px] sm:h-[600px] lg:h-auto lg:min-h-[800px] bg-slate-100 flex flex-col overflow-hidden">
                    
                    {/* Main Media Area */}
                    <div className="relative flex-1 overflow-hidden group/zoom cursor-crosshair">
                      {/* Video View */}
                      {showVideo && selectedProduct.videoBg ? (
                        <video 
                          preload="auto"
                          poster={selectedProduct.image}
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                          aria-label={`${selectedProduct.name} endüstriyel robot kolu inceleme — RobotSepeti`}
                          key={selectedProduct.videoBg}
                          className="absolute inset-0 w-full h-full object-contain bg-slate-50"
                          style={{ objectPosition: 'center center' }}
                          src={selectedProduct.videoBg}
                        />
                      ) : (
                        /* Gallery Image View with Zoom */
                        <div 
                          className="absolute inset-0 w-full h-full overflow-hidden"
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                        >
                          {selectedProduct.gallery && selectedProduct.gallery.length > 0 ? (
                            <img 
                              src={selectedProduct.gallery[galleryIndex]}
                              alt={`${selectedProduct.name} görsel ${galleryIndex + 1}`}
                              style={{ transformOrigin: zoomOrigin }}
                              className="w-full h-full object-contain bg-white transition-transform duration-200 ease-out group-hover/zoom:scale-[2]"
                              draggable={false}
                            />
                          ) : selectedProduct.image ? (
                            <img 
                              src={selectedProduct.image}
                              alt={`${selectedProduct.name} — RobotSepeti`}
                              style={{ transformOrigin: zoomOrigin }}
                              className="w-full h-full object-contain bg-white transition-transform duration-200 ease-out group-hover/zoom:scale-[2]"
                              draggable={false}
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                              <Settings size={80} className="text-white/10" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Gradient overlays */}

                      
                      {/* Zoom hint badge */}
                      {!showVideo && (selectedProduct.gallery || selectedProduct.image) && (
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 opacity-60 group-hover/zoom:opacity-0 transition-opacity duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
                          <span className="text-white/70 text-[10px] font-bold tracking-widest uppercase">Yakınlaştır</span>
                        </div>
                      )}

                      {/* Video indicator */}
                      {showVideo && selectedProduct.videoBg && (
                        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-white text-[10px] font-bold tracking-widest uppercase">Ürün videosu</span>
                        </div>
                      )}

                    </div>
                      {/* Keep product titles clear of the photo and video. */}
                      <div className="relative z-20 px-5 py-4 bg-white border-t border-slate-200">
                        {selectedProduct.badge && (
                          <div className="inline-block mb-2 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold tracking-widest uppercase">
                            {selectedProduct.badge}
                          </div>
                        )}
                        <h2 ref={productHeadingRef} tabIndex={-1} className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight outline-none">
                          {selectedProduct.name}
                        </h2>
                        <p className="text-orange-700 text-xs font-bold tracking-widest uppercase mt-1">
                          {selectedProduct.tagline}
                        </p>
                      </div>

                    {/* Thumbnail Strip (Gallery + Video Toggle) */}
                    {(selectedProduct.videoBg || (selectedProduct.gallery && selectedProduct.gallery.length > 1)) && (
                      <div className="flex gap-2 p-3 bg-slate-100 border-t border-slate-200 overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 transparent' }}>
                        {/* Video Thumbnail */}
                        {selectedProduct.videoBg && (
                          <button
                            onClick={() => { setShowVideo(true); }}
                            aria-label={`${selectedProduct.name} ürün videosunu göster`}
                            aria-pressed={showVideo}
                            className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${showVideo ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-slate-700 hover:border-slate-500'}`}
                          >
                            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                              <Play size={20} className="text-white/80" />
                            </div>
                            <div className="absolute bottom-0.5 left-0 right-0 text-center">
                              <span className="text-[8px] text-white/60 font-bold uppercase">Video</span>
                            </div>
                          </button>
                        )}
                        {/* Image Thumbnails */}
                        {selectedProduct.gallery && selectedProduct.gallery.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => { setShowVideo(false); setGalleryIndex(idx); }}
                            aria-label={`${selectedProduct.name} görsel ${idx + 1}`}
                            aria-pressed={!showVideo && galleryIndex === idx}
                            className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${!showVideo && galleryIndex === idx ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-slate-700 hover:border-slate-500'}`}
                          >
                            <img 
                              src={img} 
                              alt={`${selectedProduct.name} görsel ${idx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Specs & Details Panel */}
                  <div className="p-8 sm:p-10 lg:p-12 xl:p-16 flex flex-col relative bg-white lg:max-h-[800px] lg:overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 transparent' }}>
                    <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
                      <Settings size={280} />
                    </div>

                    {/* Fiyat bilgisi — güncel fiyat RobotSepeti ürün sayfasında */}
                    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 text-[10px] font-bold tracking-widest uppercase">Fiyat ve stok</span>
                      </div>
                      <p className="text-green-800 text-sm">
                        Güncel fiyat, stok ve teslim süresi için{' '}
                        <a href={selectedProduct.variants?.[selectedVariant]?.url || selectedProduct.url} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2 hover:text-orange-600">RobotSepeti ürün sayfasına</a>{' '}
                        bakın veya teklif isteyin.
                      </p>
                    </div>

                    {/* Variants Selection */}
                    {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Settings size={14} className="text-orange-500" />
                          Model seçenekleri
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {selectedProduct.variants.map((variant, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setSelectedVariant(i);
                                if (variant.galleryIndex !== undefined) {
                                  setGalleryIndex(variant.galleryIndex);
                                  setShowVideo(false);
                                }
                              }}
                              aria-pressed={selectedVariant === i}
                              className={`text-left p-3 rounded-xl border transition-all duration-300 ${
                                selectedVariant === i 
                                  ? 'border-orange-500 bg-orange-50/80 shadow-md shadow-orange-500/10' 
                                  : 'border-slate-200 bg-white hover:border-orange-500/30 hover:bg-slate-50'
                              }`}
                            >
                              <div className={`font-bold text-sm mb-1 ${selectedVariant === i ? 'text-orange-600' : 'text-slate-900'}`}>{variant.name}</div>
                              <div className="text-[11px] leading-tight text-slate-500">{variant.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-base text-slate-600 leading-relaxed mb-8">
                      {selectedProduct.description}
                    </p>

                    {/* Specs Grid */}
                    <div className="mb-8">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Cpu size={14} className="text-orange-500" />
                        Teknik özellikler
                      </h4>
                      <div className="product-spec-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                        {Object.entries(selectedProduct.variants?.[selectedVariant]?.specs || selectedProduct.specs).map(([key, value], i) => (
                          <div key={`${selectedProduct.id}-${i}`} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl group hover:border-orange-500/30 transition-all duration-300 hover:bg-orange-50/50">
                            <p className="product-spec-label text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1.5 group-hover:text-orange-700 transition-colors">
                              {key}
                            </p>
                            <p className="text-lg font-black text-slate-900">
                              <CountUp value={value} />
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    {selectedProduct.features && (
                      <div className="mb-8">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Target size={14} className="text-orange-500" />
                          Öne çıkan özellikler
                        </h4>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {selectedProduct.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700 text-sm font-medium bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200 hover:border-orange-500/20 transition-colors">
                              <Crosshair className="text-orange-500 flex-shrink-0" size={16} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4"></div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <Magnetic className="flex-1">
                        <a
                          href={quoteMailLink(selectedProduct, selectedVariant)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerSparks}
                          className="spark-host btn-glow bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all duration-300 w-full flex justify-center items-center gap-2 relative"
                        >
                          <ShoppingBag size={18} /> Teklif iste
                          {sparks.map((s) => (
                            <span
                              key={s.id}
                              className="spark is-bursting"
                              style={{
                                ['--dx' as string]: `${s.dx}px`,
                                ['--dy' as string]: `${s.dy}px`,
                                background: s.color,
                                boxShadow: `0 0 12px ${s.color}`,
                              } as React.CSSProperties}
                            />
                          ))}
                        </a>
                      </Magnetic>
                      <Magnetic className="flex-1">
                        <a href={selectedProduct.variants?.[selectedVariant]?.url || selectedProduct.url || "https://www.robotsepeti.com"} target="_blank" rel="noopener noreferrer" className="bg-slate-100 text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-200 transition-all duration-300 w-full flex justify-center items-center gap-2">
                          <Globe size={18} /> RobotSepeti’nde incele
                        </a>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SOFTWARE, CONTROL & SAFETY SECTION */}
      <section id="yazilim" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
             <Reveal as="h4" variant="up" className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-4">Açık mimari ve endüstriyel standartlar</Reveal>
             <Reveal as="h2" variant="up" delay={1} className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Yazılım ekosistemi ve güvenlik işlevleri</Reveal>
             <Reveal as="p" variant="up" delay={2} className="text-lg text-slate-600 max-w-3xl mx-auto">
                UFACTORY robot kolları Studio arayüzü, Python ve C++ geliştirme kitleri ile ROS ve ROS 2 araçları üzerinden kontrol edilebilir. Modbus TCP, endüstriyel kontrol sistemleriyle haberleşmeyi destekler. Yazılım ve güvenlik işlevlerinin kapsamı, seçilen modele ve kontrolcüye göre değerlendirilmelidir.
             </Reveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Software Architecture */}
            <Reveal variant="left">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">Yazılım ve yörünge planlama</h3>

              <div className="space-y-8">
                <Reveal variant="up" delay={1} className="flex gap-5">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0"><Settings size={28}/></div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">UFACTORY Studio ve Blockly</h4>
                    <p className="text-slate-600 leading-relaxed">Web tabanlı Studio arayüzünde Blockly bloklarıyla hareket görevleri oluşturulur. <strong>Teach by Hand (elle yönlendirme):</strong> Robot elle yönlendirilerek konumlar kaydedilir. Kullanımdan önce montaj yönü ve yük bilgileri seçilen modelin kılavuzuna göre yapılandırılır.</p>
                  </div>
                </Reveal>

                <Reveal variant="up" delay={2} className="flex gap-5">
                  <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0"><Code size={28}/></div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Python ve C++ SDK, 250 Hz veri akışı</h4>
                    <p className="text-slate-600 leading-relaxed">Studio içindeki Python geliştirme ortamıyla görsel projeleri koda dönüştürün. <code>servo_cartesian</code> komutuyla dış kameralardan gelen konum verilerine göre robot hareketini güncelleyin.</p>
                  </div>
                </Reveal>

                <Reveal variant="up" delay={3} className="flex gap-5">
                  <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0"><Server size={28}/></div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">ROS ve ROS 2 ile dijital ikiz</h4>
                    <p className="text-slate-600 leading-relaxed">MoveIt, RViz ve Gazebo ile entegrasyon desteklenir. Robotun fiziksel kurulumu yapılmadan önce dijital ikizi üzerinden <strong>tekillik</strong> analizi ve kinematik hesaplamalar yapılabilir.</p>
                  </div>
                </Reveal>
              </div>
            </Reveal>

            {/* Hardware Safety & Control */}
            <Reveal variant="right">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">Çalışma sınırları ve durdurma işlevleri</h3>

              <div className="grid sm:grid-cols-2 gap-6">
                 <Reveal variant="up" delay={1} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 card-lift hover:border-orange-500/30">
                    <Activity className="text-orange-500 mb-4" size={32} />
                    <h4 className="font-bold text-slate-900 mb-2">Çarpışma algılama ve geri çekilme</h4>
                    <p className="text-sm text-slate-600">Çarpışma, eklem torkundaki sapmalar üzerinden algılanır. Algılama hassasiyeti 1–5 seviyesinde ayarlanabilir. Collision Rebound etkinleştirildiğinde robot, çarpışma algıladığı konumdan bir miktar geri çekilir.</p>
                 </Reveal>

                 <Reveal variant="up" delay={2} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 card-lift hover:border-orange-500/30">
                    <Shield className="text-orange-500 mb-4" size={32} />
                    <h4 className="font-bold text-slate-900 mb-2">Çalışma sınırları ve indirgenmiş mod</h4>
                    <p className="text-sm text-slate-600">Kartezyen çalışma sınırları, TCP ve eklem hızları yazılımdan tanımlanır. İndirgenmiş mod Studio üzerinden veya yapılandırılmış kontrolcü girişleriyle etkinleştirilir.</p>
                 </Reveal>

                 <Reveal variant="up" delay={3} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 sm:col-span-2 flex flex-col sm:flex-row gap-6 items-center card-lift">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0"><Lock size={32}/></div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Durdurma ve harici girişler</h4>
                      <p className="text-sm text-slate-600">Kontrolcüdeki acil durdurma ve yapılandırılabilir Stop Moving girişleri hareketi durdurur. Safeguard Reset, koruyucu duruş sonrasında hareketin yeniden etkinleştirilmesini sağlar; giriş işlevleri Studio üzerinden ayarlanır.</p>
                    </div>
                 </Reveal>
              </div>

              {/* Control Boxes Info */}
              <Reveal variant="up" delay={4} className="mt-6 bg-slate-100 p-6 rounded-3xl text-slate-900">
                 <h4 className="font-bold mb-3 flex items-center gap-2"><Cpu size={20} className="text-orange-500"/> Modüler kontrol kutuları (AC/DC)</h4>
                 <p className="text-sm text-slate-600">Sabit hatlar için <strong>AC (100–240 V)</strong>, AGV/AMR otonom mobil robotlar için 2,6 kg ağırlığında <strong>DC (24–72 V)</strong> kontrol kutusu seçenekleri bulunur. Her iki seçenek de CI/CO, DI/DO ve AI/AO arayüzleri barındırır.</p>
              </Reveal>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CASE STUDIES SECTION */}
      <section id="vakalar" className="py-24 bg-white relative overflow-hidden border-t border-slate-200">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 skew-x-[-15deg] transform origin-bottom -z-10 opacity-50"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex justify-between items-end mb-16">
               <div>
                 <Reveal as="h4" variant="up" className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">Uygulama alanları ve endüstriyel çözümler</Reveal>
                 <Reveal as="h2" variant="up" delay={1} className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">Hangi sektörler için uygundur?</Reveal>
               </div>
               <Reveal as="p" variant="up" delay={2} className="text-slate-400 max-w-md mt-6 lg:mt-0 font-medium">
                 Endüstriyel robot kolları üretim, Ar-Ge, lojistik ve gıda sektörlerinde kullanılabilir. Aşağıdaki örnekler, farklı entegrasyon ve saha uygulamalarını gösterir.
               </Reveal>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               {/* Case 1 */}
               <Reveal variant="up" delay={1} className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-8 rounded-3xl hover:border-orange-500/30 card-lift group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center"><Target size={24}/></div>
                    <h3 className="text-2xl font-bold text-slate-900">Kutu içinden parça alma (3B bin picking)</h3>
                  </div>
                  <p className="text-slate-600 mb-6 line-clamp-3">Kutudaki düzensiz parçaların alınması, xArm’a entegre edilen 3B görüntü işleme ve makine öğrenimi araçlarıyla otomatikleştirilebilir.</p>
                  <button type="button" onClick={() => openProductById('xarm', 'xarm6')} className="text-orange-500 font-bold text-sm uppercase tracking-wider hover:text-orange-600 flex items-center">xArm 6 robot kolunu incele <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/></button>
               </Reveal>

               {/* Case 2 */}
               <Reveal variant="up" delay={2} className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-8 rounded-3xl hover:border-orange-500/30 card-lift group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center"><Globe size={24}/></div>
                    <h3 className="text-2xl font-bold text-slate-900">VR ile uzaktan kontrol</h3>
                  </div>
                  <p className="text-slate-600 mb-6 line-clamp-3">xArm sistemleri, sanal gerçeklik (VR) arayüzleriyle uzaktan kontrol edilebilir. Bu yaklaşım, robotik araştırma ve uzaktan manipülasyon uygulamalarında kullanılabilir.</p>
                  <button type="button" onClick={() => openProductById('xarm', 'xarm7')} className="text-orange-500 font-bold text-sm uppercase tracking-wider hover:text-orange-600 flex items-center">xArm 7 robot kolunu incele <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/></button>
               </Reveal>

               {/* Case 3 */}
               <Reveal variant="up" delay={3} className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-8 rounded-3xl hover:border-orange-500/30 card-lift group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center"><Briefcase size={24}/></div>
                    <h3 className="text-2xl font-bold text-slate-900">Gıda ve servis otomasyonu</h3>
                  </div>
                  <p className="text-slate-600 mb-6 line-clamp-3">Kahve hazırlama, dondurma servisi ve kızartma gibi tekrarlayan işler, xArm ve Lite6 ile kurulan kiosk sistemlerinde otomatikleştirilebilir.</p>
                  <button type="button" onClick={() => openProductById('xarm', 'xarm5')} className="text-orange-500 font-bold text-sm uppercase tracking-wider hover:text-orange-600 flex items-center">xArm 5 Lite robot kolunu incele <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/></button>
               </Reveal>

               {/* Case 4 */}
               <Reveal variant="up" delay={4} className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-8 rounded-3xl hover:border-orange-500/30 card-lift group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center"><Cpu size={24}/></div>
                    <h3 className="text-2xl font-bold text-slate-900">Mobil robotik (AMR)</h3>
                  </div>
                  <p className="text-slate-600 mb-6 line-clamp-3">Hafif ve kompakt Lite6, otonom mobil robotların (AMR) üzerine monte edilerek üniversite araştırmalarında ve robotik yarışmalarında mobil manipülasyon için kullanılabilir.</p>
                  <button type="button" onClick={() => openProductById('lite', 'lite6')} className="text-orange-500 font-bold text-sm uppercase tracking-wider hover:text-orange-600 flex items-center">Lite6 robot kolunu incele <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/></button>
               </Reveal>
            </div>
         </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
             <Reveal as="h4" variant="up" className="text-orange-700 font-bold tracking-widest uppercase text-sm mb-4">Robot kolları ve hareket sistemleri</Reveal>
             <Reveal as="h2" variant="up" delay={1} className="text-4xl md:text-5xl font-black text-slate-900 mb-6">UFACTORY ürün aileleri</Reveal>
             <Reveal as="p" variant="up" delay={2} className="text-lg text-slate-600 max-w-2xl mx-auto">
                RobotSepeti&apos;nde sunulan serilerin taşıma kapasitesi, erişimi ve kullanım alanları.
             </Reveal>
          </div>

          <div className="relative">
            {/* Desktop Center Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/20 via-orange-500/50 to-transparent transform -translate-x-1/2 rounded-full"></div>
            
            <div className="relative z-10">
              {TIMELINE_DATA.map((data, index) => (
                <TimelineItem key={index} data={data} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES SECTION */}
      <section id="avantajlar" className="py-24 bg-white relative overflow-hidden border-t border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-50 via-white to-white z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Reveal as="h2" variant="up" className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight break-words">
              RobotSepeti’nden UFACTORY satın almanın avantajları
            </Reveal>
            <Reveal as="p" variant="up" delay={2} className="text-lg text-slate-400 max-w-3xl mx-auto">
              Türkiye’nin yetkili distribütörü olarak endüstriyel otomasyon çözümleri sunuyoruz.
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <Reveal variant="up" delay={1} className="bg-slate-50 border border-slate-200 p-8 rounded-3xl card-lift hover:border-orange-500/30 group">
                <Shield className="text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-300" size={40} />
                <h3 className="text-xl font-bold text-slate-900 mb-4">Resmî Türkiye garantisi</h3>
                <p className="text-slate-600">Tüm UFACTORY xArm ve Lite6 serisi robot kolları ve aksesuarları, doğrudan RobotSepeti güvencesiyle garanti kapsamındadır.</p>
             </Reveal>
             <Reveal variant="up" delay={2} className="bg-slate-50 border border-slate-200 p-8 rounded-3xl card-lift hover:border-orange-500/30 group">
                <Settings className="text-orange-500 mb-6 group-hover:rotate-90 transition-transform duration-500" size={40} />
                <h3 className="text-xl font-bold text-slate-900 mb-4">Teknik destek ve kurulum</h3>
                <p className="text-slate-600">Alanında uzman mühendislik ekibimiz ile üretim hattınıza entegrasyon, Python SDK programlama ve ROS desteği sağlıyoruz.</p>
             </Reveal>
             <Reveal variant="up" delay={3} className="bg-slate-50 border border-slate-200 p-8 rounded-3xl card-lift hover:border-orange-500/30 group">
                <Lock className="text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-300" size={40} />
                <h3 className="text-xl font-bold text-slate-900 mb-4">Stok ve teslimat bilgisi</h3>
                <p className="text-slate-600">RobotSepeti ürün sayfasından güncel stok durumunu inceleyin. Robot kolu, kontrolcü ve aksesuar seçiminiz için teslim süresini ekibimizden öğrenin.</p>
             </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Reveal as="h2" variant="up" className="text-4xl font-black text-slate-900 mb-6">Sık sorulan sorular</Reveal>
          </div>

          <div className="space-y-6">
            <Reveal variant="up" delay={2} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-lift hover:border-orange-500/30">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hangi robot kolu benim endüstriyel projeme daha uygun?</h3>
              <p className="text-slate-600">Seçim yaparken taşıma kapasitesi ve tekrar konumlandırma hassasiyeti kritiktir. xArm 6 genel endüstriyel kullanım, xArm 7 ise engelden kaçınma ve dar alanlar için idealdir. Detaylı teknik analiz için mühendislik ekibimizle görüşebilirsiniz.</p>
            </Reveal>
            <Reveal variant="up" delay={3} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-lift hover:border-orange-500/30">
              <h3 className="text-lg font-bold text-slate-900 mb-2">xArm serisi için hangi programlama dilleri destekleniyor?</h3>
              <p className="text-slate-600">UFACTORY robot kolları tamamen açık mimariye sahiptir. ROS, ROS 2 desteğinin yanı sıra kapsamlı Python SDK ve C++ kütüphaneleri ile programlanabilir. Ayrıca Modbus TCP üzerinden endüstriyel haberleşme mümkündür.</p>
            </Reveal>
            <Reveal variant="up" delay={4} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-lift hover:border-orange-500/30">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Kurulum ve robot kolu programlama eğitim desteğiniz var mı?</h3>
              <p className="text-slate-600">Evet, RobotSepeti olarak UFACTORY cobot sistemlerinin sahada kurulumu, entegrasyonu ve teknik personeliniz için temel robot kolu programlama eğitimlerini sağlıyoruz.</p>
            </Reveal>
            <Reveal variant="up" delay={5} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-lift hover:border-orange-500/30">
              <h3 className="text-lg font-bold text-slate-900 mb-2">UFACTORY ürünlerinde teslimat süreleri nedir?</h3>
              <p className="text-slate-600">Teslim süresi seçilen model, kontrol kutusu, aksesuarlar ve güncel stok durumuna göre değişir. Ürün sayfasındaki stok bilgisini inceleyebilir veya RobotSepeti ekibinden siparişe özel teslim süresi alabilirsiniz.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER - Robot Sepeti Role */}
      </main>
      <footer id="iletisim" className="bg-slate-50 text-slate-600 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-r from-white to-slate-100 rounded-3xl p-10 lg:p-16 mb-16 flex flex-col lg:flex-row items-center justify-between border border-slate-200 shadow-xl shadow-slate-200/50">
             <div className="lg:w-2/3 mb-8 lg:mb-0">
               <h3 className="text-3xl font-black text-slate-900 mb-4">Türkiye’de yetkili çözüm ortağınız</h3>
               <p className="text-slate-400 leading-relaxed mb-6">
                  RobotSepeti Teknoloji A.Ş., endüstriyel Ar-Ge projelerine, teknokent girişimlerine ve KOBİ’lere robotik entegrasyon desteği sunar.
               </p>
               <ul className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300 font-medium">
                  <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="text-orange-500" size={18}/> TL, USD ve EUR ile fiyatlandırma</li>
                  <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="text-orange-500" size={18}/> Yerel stok ve yedek parça</li>
                  <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="text-orange-500" size={18}/> Farklı markalarla robotik entegrasyon</li>
                  <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="text-orange-500" size={18}/> B2B mühendislik desteği ve kurulum</li>
               </ul>
             </div>
             <div className="lg:w-1/3 flex flex-col items-center lg:items-end w-full">
                <Magnetic strength={0.2}>
                  <a href={gmailLink('UFACTORY distribütör iletişim talebi', 'Merhaba,\n\nUFACTORY ürünleri hakkında bilgi almak istiyorum.\n\nFirma adı:\nAd soyad:\nTelefon:\nİlgilendiğim ürün/uygulama:\n\nTeşekkürler.')} target="_blank" rel="noopener noreferrer" className="btn-glow w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-orange-600/30 mb-4 inline-block text-center">
                    Distribütörle iletişime geç
                  </a>
                </Magnetic>
                <a href="tel:+902126976214" className="text-slate-500 font-bold flex items-center gap-2 hover:text-orange-600">+90 212 697 62 14 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span></a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="mt-2 text-[#128C7E] font-bold flex items-center gap-2 hover:text-[#075E54]"><WhatsAppIcon size={20} /> WhatsApp: {WHATSAPP_DISPLAY}</a>
             </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-300 pb-12 mb-12">
            <div className="flex items-center gap-6 mb-6 md:mb-0">
              {/* Robot Sepeti Logo - Footer */}
              <a href="https://www.robotsepeti.com/" target="_blank" rel="noopener noreferrer" aria-label="RobotSepeti mağazasına git" className="flex items-center">
                <img src="/images/robotsepeti_logo_cropped.png" alt="RobotSepeti — UFACTORY Türkiye yetkili distribütörü" className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
              </a>
              {/* Divider */}
              <div className="h-10 w-px bg-slate-300"></div>
              {/* UFACTORY Logo - Footer */}
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                  <polygon points="20,2 37,11 37,29 20,38 3,29 3,11" fill="#EC6408" stroke="#EC6408" strokeWidth="1"/>
                  <text x="20" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">UF</text>
                </svg>
                <div className="leading-none">
                  <span className="block font-bold text-lg text-slate-900 tracking-wider">UFACTORY</span>
                  <span className="block text-[10px] text-slate-500 font-bold tracking-[0.15em] mt-1">TÜRKİYE DİSTRİBÜTÖRÜ</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
            <div>
              <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-wider">İletişim</h4>
              <ul className="space-y-4">
                <li className="font-bold text-slate-900">Telefon: <a href="tel:+902126976214" className="hover:text-orange-500">+90 212 697 62 14</a></li>
                <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#128C7E] font-semibold hover:text-[#075E54]"><WhatsAppIcon size={18} /> WhatsApp: {WHATSAPP_DISPLAY}</a></li>
                <li>Kurumsal teklif: <a href={gmailLink('UFACTORY kurumsal teklif talebi', 'Merhaba,\n\nUFACTORY ürünleri için teklif almak istiyorum.\n\nFirma adı:\nAd soyad:\nTelefon:\nİlgilendiğim ürün:\n\nTeşekkürler.')} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">kurumsal@robotsepeti.com</a></li>
                <li>Teknik destek: <a href="mailto:destek@robotsepeti.com" className="hover:text-orange-500">destek@robotsepeti.com</a></li>
                <li>Web: <a href="https://www.robotsepeti.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">www.robotsepeti.com</a></li>
                <li className="leading-relaxed text-slate-500 mt-4">RobotSepeti Teknoloji A.Ş. — İstasyon Mah., Halkalı İstasyon Cad. No: 38/1, Küçükçekmece, İstanbul</li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-wider">Hızlı bağlantılar</h4>
              <ul className="space-y-4">
                <li><a href="https://www.robotsepeti.com/ufactory" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">Tüm UFACTORY ürünleri (RobotSepeti)</a></li>
                <li><a href="#katalog" className="hover:text-orange-500 transition-colors">Robot kolları ve teknik özellikler</a></li>
                <li><a href="#yazilim" className="hover:text-orange-500 transition-colors">Yazılım ekosistemi ve güvenlik</a></li>
                <li><a href="https://github.com/xArm-Developer" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">xArm SDK ve ROS / ROS 2 (GitHub)</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-wider">Yetkili distribütör güvencesi</h4>
              <p className="leading-relaxed mb-4 text-slate-500">
                UFACTORY ürünleri dünya genelinde 80’den fazla ülkede aktif üretim ve Ar-Ge sistemlerinde çalışmaktadır. RobotSepeti, bu kalitenin Türkiye’deki tek resmî ve yetkili distribütörüdür. Tüm ürünler yerel garanti ve mühendislik desteği altındadır.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center text-[10px] text-slate-600 font-bold tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} RobotSepeti Teknoloji A.Ş. ve UFACTORY. Tüm hakları saklıdır. UFACTORY Türkiye yetkili distribütörü.
          </div>
        </div>
      </footer>
      <button
        type="button"
        aria-label="Sayfanın başına dön"
        title="Yukarı dön"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[80] grid h-10 w-10 place-items-center rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/25 transition-transform hover:-translate-y-1 hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        <span aria-hidden="true" className="text-2xl leading-none">↑</span>
      </button>

    </div>
  );
};

export default App;
