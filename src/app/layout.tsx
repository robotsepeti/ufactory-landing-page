import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "uFactory Robot Kolu Türkiye | Robotsepeti Yetkili Distribütör",
  description: "Türkiye'nin uFactory yetkili distribütörü Robotsepeti ile xArm, Lite6 ve Lite6 Pro robot kollarını inceleyin. Teknik destek ve hızlı teslimat.",
  metadataBase: new URL("https://ufactory.robotsepeti.com"),
  alternates: {
    canonical: "/",
  },
  keywords: "uFactory robot kolu, uFactory Türkiye, uFactory distribütör, xArm 6 eksenli robot, cobot Türkiye, endüstriyel robot kolu, pick and place robotu",
  authors: [{ name: "Robotsepeti" }],
  creator: "Robotsepeti",
  publisher: "Robotsepeti",
  openGraph: {
    title: "uFactory Robot Kolu | Robotsepeti",
    description: "Türkiye yetkili distribütörü Robotsepeti güvencesiyle xArm ve Lite6 endüstriyel robot kollarını keşfedin.",
    url: "https://ufactory.robotsepeti.com/",
    siteName: "Robotsepeti",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://ufactory.robotsepeti.com/images/ufactory_logo_bg.png",
        width: 1200,
        height: 630,
        alt: "uFactory Robot Kolu - Robotsepeti",
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
      "name": "Robotsepeti",
      "url": "https://www.robotsepeti.com",
      "description": "uFactory yetkili distribütörü",
      "logo": "https://ufactory.robotsepeti.com/images/robotsepeti_logo_cropped.png"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "uFactory ürünleri Türkiye garantisi kapsamında mı?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Evet, Robotsepeti üzerinden satın alınan tüm uFactory ürünleri resmi Türkiye distribütörü garantisi altındadır ve teknik destek tarafımızca sağlanmaktadır."
          }
        },
        {
          "@type": "Question",
          "name": "Hangi robot kolu benim endüstriyel projeme daha uygun?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Seçim yaparken payload kapasitesi ve tekrar konumlandırma hassasiyeti kritiktir. xArm 6 genel endüstriyel kullanım, xArm 7 ise engelden kaçınma ve dar alanlar için idealdir. Detaylı teknik analiz için mühendislik ekibimizle görüşebilirsiniz."
          }
        },
        {
          "@type": "Question",
          "name": "xArm serisi için hangi programlama dilleri destekleniyor?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "uFactory robot kolları tamamen açık mimariye sahiptir. ROS, ROS2 desteğinin yanı sıra kapsamlı Python SDK ve C++ kütüphaneleri ile programlanabilir. Ayrıca Modbus TCP üzerinden endüstriyel haberleşme mümkündür."
          }
        },
        {
          "@type": "Question",
          "name": "Kurulum ve robot kolu programlama eğitim desteğiniz var mı?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Evet, Robotsepeti olarak uFactory cobot sistemlerinin sahada kurulumu, entegrasyonu ve teknik personeliniz için temel robot kolu programlama eğitimlerini sağlıyoruz."
          }
        },
        {
          "@type": "Question",
          "name": "uFactory ürünlerinde teslimat süreleri nedir?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Popüler xArm ve Lite6 modellerinin stok durumuna göre teslimatlarımız doğrudan Türkiye depomuzdan veya hızlı tedarik zincirimiz üzerinden 2-4 hafta içerisinde gerçekleşmektedir."
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
