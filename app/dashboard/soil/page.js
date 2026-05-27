"use client";

import DashboardShell from "@/app/components/dashboard/DashboardShell";
import { formatNumber } from "@/app/components/dashboard/dashboardConfig";

export default function SoilPage() {
    return (
        <DashboardShell>
            {({ recommendation, t }) => {
                const soil = recommendation?.soil || {};

                return (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <SoilMetric
                            label={t.nitrogen}
                            value={formatNumber(soil.N)}
                            source={soil.N_source}
                        />
                        <SoilMetric
                            label={t.phosphorus}
                            value={formatNumber(soil.P)}
                            source={soil.P_source}
                        />
                        <SoilMetric
                            label={t.potassium}
                            value={formatNumber(soil.K)}
                            source={soil.K_source}
                        />
                        <SoilMetric
                            label="pH"
                            value={formatNumber(soil.ph)}
                            source={soil.ph_source}
                        />
                    </div>
                );
            }}
        </DashboardShell>
    );
}

function SoilMetric({ label, value, source }) {
    return (
        <article className="rounded-lg border border-white/10 bg-[#0d0d0d] p-6">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-3 text-4xl font-bold text-green-300">{value}</p>
            <p className="mt-5 text-sm leading-6 text-gray-500">{source}</p>
        </article>
    );
}
