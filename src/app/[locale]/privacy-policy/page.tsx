import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Shield } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy" });
  return {
    title: t("title"),
    description: t("intro"),
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy" });

  const sections = [
    { title: t("section1Title"), text: t("section1Text") },
    { title: t("section2Title"), text: t("section2Text") },
    { title: t("section3Title"), text: t("section3Text") },
    { title: t("section4Title"), text: t("section4Text") },
    { title: t("section5Title"), text: t("section5Text") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group font-semibold"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {t("backToHome")}
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{t("title")}</h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">{t("lastUpdated")}</p>
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 mt-8 border-t border-border/40 pt-8">
          <p className="text-muted-foreground leading-relaxed font-medium">{t("intro")}</p>

          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-xl font-bold tracking-tight text-foreground">{section.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
