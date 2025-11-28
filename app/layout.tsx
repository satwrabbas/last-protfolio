// app/layout.tsx

// استيراد الأنواع اللازمة من Next.js، مثل "Metadata" لتعريف بيانات الصفحة الوصفية (SEO).
import type { Metadata } from "next";

// استيراد الخطوط من مكتبة next/font/google.
// Geist هو خط عصري ونظيف. تم استيراد النسخة العادية (Geist) والنسخة ذات العرض الثابت (Geist_Mono).
import { Geist, Geist_Mono } from "next/font/google";

// استيراد ملف الأنماط العام (CSS) الذي سيتم تطبيقه على كامل التطبيق.
import "./globals.css";

// 1. استيراد الـ AuthProvider الذي أنشأناه
// هذا هو السطر الأهم هنا. نحن نستورد المكون الذي يحتوي على منطق المصادقة.
import { AuthProvider } from "./components/AuthProvider";
import Header from "./components/Header";

// إعداد الخطوط:
// هنا نقوم بتهيئة الخطوط مع الخيارات اللازمة.
const geistSans = Geist({
  // --font-geist-sans هو متغير CSS سيحمل هذا الخط.
  variable: "--font-geist-sans",
  // تحديد مجموعة الأحرف التي سيتم تحميلها، "latin" هي للأحرف الإنجليزية.
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// تعريف البيانات الوصفية (Metadata) للصفحة.
// هذه المعلومات تستخدمها محركات البحث والمتصفحات.
export const metadata: Metadata = {
  title: "منصة البكلوريا التعليمية", // عنوان الصفحة الذي يظهر في تبويب المتصفح.
  description: "مشروع تعليمي متكامل باستخدام Next.js", // وصف الصفحة.
};

// هذا هو المكون الرئيسي للتنسيق الجذري (Root Layout).
export default function RootLayout({
  children, // 'children' هو خاصية (prop) خاصة في React تمثل أي صفحة أو مكون سيتم عرضه داخل هذا التنسيق.
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // تعريف اللغة العربية ('ar') واتجاه النص من اليمين إلى اليسار ('rtl') على مستوى الصفحة بأكملها.
    <html lang="ar" dir="rtl">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body
        // دمج متغيرات الخطوط في اسم الكلاس (className) للـ body.
        // هذا يجعل الخطوط متاحة للاستخدام في أي مكان في التطبيق عبر متغيرات CSS.
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 2. قم بتغليف {children} بالـ AuthProvider */}
        {/* هذا هو جوهر الموضوع! */}
        {/* نحن نضع <AuthProvider> كغلاف حول {children}. */}
        {/* بما أن {children} يمثل كل صفحات التطبيق، فهذا يعني أن AuthProvider */}
        {/* أصبح الآن "الأب الأعلى" لجميع مكونات التطبيق. */}
        {/* هذا يسمح لأي مكون، مهما كان عمقه في شجرة المكونات، بالوصول إلى بيانات المستخدم */}
        {/* التي يوفرها AuthProvider. */}
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
