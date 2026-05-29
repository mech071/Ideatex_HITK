"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    BarChart3,
    Calculator,
    ClipboardList,
    Cloud,
    CloudSun,
    FlaskConical,
    LoaderCircle,
    LogOut,
    Menu,
    Settings,
    ShieldAlert,
    Sprout,
    X,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
    dashboardTranslations,
    getCropName,
    sidebarItems,
} from "./dashboardConfig";
import {
    clearDashboardDataCache,
    useDashboardData,
} from "./useDashboardData";

const getTitleKey = (pathname) =>
    sidebarItems.find((item) => item.href === pathname)?.key || "overview";

const itemIcons = {
    "/dashboard": ClipboardList,
    "/dashboard/crop-recommendation": Sprout,
    "/dashboard/weather": Cloud,
    "/dashboard/soil": FlaskConical,
    "/dashboard/risk-analysis": ShieldAlert,
    "/dashboard/economics": Calculator,
    "/dashboard/settings": Settings,
};

export default function DashboardShell({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState(() => {
        if (typeof window === "undefined") return "en";

        const savedLanguage = window.localStorage.getItem(
            "prakriti-dashboard-language"
        );

        return dashboardTranslations[savedLanguage] ? savedLanguage : "en";
    });
    const data = useDashboardData();
    const t = dashboardTranslations[language] || dashboardTranslations.en;
    const activeTitle = t[getTitleKey(pathname)];
    const isOverview = pathname === "/dashboard";

    const changeLanguage = (nextLanguage) => {
        setLanguage(nextLanguage);
        window.localStorage.setItem(
            "prakriti-dashboard-language",
            nextLanguage
        );
    };

    const handleLogout = async () => {
        await signOut(auth);
        clearDashboardDataCache();
        router.push("/login");
    };

    if (data.loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 text-white">
                <div className="flex flex-col items-center gap-5 text-center">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-green-400/20 bg-green-400/10">
                        <div className="absolute inset-0 rounded-full border border-green-300/30 animate-ping" />
                        <LoaderCircle
                            size={34}
                            className="relative text-green-300 animate-spin"
                        />
                    </div>

                    <div>
                        <p className="text-lg font-semibold text-green-100 animate-pulse">
                            {t.loadingDashboard}
                        </p>
                        <div className="mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-green-400" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#080808] text-white flex">
            <button
                type="button"
                aria-label="Open sidebar"
                onClick={() => setOpen(true)}
                className="fixed left-4 top-4 z-40 rounded-lg border border-white/10 bg-[#101010] p-3 text-gray-100 shadow-lg shadow-black/30 transition hover:bg-white/10 lg:hidden"
            >
                <Menu size={20} />
            </button>

            <aside
                className={`fixed lg:sticky top-0 z-50 h-screen border-r border-white/10 bg-[#050505] transition-all duration-300 ${
                    open
                        ? "w-[260px] translate-x-0"
                        : "w-[260px] -translate-x-full lg:w-[88px] lg:translate-x-0"
                }`}
            >
                <div className="flex h-full flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between p-5">
                            {open && (
                                <Link
                                    href="/dashboard"
                                    className="text-3xl font-bold text-green-400"
                                >
                                    Prakriti
                                </Link>
                            )}
                            <button
                                type="button"
                                aria-label="Toggle sidebar"
                                onClick={() => setOpen((value) => !value)}
                                className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-gray-200 transition hover:bg-white/10"
                            >
                                {open ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>

                        <nav className="space-y-2 px-3">
                            {sidebarItems.map((item) => {
                                const active = pathname === item.href;
                                const Icon = itemIcons[item.href] || ClipboardList;
                                const label = t[item.key];

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                                            active
                                                ? "border border-green-500/20 bg-green-500/15 text-green-300"
                                                : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
                                        }`}
                                        title={label}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon size={18} />
                                            {open && <span>{label}</span>}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="border-t border-white/10 p-4">
                        {open && (
                            <div className="mb-4">
                                <p className="font-semibold">
                                    {data.user?.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {data.user?.district} {t.farmer}
                                </p>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-3 text-sm text-red-200 transition hover:bg-red-500/20"
                        >
                            <LogOut size={16} />
                            {open && t.logout}
                        </button>
                    </div>
                </div>
            </aside>

            {open && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <section className="min-w-0 flex-1">
                <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-10 lg:py-10">
                    <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-300">
                                {data.recommendation?.best_crop
                                    ? getCropName(
                                          data.recommendation.best_crop,
                                          language
                                      ).toUpperCase()
                                    : "Prakriti"}
                            </p>
                            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                                {activeTitle}
                            </h1>
                            <p className="mt-2 max-w-2xl text-gray-500">
                                {t.headerCopy}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 md:items-end">
                            <div className="flex gap-2">
                                {[
                                    ["en", t.languageEnglish],
                                    ["hi", t.languageHindi],
                                    ["bn", t.languageBengali],
                                ].map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => changeLanguage(key)}
                                        className={`rounded-lg border px-3 py-1 text-sm transition ${
                                            language === key
                                                ? "border-green-400 bg-green-400 text-black"
                                                : "border-white/10 text-gray-300 hover:bg-white/10"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Sprout size={16} className="text-green-300" />
                                    <span>
                                        {data.user?.land_area_acres || 1}{" "}
                                        {t.acres}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CloudSun size={16} className="text-cyan-300" />
                                    <span>
                                        {data.weatherLookup?.weather
                                            ?.temperature ?? "--"}{" "}
                                        C
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BarChart3
                                        size={16}
                                        className="text-amber-300"
                                    />
                                    <span>
                                        {data.recommendation?.top_5_crops
                                            ?.length || 0}{" "}
                                        {t.crops}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {data.error ? (
                        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-5 text-red-100">
                            {data.error}
                        </div>
                    ) : (
                        <>
                            {!isOverview && data.recommendationLoading && (
                                <div className="mb-6 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-4 text-cyan-100">
                                    {t.loadingNewApi}
                                </div>
                            )}
                            {!isOverview && data.recommendationError && (
                                <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-100">
                                    {t.newApiError} {data.recommendationError}
                                </div>
                            )}
                            {children({ ...data, language, t })}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
