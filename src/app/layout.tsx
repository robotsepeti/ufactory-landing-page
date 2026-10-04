import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UFACTORY robot kolları Türkiye | RobotSepeti yetkili distribütör",
  description: "Türkiye’nin UFACTORY yetkili distribütörü RobotSepeti ile xArm, 850, Lite6 robot kollarını ve aksesuarlarını inceleyin. Teknik özellikler, model seçenekleri ve kurumsal teklif.",
  metadataBase: new URL("https://ufactory.robotsepeti.com"),
  alternates: {
    canonical: "/",
  },
  keywords: "UFACTORY robot kolu, UFACTORY Türkiye, UFACTORY distribütör, xArm 6 eksenli robot, cobot Türkiye, endüstriyel robot kolu, pick and place robotu",
  authors: [{ name: "RobotSepeti" }],
  creator: "RobotSepeti",
  publisher: "RobotSepeti",
  openGraph: {
    title: "UFACTORY robot kolları | RobotSepeti",
    description: "Türkiye yetkili distribütörü RobotSepeti güvencesiyle xArm ve Lite6 endüstriyel robot kollarını keşfedin.",
    url: "https://ufactory.robotsepeti.com/",
    siteName: "RobotSepeti",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://ufactory.robotsepeti.com/images/ufactory_logo_bg.png",
        width: 1200,
        height: 630,
        alt: "UFACTORY robot kolları — RobotSepeti",
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "RobotSepeti",
      "url": "https://www.robotsepeti.com",
      "description": "UFACTORY yetkili distribütörü",
      "logo": "https://ufactory.robotsepeti.com/images/robotsepeti_logo_cropped.png"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Hangi robot kolu benim endüstriyel projeme daha uygun?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Seçim yaparken taşıma kapasitesi ve tekrar konumlandırma hassasiyeti kritiktir. xArm 6 genel endüstriyel kullanım, xArm 7 ise engelden kaçınma ve dar alanlar için idealdir. Detaylı teknik analiz için mühendislik ekibimizle görüşebilirsiniz."
          }
        },
        {
          "@type": "Question",
          "name": "xArm serisi için hangi programlama dilleri destekleniyor?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "UFACTORY robot kolları tamamen açık mimariye sahiptir. ROS, ROS 2 desteğinin yanı sıra kapsamlı Python SDK ve C++ kütüphaneleri ile programlanabilir. Ayrıca Modbus TCP üzerinden endüstriyel haberleşme mümkündür."
          }
        },
        {
          "@type": "Question",
          "name": "Kurulum ve robot kolu programlama eğitim desteğiniz var mı?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Evet, RobotSepeti olarak UFACTORY cobot sistemlerinin sahada kurulumu, entegrasyonu ve teknik personeliniz için temel robot kolu programlama eğitimlerini sağlıyoruz."
          }
        },
        {
          "@type": "Question",
          "name": "UFACTORY ürünlerinde teslimat süreleri nedir?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Teslim süresi seçilen model, kontrol kutusu, aksesuarlar ve güncel stok durumuna göre değişir. Ürün sayfasındaki stok bilgisini inceleyebilir veya RobotSepeti ekibinden siparişe özel teslim süresi alabilirsiniz."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
