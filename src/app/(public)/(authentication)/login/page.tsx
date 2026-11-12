import { LoginForm } from "@/components/form/login-form";
import { Reveal } from "@/components/motion/primitives";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-28 site-grain">
      <div className="pointer-events-none absolute inset-0 site-grid" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-[600px] -translate-x-1/2 rounded-full bg-[oklch(0.88_0.2_128/0.3)] blur-[110px]" />
      <Reveal y={50} className="relative z-10 w-full max-w-md">
        <div className="site-glass rounded-3xl p-8 md:p-10">
          <LoginForm />
        </div>
      </Reveal>
    </div>
  );
}
