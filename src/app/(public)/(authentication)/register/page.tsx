import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { RegisterForm } from "@/components/form/register-form";

export default function RegisterPage() {
  return (
    <MaxWidthWrapper className="py-24 flex items-center justify-center min-h-[80vh]">
      <RegisterForm />
    </MaxWidthWrapper>
  );
}
