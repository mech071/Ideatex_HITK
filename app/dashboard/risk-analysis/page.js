"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import DashboardShell from "@/app/components/dashboard/DashboardShell";
import { getCropName } from "@/app/components/dashboard/dashboardConfig";

export default function RiskAnalysisPage() {
    return (
        <DashboardShell>
            {({ recommendation, language, t }) => {
                const crops = recommendation?.top_5_crops || [];
                const alerts = crops.filter((crop) => crop.disease_alert);

                return (
                    <div className="space-y-6">
                        <section className="rounded-lg border border-white/10 bg-[#0d0d0d] p-6">
                            <div className="flex items-start gap-4">
                                {alerts.length ? (
                                    <ShieldAlert className="mt-1 text-amber-300" />
                                ) : (
                                    <ShieldCheck className="mt-1 text-green-300" />
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {t.diseaseRiskFromApi}
                                    </h2>
                                    <p className="mt-2 text-gray-500">
                                        {t.diseaseRiskCopy}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {crops.map((crop) => (
                                <article
                                    key={crop.rank}
                                    className={`rounded-lg border p-5 transition-colors ${crop.disease_alert
                                            ? "border-red-500/20 bg-red-950/30"
                                            : "border-white/10 bg-[#061806]"
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {t.rank} #{crop.rank}
                                            </p>
                                            <h3 className="mt-1 text-xl font-semibold capitalize">
                                                {getCropName(
                                                    crop.crop,
                                                    language
                                                )}
                                            </h3>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm ${crop.disease_alert
                                                ? "bg-amber-500/10 text-amber-200"
                                                : "bg-green-500/10 text-green-300"
                                                }`}
                                        >
                                            {crop.disease_alert
                                                ? t.alert
                                                : t.noAlert}
                                        </span>
                                    </div>
                                    <p className="mt-4 text-gray-400">
                                        {crop.disease_alert ? (
                                            <>
                                                <div className="flex flex-col gap-2">
                                                    <div className="font-semibold text-amber-200">
                                                        <span className="text-red-500">Disease :- </span>
                                                        <span className="text-red-600 font-bold">{crop.disease_alert.disease}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-green-500">Fix :- {crop.disease_alert.action}</span>
                                                    </div>
                                                    <div className="text-red-300">
                                                        Risk :- {crop.disease_alert.risk}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            t.noDiseaseRisk
                                        )}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                );
            }}
        </DashboardShell>
    );
}
