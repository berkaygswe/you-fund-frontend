"use client";

import * as React from "react";
import { format, isValid } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useLocale, useTranslations } from "next-intl";

interface DateTimePickerProps {
  value?: string; // "yyyy-MM-dd'T'HH:mm" or ISO string
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  showTime?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  disabled = false,
  className,
  placeholder,
  showTime = true,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const locale = useLocale();
  const t = useTranslations("Portfolio.DateTimePicker");

  const dateLocale = React.useMemo(() => {
    return locale === "tr" ? tr : enUS;
  }, [locale]);

  // Parse current value to Date
  const parsedDate = React.useMemo(() => {
    if (!value) return new Date();
    const d = new Date(value);
    return isValid(d) ? d : new Date();
  }, [value]);

  const [selectedDate, setSelectedDate] = React.useState<Date>(parsedDate);
  const [timeString, setTimeString] = React.useState<string>(() => {
    return format(parsedDate, "HH:mm");
  });

  // Sync state if external value changes
  React.useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (isValid(d)) {
        setSelectedDate(d);
        setTimeString(format(d, "HH:mm"));
      }
    }
  }, [value]);

  const handleDateSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    const [hours, minutes] = timeString.split(":").map(Number);
    const updated = new Date(newDay);
    updated.setHours(isNaN(hours) ? 0 : hours);
    updated.setMinutes(isNaN(minutes) ? 0 : minutes);
    updated.setSeconds(0);
    updated.setMilliseconds(0);

    setSelectedDate(updated);
    onChange(format(updated, "yyyy-MM-dd'T'HH:mm"));
    if (!showTime) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeString(newTime);
    if (!newTime) return;

    const [hours, minutes] = newTime.split(":").map(Number);
    const updated = new Date(selectedDate);
    updated.setHours(isNaN(hours) ? 0 : hours);
    updated.setMinutes(isNaN(minutes) ? 0 : minutes);
    updated.setSeconds(0);
    updated.setMilliseconds(0);

    setSelectedDate(updated);
    onChange(format(updated, "yyyy-MM-dd'T'HH:mm"));
  };

  const handleSetNow = () => {
    const now = new Date();
    setSelectedDate(now);
    setTimeString(format(now, "HH:mm"));
    onChange(format(now, "yyyy-MM-dd'T'HH:mm"));
    setIsOpen(false);
  };

  const defaultPlaceholder = placeholder || t("placeholder");

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full h-11 justify-start text-left font-normal bg-muted/50 border-white/5 hover:bg-muted/70 hover:border-white/10 transition-all cursor-pointer truncate",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
          {value && isValid(new Date(value)) ? (
            <span className="text-foreground font-medium capitalize">
              {format(
                new Date(value), 
                showTime ? "d MMMM yyyy, HH:mm" : "d MMMM yyyy", 
                { locale: dateLocale }
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">{defaultPlaceholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-auto p-0 bg-background/95 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl max-w-[calc(100vw-2rem)] overflow-hidden" 
        align="start"
        side="bottom"
        sideOffset={4}
        collisionPadding={12}
      >
        <div className="p-2 sm:p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={dateLocale}
            initialFocus
            className="p-1 sm:p-2 [--cell-size:2rem] sm:[--cell-size:2.25rem]"
          />

          {showTime && (
            <div className="border-t border-white/10 pt-2.5 mt-1 flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  type="time"
                  value={timeString}
                  onChange={handleTimeChange}
                  className="h-8 w-24 sm:w-28 bg-muted/50 border-white/10 text-xs font-mono px-2"
                />
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSetNow}
                  className="h-8 px-2.5 text-xs text-primary hover:bg-primary/10 rounded-lg cursor-pointer font-semibold"
                >
                  {t("now")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 px-3 text-xs font-bold rounded-lg cursor-pointer"
                >
                  {t("done")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
