import { Suspense } from "react";
import LoginForm from "./form";

type LoginPageProps = PageProps<"/login">;

async function LoginContent({
  searchParams,
}: Pick<LoginPageProps, "searchParams">) {
  const { authError } = await searchParams;

  return <LoginForm initialGoogleError={authError === "google"} />;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense fallback={<LoginForm />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
