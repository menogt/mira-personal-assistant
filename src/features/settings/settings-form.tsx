"use client";

import { useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Moon, Save, Sun } from "lucide-react";

import { updateSettingsAction, type SettingsInput } from "@/features/settings/actions";
import { TIMEZONES, type AppTimezone } from "@/lib/constants";
import type { ActionResult } from "@/lib/action-result";
import type { Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const clientSettingsSchema = z.object({
  display_name: z.string().trim().min(1, "Display name is required.").max(80),
  timezone: z.enum(TIMEZONES),
});

export function SettingsForm({ profile }: { profile: Profile }) {
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const form = useForm<SettingsInput>({
    resolver: zodResolver(clientSettingsSchema),
    defaultValues: {
      display_name: profile.display_name || "Menaka",
      timezone: safeTimezone(profile.timezone),
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const response = await updateSettingsAction(values);
      setResult(response);
    });
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-md border border-zinc-800 bg-zinc-950 p-5">
        <div className="space-y-2">
          <Label htmlFor="display_name">Display name</Label>
          <Input id="display_name" {...form.register("display_name")} />
          <FieldError message={form.formState.errors.display_name?.message} />
        </div>

        <div className="space-y-2">
          <Label>Timezone</Label>
          <Controller
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((timezone) => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={form.formState.errors.timezone?.message} />
        </div>

        {result ? (
          <p
            role="status"
            className={
              result.ok
                ? "rounded-md border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200"
                : "rounded-md border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-200"
            }
          >
            {result.message}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Saving..." : "Save settings"}
        </Button>
      </form>

      <section className="rounded-md border border-zinc-800 bg-zinc-950 p-5">
        <h2 className="text-lg font-semibold text-zinc-50">Theme</h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-4 w-4" aria-hidden="true" />
            Dark
          </Button>
          <Button
            type="button"
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
          >
            <Sun className="h-4 w-4" aria-hidden="true" />
            Light
          </Button>
        </div>
      </section>
    </div>
  );
}

function safeTimezone(value: string): AppTimezone {
  return TIMEZONES.includes(value as AppTimezone) ? (value as AppTimezone) : "Asia/Colombo";
}
