import Link from "next/link";
import {
  FaProjectDiagram,
  FaEnvelope,
  FaHome,
  FaSignOutAlt,
  FaQuoteRight,
} from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 border-l border-white/5 flex-shrink-0">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">لوحة التحكم</h2>
          <span className="text-xs text-yellow-500">Our Home Admin</span>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/admin/projects"
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition"
          >
            <FaProjectDiagram />
            <span>إدارة المشاريع</span>
          </Link>

          <Link
            href="/admin/inquiries"
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition"
          >
            <FaEnvelope />
            <span>رسائل العملاء</span>
          </Link>

          <Link
            href="/admin/testimonials"
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition"
          >
            <FaQuoteRight />
            <span>إدارة الآراء</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white mt-8 transition"
          >
            <FaHome />
            <span>العودة للموقع</span>
          </Link>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition mt-4"
            >
              <FaSignOutAlt />
              <span>تسجيل خروج</span>
            </button>
          </form>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
