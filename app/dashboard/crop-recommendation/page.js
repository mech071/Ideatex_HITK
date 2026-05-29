"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import DashboardShell from "@/app/components/dashboard/DashboardShell";
import { regenerateRecommendation } from "@/app/components/dashboard/useDashboardData";
import {
    cropConfidence,
    formatInr,
    formatNumber,
    getCropName,
} from "@/app/components/dashboard/dashboardConfig";

export default function CropRecommendationPage() {
    return (
        <DashboardShell>
            {({ recommendation, language, t }) => (
                <div className="space-y-6">
                    {(recommendation?.top_5_crops || []).map((crop) => (
                        <article
                            key={crop.rank}
                            className="rounded-lg border border-white/10 bg-[#0d0d0d] p-6"
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="text-sm text-green-300">
                                        {t.rank} #{crop.rank} | {crop.category} | {crop.season}
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold capitalize">
                                        {getCropName(crop.crop, language)}
                                    </h2>

                                    <p className="mt-3 text-gray-500">
                                        {t.duration} {crop.duration_days} {t.days},{" "}
                                        {t.waterRequirement} {formatNumber(crop.water_req_mm)} mm.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-5 py-4 text-right">
                                    <p className="text-sm text-gray-400">
                                        {t.confidence}
                                    </p>

                                    <p className="text-3xl font-bold text-green-300">
                                        {formatNumber(cropConfidence(crop))}%
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                                <Metric
                                    label={t.yield}
                                    value={`${formatNumber(
                                        crop.economics?.yield_kg,
                                        0
                                    )} kg`}
                                />

                                <Metric
                                    label={t.revenue}
                                    value={formatInr(crop.economics?.revenue_inr)}
                                />

                                <Metric
                                    label={t.profit}
                                    value={formatInr(crop.economics?.profit_inr)}
                                />

                                <Metric
                                    label="ROI"
                                    value={`${formatNumber(
                                        crop.economics?.roi_pct
                                    )}%`}
                                />
                            </div>
                        </article>
                    ))}

                    <SoilRegenerator recommendation={recommendation} t={t} />
                </div>
            )}
        </DashboardShell>
    );
}

function SoilRegenerator({ recommendation, t }) {
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);

    const [soilForm, setSoilForm] = useState({
        N: recommendation?.soil?.N || "",
        P: recommendation?.soil?.P || "",
        K: recommendation?.soil?.K || "",
        ph: recommendation?.soil?.ph || "",
    });

    const handleRegenerate = async () => {
        try {
            setLoading(true);
            setLoadingStep(0);

            await regenerateRecommendation({
                N: soilForm.N,
                P: soilForm.P,
                K: soilForm.K,
                ph: soilForm.ph,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading) return;

        const messages = t.regenerateLoadingSteps || [];
        if (!messages.length) return;

        const interval = window.setInterval(() => {
            setLoadingStep((step) => (step + 1) % messages.length);
        }, 12000);

        return () => window.clearInterval(interval);
    }, [loading, t.regenerateLoadingSteps]);

    const loadingMessages = t.regenerateLoadingSteps || [];
    const loadingMessage =
        loadingMessages[loadingStep] || t.regeneratingRecommendations;

    return (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-6">
            <h3 className="text-xl font-semibold">
                {t.manualSoilTitle}
            </h3>

            <p className="mt-2 text-gray-400">
                {t.manualSoilCopy}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <Metric
                    label={t.currentNitrogen}
                    value={recommendation?.soil?.N ?? "--"}
                />

                <Metric
                    label={t.currentPhosphorus}
                    value={recommendation?.soil?.P ?? "--"}
                />

                <Metric
                    label={t.currentPotassium}
                    value={recommendation?.soil?.K ?? "--"}
                />

                <Metric
                    label={t.currentPH}
                    value={recommendation?.soil?.ph ?? "--"}
                />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <input
                    type="number"
                    placeholder={t.nitrogenInput}
                    value={soilForm.N}
                    onChange={(e) =>
                        setSoilForm({ ...soilForm, N: e.target.value })
                    }
                    className="rounded-lg border border-white/10 bg-black p-3"
                />

                <input
                    type="number"
                    placeholder={t.phosphorusInput}
                    value={soilForm.P}
                    onChange={(e) =>
                        setSoilForm({ ...soilForm, P: e.target.value })
                    }
                    className="rounded-lg border border-white/10 bg-black p-3"
                />

                <input
                    type="number"
                    placeholder={t.potassiumInput}
                    value={soilForm.K}
                    onChange={(e) =>
                        setSoilForm({ ...soilForm, K: e.target.value })
                    }
                    className="rounded-lg border border-white/10 bg-black p-3"
                />

                <input
                    type="number"
                    step="0.1"
                    placeholder={t.phInput}
                    value={soilForm.ph}
                    onChange={(e) =>
                        setSoilForm({ ...soilForm, ph: e.target.value })
                    }
                    className="rounded-lg border border-white/10 bg-black p-3"
                />
            </div>

            <button
                onClick={handleRegenerate}
                disabled={loading}
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {loading && (
                    <LoaderCircle size={18} className="animate-spin" />
                )}
                {loading
                    ? t.regeneratingRecommendations
                    : t.regenerateRecommendations}
            </button>

            {loading && (
                <div className="mt-5 max-w-xl">
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-full origin-left animate-[regenerate-progress_90s_linear_forwards] rounded-full bg-green-400" />
                    </div>

                    <p className="mt-3 min-h-6 text-sm text-amber-100/80 transition">
                        {loadingMessage}
                    </p>

                    <style jsx>{`
                        @keyframes regenerate-progress {
                            0% {
                                transform: scaleX(0.02);
                            }

                            100% {
                                transform: scaleX(1);
                            }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}

function Metric({ label, value }) {
    return (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-xl font-semibold">{value}</p>
        </div>
    );
}
