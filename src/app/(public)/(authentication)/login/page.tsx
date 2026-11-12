import { LoginForm } from "@/components/form/login-form";
import { AuthSplit } from "@/components/auth/AuthSplit";

export default function LoginPage() {
  return (
    <AuthSplit
      formSide="left"
      headline="Cleaner cities start with one request."
      sub="Sign in to track pickups, manage routes and keep your neighbourhood spotless."
    >
      <LoginForm />
    </AuthSplit>
  );
}
