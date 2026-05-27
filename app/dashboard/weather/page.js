"use client";

import DashboardShell from "@/app/components/dashboard/DashboardShell";
import { formatNumber } from "@/app/components/dashboard/dashboardConfig";

export default function WeatherPage() {
    return (
        <DashboardShell>
            {({ weatherLookup, forecast, forecastLoading, forecastError, t }) => {
                const weather = weatherLookup?.weather || {};

                return (
                    <div className="space-y-8">
                        <section className="rounded-lg border border-white/10 bg-[#0d0d0d] p-6">
                            <h2 className="text-2xl font-bold">
                                {t.liveWeatherInputs}
                            </h2>
                            <p className="mt-2 text-gray-500">
                                {weather.source}
                            </p>
                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                                <Metric
                                    label={t.thirtyDayTemperature}
                                    value={`${formatNumber(
                                        weather.temperature
                                    )} C`}
                                />
                                <Metric
                                    label={t.humidity}
                                    value={`${formatNumber(
                                        weather.humidity
                                    )}%`}
                                />
                                <Metric
                                    label={t.thirtyDayAvgRainfall}
                                    value={`${formatNumber(
                                        weather.rainfall
                                    )} mm`}
                                />
                                <Metric
                                    label={t.thirtyDayTotalRainfall}
                                    value={`${formatNumber(
                                        weather.rainfall_total_30d
                                    )} mm`}
                                />
                            </div>
                        </section>

                        <section className="rounded-lg border border-white/10 bg-[#0d0d0d] p-6">
                            <h2 className="text-2xl font-bold">
                                {t.fiveDayForecast}
                            </h2>
                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
                                {forecastLoading ? (
                                    <p className="text-gray-500">
                                        {t.loadingForecast}
                                    </p>
                                ) : forecastError ? (
                                    <p className="text-amber-200">
                                        {forecastError}
                                    </p>
                                ) : forecast.length ? (
                                    forecast.map((day) => (
                                        <div
                                            key={day.dt_txt}
                                            className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-center"
                                        >
                                            <p className="font-semibold">
                                                {new Date(
                                                    day.dt_txt
                                                ).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                })}
                                            </p>
                                            <p className="mt-4 text-3xl font-bold text-cyan-300">
                                                {Math.round(day.main.temp)} C
                                            </p>
                                            <p className="mt-2 text-sm text-gray-500">
                                                {day.weather?.[0]?.main}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">
                                        {t.forecastMissing}
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>
                );
            }}
        </DashboardShell>
    );
}

function Metric({ label, value }) {
    return (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-3 text-3xl font-bold">{value}</p>
        </div>
    );
}
