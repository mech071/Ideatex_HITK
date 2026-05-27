"use client";

import DashboardShell from "@/app/components/dashboard/DashboardShell";
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
                                        {t.rank} #{crop.rank} | {crop.category} |{" "}
                                        {crop.season}
                                    </p>
                                    <h2 className="mt-2 text-3xl font-bold capitalize">
                                        {getCropName(crop.crop, language)}
                                    </h2>
                                    <p className="mt-3 text-gray-500">
                                        {t.duration} {crop.duration_days}{" "}
                                        {t.days}, {t.waterRequirement}{" "}
                                        {formatNumber(crop.water_req_mm)} mm.
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
                                    value={formatInr(
                                        crop.economics?.revenue_inr
                                    )}
                                />
                                <Metric
                                    label={t.profit}
                                    value={formatInr(
                                        crop.economics?.profit_inr
                                    )}
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
                </div>
            )}
        </DashboardShell>
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
