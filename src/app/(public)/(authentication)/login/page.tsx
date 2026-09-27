import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { LoginForm } from "@/components/form/login-form";

export default function LoginPage() {
  return (
    <MaxWidthWrapper className="py-24 flex items-center justify-center min-h-[80vh]">
      <LoginForm />
    </MaxWidthWrapper>
  );
}
