"use client";

import DashboardShell from "@/app/components/dashboard/DashboardShell";
import {
    formatInr,
    formatNumber,
    getCropName,
} from "@/app/components/dashboard/dashboardConfig";

export default function EconomicsPage() {
    return (
        <DashboardShell>
            {({ recommendation, language, t }) => {
                const crops = recommendation?.top_5_crops || [];

                return (
                    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0d]">
                        <div className="border-b border-white/10 p-6">
                            <h2 className="text-2xl font-bold">
                                {t.economicsTitle}
                            </h2>
                            <p className="mt-2 text-gray-500">
                                {t.economicsCopy}
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-white/[0.03] text-gray-400">
                                    <tr>
                                        <Th>{t.crop}</Th>
                                        <Th>{t.yield}</Th>
                                        <Th>{t.price}</Th>
                                        <Th>{t.cost}</Th>
                                        <Th>{t.revenue}</Th>
                                        <Th>{t.profitLoss}</Th>
                                        <Th>{t.roi}</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {crops.map((crop) => {
                                        const economics =
                                            crop.economics || {};

                                        return (
                                            <tr
                                                key={crop.rank}
                                                className="border-t border-white/10"
                                            >
                                                <Td className="font-semibold capitalize">
                                                    {getCropName(
                                                        crop.crop,
                                                        language
                                                    )}
                                                </Td>
                                                <Td>
                                                    {formatNumber(
                                                        economics.yield_kg,
                                                        0
                                                    )}{" "}
                                                    kg
                                                </Td>
                                                <Td>
                                                    {formatInr(
                                                        economics.price_per_kg_inr
                                                    )}
                                                    /kg
                                                </Td>
                                                <Td>
                                                    {formatInr(
                                                        economics.total_cost_inr
                                                    )}
                                                </Td>
                                                <Td>
                                                    {formatInr(
                                                        economics.revenue_inr
                                                    )}
                                                </Td>
                                                <Td
                                                    className={
                                                        economics.profit_inr >= 0
                                                            ? "text-green-300"
                                                            : "text-red-300"
                                                    }
                                                >
                                                    {formatInr(
                                                        economics.profit_inr
                                                    )}
                                                </Td>
                                                <Td>
                                                    {formatNumber(
                                                        economics.roi_pct
                                                    )}
                                                    %
                                                </Td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            }}
        </DashboardShell>
    );
}

function Th({ children }) {
    return <th className="px-5 py-4 font-medium">{children}</th>;
}

function Td({ children, className = "" }) {
    return (
        <td className={`whitespace-nowrap px-5 py-4 ${className}`}>
            {children}
        </td>
    );
}
