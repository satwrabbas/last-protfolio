"use client";

import Image from "next/image";
import { login } from "./actions";
import { useActionState } from "react";
import { FaLock } from "react-icons/fa";

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    login as any,
    initialState
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block rounded-2xl bg-yellow-500/10  mb-4">
            <div className="relative w-16 h-16">
              {" "}
              <Image
                src="/logo.svg"
                alt="Our-Home Logo"
                fill
                className="object-cover rounded-xl group-hover:scale-105 transition duration-300"
                sizes="(max-width: 768px) 48px, 48px"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">تسجيل الدخول</h1>
          <p className="text-slate-400 text-sm mt-2">لوحة تحكم Our Home</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              البريد الإلكتروني
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              كلمة المرور
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {isPending ? (
              "جاري التحقق..."
            ) : (
              <>
                <FaLock size={14} />
                <span>دخول آمن</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
