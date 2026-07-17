import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type CustomerRedirectProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerRedirect({ searchParams }: CustomerRedirectProps) {
  const params = searchParams ? await searchParams : {};
  const model = Array.isArray(params.model) ? params.model[0] : params.model;

  if (model) {
    redirect(`/user/models/${model}`);
  }

  redirect("/user");
}
