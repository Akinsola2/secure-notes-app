import { Suspense } from "react";
import ForgotPasswordForm from "./form";

type ForgotPasswordPageProps = PageProps<"/forgot-password">;

async function ForgotPasswordContent({
  searchParams,
}: Pick<ForgotPasswordPageProps, "searchParams">) {
  const { resetError } = await searchParams;

  return <ForgotPasswordForm initialError={resetError === "1"} />;
}

export default function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  return (
    <Suspense fallback={<ForgotPasswordForm />}>
      <ForgotPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}
