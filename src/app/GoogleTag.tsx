"use client";

import Script from "next/script";
import { useEffect } from "react";

/*
 * Google etiketi (gtag.js) + iletişim tıklaması ölçümü
 *
 * GOOGLE_ADS_ID : RobotSepeti Google Ads hesabı (250-904-2934) etiketi
 * GA4_ID        : robotsepeti.com ile aynı GA4 mülkü (alt alan adı aynı çerezi paylaşır)
 *
 * WhatsApp / telefon tıklamaları:
 *  - GA4'e her zaman "whatsapp_click" / "phone_click" olayı gider.
 *  - Google Ads'te "WhatsApp tıklaması" dönüşüm işlemi oluşturulunca, verilen
 *    etiket (label) aşağıdaki sabitlere yazılır; boşken Ads'e dönüşüm gönderilmez.
 */
const GOOGLE_ADS_ID = "AW-1002448827";
const GA4_ID = "G-1JMD48GTSQ";
const ADS_WHATSAPP_LABEL = "LG2aCK3Y358dELvPgN4D"; // Google Ads: "WhatsApp tıklaması – ufactory" (Kişi, birincil, 17 Eki 2026)
const ADS_PHONE_LABEL = "";

type Gtag = (...args: unknown[]) => void;

function track(kind: "whatsapp" | "phone", href: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function") return;

  gtag("event", kind === "whatsapp" ? "whatsapp_click" : "phone_click", {
    link_url: href,
    page_location: window.location.href,
  });

  const label = kind === "whatsapp" ? ADS_WHATSAPP_LABEL : ADS_PHONE_LABEL;
  if (label) {
    gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${label}`, value: 1.0, currency: "TRY" });
  }
}

export default function GoogleTag() {
  useEffect(() => {
    // Sayfadaki tüm wa.me / api.whatsapp.com / tel: bağlantılarını tek yerden yakalar;
    // ileride eklenecek yeni butonlar da otomatik ölçülür.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(href)) {
        track("whatsapp", href);
      } else if (/^tel:/i.test(href)) {
        track("phone", href);
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
gtag('config', '${GA4_ID}');`}
      </Script>
    </>
  );
}
