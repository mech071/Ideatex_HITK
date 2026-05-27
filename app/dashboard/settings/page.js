"use client";

import { useState } from "react";
import DashboardShell from "@/app/components/dashboard/DashboardShell";
import { refreshDashboardData } from "@/app/components/dashboard/useDashboardData";

export default function SettingsPage() {
    return (
        <DashboardShell>
            {({ user, t }) => (
                <SettingsForm
                    key={`${user?.email}:${user?.district}:${user?.land_area_acres}`}
                    user={user}
                    t={t}
                />
            )}
        </DashboardShell>
    );
}

function SettingsForm({ user, t }) {
    const [district, setDistrict] = useState(user?.district || "");
    const [landArea, setLandArea] = useState(user?.land_area_acres || "");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        if (!district.trim()) {
            setError(t.districtRequired);
            return;
        }

        if (Number(landArea) <= 0) {
            setError(t.landAreaRequired);
            return;
        }

        setSaving(true);

        try {
            const response = await fetch("/api/user", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    district,
                    land_area_acres: Number(landArea),
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t.settingsError);
            }

            setMessage(t.settingsSaved);
            refreshDashboardData();
        } catch (error) {
            setError(error.message || t.settingsError);
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="rounded-lg border border-white/10 bg-[#0d0d0d] p-6">
            <h2 className="text-2xl font-bold">{t.settings}</h2>
            <p className="mt-3 text-gray-500">{t.settingsCopy}</p>

            <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-5">
                <label className="block">
                    <span className="text-sm font-medium text-gray-300">
                        {t.district}
                    </span>
                    <input
                        type="text"
                        value={district}
                        onChange={(event) => {
                            setDistrict(event.target.value);
                            setError("");
                            setMessage("");
                        }}
                        className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-green-400"
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-medium text-gray-300">
                        {t.landAreaAcres}
                    </span>
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={landArea}
                        onChange={(event) => {
                            setLandArea(event.target.value);
                            setError("");
                            setMessage("");
                        }}
                        className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-green-400"
                    />
                </label>

                {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-100">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-green-100">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-green-400 px-5 py-3 font-semibold text-black transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? t.savingSettings : t.saveSettings}
                </button>
            </form>
        </section>
    );
}
