"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();

  const getLanguageDisplayName = (locale: string) => {
    switch (locale) {
      case "en":
        return "English";
      case "ru":
        return "Русский";
      case "ua":
        return "Українська";
      case "ja":
        return "日本語";
      case "de":
        return "Deutsch";
      default:
        return "English";
    }
  };

  const handleLocaleChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger
        className={cn("", className)}
        aria-label="Language Selector"
      >
        <div className="flex items-center gap-3">
          <Globe className="size-4 opacity-50" />
          <SelectValue>{getLanguageDisplayName(locale)}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent align="start">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ua">Українська</SelectItem>
        <SelectItem value="ru">Русский</SelectItem>
        <SelectItem value="ja">日本語</SelectItem>
        <SelectItem value="de">Deutsch</SelectItem>
      </SelectContent>
    </Select>
  );
}
