import { RegisterForm } from "@/components/form/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden bg-slate-50">
      {/* Soft ambient tints */}
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[400px] bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Crisp White Form Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl p-8 md:p-10 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
        <RegisterForm />
      </div>
    </div>
  );
}
