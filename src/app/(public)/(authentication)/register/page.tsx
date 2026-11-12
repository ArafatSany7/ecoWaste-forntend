import { RegisterForm } from "@/components/form/register-form";
import { AuthSplit } from "@/components/auth/AuthSplit";

export default function RegisterPage() {
  return (
    <AuthSplit
      formSide="right"
      headline="Join the network making waste smarter."
      sub="Create a free account to report waste, follow collectors live and see your impact."
    >
      <RegisterForm />
    </AuthSplit>
  );
}
