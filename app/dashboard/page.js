"use client";

import { motion } from "motion/react";
import DashboardShell from "@/app/components/dashboard/DashboardShell";
import {
    cropConfidence,
    formatNumber,
    getCropName,
} from "@/app/components/dashboard/dashboardConfig";

export default function DashboardPage() {
    return (
        <DashboardShell>
            {({
                user,
                weatherLookup,
                overviewRecommendation,
                overviewLoading,
                overviewError,
                language,
                t,
            }) => {
                const weather = weatherLookup?.weather || {};
                const soil = weatherLookup?.soil || {};
                const crops =
                    overviewRecommendation?.top_5 ||
                    overviewRecommendation?.top_5_crops ||
                    [];
                const bestCrop = crops[0];

                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                            {[
                                {
                                    title:
                                        t.thirtyDayTemperature ||
                                        t.temperature,
                                    value: `${formatNumber(
                                        weather.temperature
                                    )} C`,
                                    color: "text-cyan-300",
                                },
                                {
                                    title: t.humidity,
                                    value: `${formatNumber(
                                        weather.humidity
                                    )}%`,
                                    color: "text-blue-300",
                                },
                                {
                                    title:
                                        t.thirtyDayTotalRainfall ||
                                        t.thirtyDayRainfall,
                                    value: `${formatNumber(
                                        weather.rainfall_total_30d
                                    )} mm`,
                                    color: "text-green-300",
                                },
                                {
                                    title: t.soilPH,
                                    value: formatNumber(soil.ph),
                                    color: "text-amber-300",
                                },
                                {
                                    title: t.nitrogen,
                                    value: formatNumber(soil.nitrogen),
                                    color: "text-orange-300",
                                },
                            ].map((card, index) => (
                                <motion.div
                                    key={card.title}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.06 }}
                                    className="rounded-lg border border-white/10 bg-[#0d0d0d] p-5"
                                >
                                    <p className="text-sm text-gray-500">
                                        {card.title}
                                    </p>
                                    <p
                                        className={`mt-3 text-3xl font-bold ${card.color}`}
                                    >
                                        {card.value}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <section className="rounded-lg border border-white/10 bg-[#0d0d0d] p-6 xl:col-span-2">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold">
                                        {t.topCropRecommendations}
                                    </h2>
                                    <p className="mt-2 text-gray-500">
                                        {t.overviewApiCopy}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {overviewLoading && (
                                        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-4 text-cyan-100">
                                            {t.loadingOverview}
                                        </div>
                                    )}
                                    {overviewError && (
                                        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-100">
                                            {overviewError}
                                        </div>
                                    )}
                                    {crops.map((crop, index) => (
                                        <div
                                            key={crop.rank || crop.crop || index}
                                            className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                                        >
                                            <div className="mb-3 flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        {t.rank} #
                                                        {crop.rank || index + 1}
                                                    </p>
                                                    <h3 className="text-xl font-semibold capitalize">
                                                        {getCropName(
                                                            crop.crop ||
                                                                crop.name ||
                                                                crop.label,
                                                            language
                                                        )}
                                                    </h3>
                                                </div>
                                                <span className="font-semibold text-green-300">
                                                    {formatNumber(
                                                        cropConfidence(crop)
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                                <div
                                                    className="h-full rounded-full bg-green-400"
                                                    style={{
                                                        width: `${Math.min(
                                                            cropConfidence(crop),
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="rounded-lg border border-white/10 bg-[#0d0d0d] p-6">
                                <h2 className="text-2xl font-bold">
                                    {t.overviewSource}
                                </h2>
                                <p className="mt-3 text-gray-400">
                                    {t.overviewSourceCopy}
                                </p>

                                {bestCrop && (
                                    <div className="mt-6 space-y-4">
                                        <div className="rounded-lg bg-green-500/10 p-4">
                                            <p className="text-sm text-gray-400">
                                                {t.bestCrop}
                                            </p>
                                            <p className="mt-2 text-3xl font-bold text-green-300">
                                                {(
                                                    getCropName(
                                                        bestCrop.crop ||
                                                            bestCrop.name ||
                                                            bestCrop.label,
                                                        language
                                                    )
                                                )?.toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="text-sm">
                                            <div className="rounded-lg border border-white/10 p-3">
                                                <p className="text-gray-500">
                                                    {t.area}
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                    {user.land_area_acres}{" "}
                                                    {t.acres}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                );
            }}
        </DashboardShell>
    );
}
