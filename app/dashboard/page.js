"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

const sidebarItems = [
    "Overview",
    "Crop Prediction",
    "Weather",
    "Soil Data",
    "Risk Analysis",
    "Alerts",
    "Settings",
];

const Page = () => {

    const [activeTab, setActiveTab] =
        useState("Overview");

    const [manualN, setManualN] =
        useState("");

    const [manualP, setManualP] =
        useState("");

    const [manualK, setManualK] =
        useState("");

    const [manualPH, setManualPH] =
        useState("");

    const [manualCrops, setManualCrops] =
        useState([]);
    const [historicalData, setHistoricalData] =
        useState({
            avgTemp: 0,
            totalRain: 0,
        });

    const [forecastData, setForecastData] =
        useState([]);
    const router = useRouter();

    const [userData, setUserData] = useState(null);

    const [dashboardData, setDashboardData] =
        useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                async (user) => {

                    if (!user) {
                        router.push("/login");
                        return;
                    }

                    try {

                        // USER DATA
                        const userRes = await fetch(
                            `/api/user?email=${user.email}`
                        );

                        const userJson =
                            await userRes.json();

                        setUserData(userJson.user);

                        // WEATHER + SOIL
                        const weatherRes =
                            await fetch("/api/weather", {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/json",
                                },
                                body: JSON.stringify({
                                    district:
                                        userJson.user.district,
                                }),
                            });

                        const weatherJson =
                            await weatherRes.json();
                        // ======================
                        // HISTORICAL DATA
                        // ======================

                        const today =
                            new Date();

                        const endDate =
                            today
                                .toISOString()
                                .split("T")[0];

                        const past =
                            new Date();

                        past.setDate(
                            today.getDate() - 30
                        );

                        const startDate =
                            past
                                .toISOString()
                                .split("T")[0];

                        const historicalRes =
                            await fetch(

                                `https://archive-api.open-meteo.com/v1/archive?latitude=${weatherJson.coordinates.lat}&longitude=${weatherJson.coordinates.lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,precipitation_sum,relative_humidity_2m_mean&timezone=auto`
                            );

                        const historicalJson =
                            await historicalRes.json();

                        const temps =
                            historicalJson?.daily
                                ?.temperature_2m_mean || [];

                        const rains =
                            historicalJson?.daily
                                ?.precipitation_sum || [];
                        const humidities =
                            historicalJson?.daily
                                ?.relative_humidity_2m_mean || [];
                        const avgTemp =
                            temps.length
                                ? (
                                    temps.reduce(
                                        (a, b) => a + b,
                                        0
                                    ) / temps.length
                                ).toFixed(1)
                                : 0;
                        const avgHumidity =
                            humidities.length
                                ? (
                                    humidities.reduce(
                                        (a, b) => a + b,
                                        0
                                    ) / humidities.length
                                ).toFixed(1)
                                : 0;
                        const totalRain =
                            rains.length
                                ? rains.reduce(
                                    (a, b) => a + b,
                                    0
                                ).toFixed(1)
                                : 0;

                        setHistoricalData({

                            avgTemp,

                            avgHumidity,

                            totalRain,
                        });
                        // ======================
                        // FORECAST DATA
                        // ======================

                        const forecastRes =
                            await fetch(

                                `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherJson.coordinates.lat}&lon=${weatherJson.coordinates.lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API}&units=metric`
                            );

                        const forecastJson =
                            await forecastRes.json();

                        const filteredForecast =
                            forecastJson?.list
                                ?.filter(
                                    (_, index) =>
                                        index % 8 === 0
                                )
                                .slice(0, 5);

                        setForecastData(
                            filteredForecast || []
                        );
                        // CROP PREDICTION
                        const cropRes =
                            await fetch(
                                "/api/get-crop-recommendation",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                    body: JSON.stringify({

                                        N:
                                            weatherJson.soil
                                                .nitrogen,

                                        P: 42,

                                        K: 43,

                                        ph:
                                            weatherJson.soil.ph,

                                        temperature:
                                            Number(avgTemp),

                                        humidity:
                                            Number(avgHumidity),

                                        rainfall:
                                            Number(totalRain),
                                    }),
                                }
                            );

                        const cropJson =
                            await cropRes.json();

                        setDashboardData({
                            weather: weatherJson.weather,
                            soil: weatherJson.soil,
                            crops:
                                cropJson.data.top_5,
                        });

                    } catch (err) {

                        console.log(err);

                    } finally {

                        setLoading(false);
                    }
                }
            );

        return () => unsubscribe();

    }, [router]);
    const manualPredict = async () => {

        const response =
            await fetch(
                "/api/get-crop-recommendation",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({

                        N: Number(manualN),

                        P: Number(manualP),

                        K: Number(manualK),

                        ph: Number(manualPH),

                        temperature:
                            Number(historicalData.avgTemp),

                        humidity:
                            Number(historicalData.avgHumidity),
                        rainfall:
                            Number(
                                historicalData.totalRain
                            ),
                    }),
                }
            );

        const data =
            await response.json();

        setManualCrops(
            data?.data?.top_5 || []
        );
    };
    if (loading) {

        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">
                Loading Dashboard...
            </div>
        );
    }

    const weather =
        dashboardData?.weather;

    const soil =
        dashboardData?.soil;

    const crops =
        dashboardData?.crops || [];

    return (
        <div className="min-h-screen bg-black text-white flex overflow-hidden">

            {/* SIDEBAR */}
            <div className="hidden lg:flex w-[260px] border-r border-white/10 bg-[#050505] flex-col justify-between p-6">

                <div>

                    <div className="mb-10">

                        <h1 className="text-3xl font-bold text-green-500">
                            Prakriti
                        </h1>

                    </div>

                    <div className="space-y-2">

                        {sidebarItems.map(
                            (item, i) => (

                                <motion.div
                                    key={i}
                                    whileHover={{
                                        x: 6,
                                    }}
                                    onClick={() =>
                                        setActiveTab(item)
                                    }
                                    className={`px-4 py-3 rounded-xl cursor-pointer transition ${activeTab === item
                                        ? "bg-green-500/20 text-green-300 border border-green-500/20"
                                        : "hover:bg-white/5 text-gray-400"
                                        }`}
                                >
                                    {item}
                                </motion.div>
                            )
                        )}

                    </div>

                </div>

                {/* USER */}
                <div className="border-t border-white/10 pt-6">

                    <div className="mb-4">

                        <p className="font-semibold">
                            {userData?.name}
                        </p>

                        <p className="text-sm text-gray-500">
                            Farmer
                        </p>

                    </div>

                    <button
                        onClick={async () => {

                            await signOut(auth);

                            router.push("/login");

                        }}
                        className="w-full rounded-xl bg-red-500/10 border border-red-500/20 py-3 hover:bg-red-500/20 transition"
                    >
                        Logout
                    </button>

                </div>

            </div>

            {/* MAIN */}
            <div className="flex-1 overflow-y-auto bg-[#080808]">

                <div className="p-6 md:p-10">

                    {/* TOP */}
                    <div className="border-b border-white/10 pb-6 mb-10 flex items-center justify-between">

                        <div>

                            <h1 className="text-4xl font-bold">
                                {activeTab}
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Monitor crops, climate and soil insights.
                            </p>

                        </div>

                        <div className="text-right">

                            <p className="text-green-400">
                                {userData?.district}
                            </p>

                            <p className="text-gray-500 text-sm">
                                {weather?.season}
                            </p>

                        </div>

                    </div>

                    {/* OVERVIEW */}
                    {activeTab === "Overview" && (
                        <>

                            {/* CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">

                                {[
                                    {
                                        title: "Temperature",
                                        value: `${weather?.temperature}°C`,
                                        color: "text-cyan-300",
                                    },

                                    {
                                        title: "Humidity",
                                        value: `${weather?.humidity}%`,
                                        color: "text-blue-300",
                                    },

                                    {
                                        title: "30D Rainfall",
                                        value: `${historicalData?.totalRain} mm`,
                                        color: "text-green-300",
                                    },

                                    {
                                        title: "Soil pH",
                                        value: soil?.ph,
                                        color: "text-yellow-300",
                                    },

                                    {
                                        title: "Nitrogen",
                                        value: soil?.nitrogen,
                                        color: "text-orange-300",
                                    },

                                ].map((card, i) => (

                                    <motion.div
                                        key={i}
                                        initial={{
                                            opacity: 0,
                                            y: 30,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            delay: i * 0.1,
                                        }}
                                        whileHover={{
                                            y: -5,
                                        }}
                                        className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 backdrop-blur-xl"
                                    >

                                        <p className="text-gray-500 text-sm mb-4">
                                            {card.title}
                                        </p>

                                        <h2
                                            className={`text-3xl font-bold ${card.color}`}
                                        >
                                            {card.value}
                                        </h2>

                                    </motion.div>

                                ))}

                            </div>

                            {/* MAIN GRID */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                                {/* LEFT */}
                                <div className="xl:col-span-2 space-y-6">

                                    {/* TOP CROPS */}
                                    <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8">

                                        <div className="flex items-center justify-between mb-8">

                                            <div>

                                                <h2 className="text-2xl font-bold">
                                                    Top Crop Recommendations
                                                </h2>

                                                <p className="text-gray-500 mt-2">
                                                    AI-based agricultural suitability
                                                </p>

                                            </div>

                                        </div>

                                        <div className="space-y-5">

                                            {crops.map((crop, i) => (

                                                <motion.div
                                                    key={i}
                                                    whileHover={{
                                                        scale: 1.01,
                                                    }}
                                                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                                                >

                                                    <div className="flex items-center justify-between mb-4">

                                                        <h3 className="text-xl font-semibold capitalize">
                                                            {crop.crop}
                                                        </h3>

                                                        <span className="text-green-400 font-semibold">
                                                            {(crop.confidence * 100).toFixed(1)}%
                                                        </span>

                                                    </div>

                                                    <div className="h-3 rounded-full bg-white/5 overflow-hidden">

                                                        <motion.div
                                                            initial={{
                                                                width: 0,
                                                            }}
                                                            animate={{
                                                                width: `${crop.confidence * 100}%`,
                                                            }}
                                                            transition={{
                                                                duration: 1,
                                                                delay: i * 0.2,
                                                            }}
                                                            className="h-full bg-green-400 rounded-full"
                                                        />

                                                    </div>

                                                </motion.div>

                                            ))}

                                        </div>

                                    </div>

                                    {/* QUICK INSIGHTS */}
                                    <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8">

                                        <h2 className="text-2xl font-bold mb-6">
                                            Quick Insights
                                        </h2>

                                        <div className="space-y-4 text-gray-300">

                                            {weather?.humidity > 80 && (
                                                <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
                                                    High humidity detected.
                                                    Increased fungal risk possible.
                                                </div>
                                            )}

                                            {weather?.rainfall < 2 && (
                                                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                                                    Low rainfall conditions detected.
                                                    Irrigation recommended.
                                                </div>
                                            )}

                                            {soil?.ph < 6 && (
                                                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                                                    Soil slightly acidic.
                                                    Some crops may underperform.
                                                </div>
                                            )}

                                        </div>

                                    </div>

                                </div>

                                {/* RIGHT */}
                                <div className="space-y-6">

                                    {/* WEATHER */}
                                    <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8">

                                        <h2 className="text-2xl font-bold mb-6">
                                            Weather Summary
                                        </h2>

                                        <div className="space-y-5">

                                            <div className="flex items-center justify-between">

                                                <span className="text-gray-500">
                                                    Condition
                                                </span>

                                                <span>
                                                    {weather?.condition}
                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between">

                                                <span className="text-gray-500">
                                                    Season
                                                </span>

                                                <span>
                                                    {weather?.season}
                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between">

                                                <span className="text-gray-500">
                                                    District
                                                </span>

                                                <span>
                                                    {userData?.district}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    {/* ALERTS */}
                                    <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8">

                                        <h2 className="text-2xl font-bold mb-6">
                                            Alerts
                                        </h2>

                                        <div className="space-y-4">

                                            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                                                Monitor humidity levels closely.
                                            </div>

                                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                                                Rainfall levels below seasonal average.
                                            </div>

                                            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                                                Soil conditions favorable for rice.
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </>
                    )}
                    {/* MANUAL CROP PREDICTION */}
                    {activeTab === "Crop Prediction" && (

                        <div className="space-y-8">

                            {/* INPUT CARD */}
                            <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8">

                                <div className="mb-8">

                                    <h2 className="text-3xl font-bold mb-2">
                                        Manual Crop Predictor
                                    </h2>

                                    <p className="text-gray-500">
                                        Enter soil parameters manually to generate
                                        top crop recommendations.
                                    </p>

                                </div>

                                {/* INPUTS */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    <input
                                        type="number"
                                        placeholder="Nitrogen (N)"
                                        value={manualN}
                                        onChange={(e) =>
                                            setManualN(e.target.value)
                                        }
                                        className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition"
                                    />

                                    <input
                                        type="number"
                                        placeholder="Phosphorus (P)"
                                        value={manualP}
                                        onChange={(e) =>
                                            setManualP(e.target.value)
                                        }
                                        className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition"
                                    />

                                    <input
                                        type="number"
                                        placeholder="Potassium (K)"
                                        value={manualK}
                                        onChange={(e) =>
                                            setManualK(e.target.value)
                                        }
                                        className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition"
                                    />

                                    <input
                                        type="number"
                                        placeholder="pH"
                                        value={manualPH}
                                        onChange={(e) =>
                                            setManualPH(e.target.value)
                                        }
                                        className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition"
                                    />

                                </div>

                                {/* BUTTON */}
                                <button
                                    onClick={manualPredict}
                                    className="mt-8 bg-green-500 hover:bg-green-600 transition px-8 py-4 rounded-2xl font-semibold"
                                >
                                    Predict Crops
                                </button>

                            </div>

                            {/* RESULTS */}
                            {manualCrops.length > 0 && (

                                <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8">

                                    <div className="mb-8">

                                        <h2 className="text-3xl font-bold mb-2">
                                            Top Recommendations
                                        </h2>

                                        <p className="text-gray-500">
                                            AI-generated crop suitability rankings.
                                        </p>

                                    </div>

                                    <div className="space-y-5">

                                        {manualCrops.map((crop, i) => (

                                            <motion.div
                                                key={i}
                                                whileHover={{
                                                    scale: 1.01,
                                                }}
                                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                                            >

                                                <div className="flex items-center justify-between mb-4">

                                                    <h3 className="text-xl font-semibold capitalize">
                                                        {crop.crop}
                                                    </h3>

                                                    <span className="text-green-400 font-semibold">
                                                        {(crop.confidence * 100).toFixed(1)}%
                                                    </span>

                                                </div>

                                                <div className="h-3 rounded-full bg-white/5 overflow-hidden">

                                                    <motion.div
                                                        initial={{
                                                            width: 0,
                                                        }}
                                                        animate={{
                                                            width: `${crop.confidence * 100}%`,
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            delay: i * 0.15,
                                                        }}
                                                        className="h-full bg-green-400 rounded-full"
                                                    />

                                                </div>

                                            </motion.div>

                                        ))}

                                    </div>

                                </div>
                            )}

                        </div>
                    )}
                    {/* WEATHER TAB */}
                    {activeTab === "Weather" && (

                        <div className="space-y-8">

                            {/* CURRENT WEATHER */}
                            <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8">

                                <div className="mb-8">

                                    <h2 className="text-3xl font-bold mb-2">
                                        Current Weather
                                    </h2>

                                    <p className="text-gray-500">
                                        Live atmospheric conditions.
                                    </p>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                                    {[
                                        {
                                            label: "Temperature",
                                            value: `${weather?.temperature}°C`,
                                            color: "text-cyan-300",
                                        },

                                        {
                                            label: "Humidity",
                                            value: `${weather?.humidity}%`,
                                            color: "text-blue-300",
                                        },

                                        {
                                            label: "Rainfall",
                                            value: `${weather?.rainfall} mm`,
                                            color: "text-green-300",
                                        },

                                        {
                                            label: "Condition",
                                            value: weather?.condition,
                                            color: "text-yellow-300",
                                        },

                                        {
                                            label: "Season",
                                            value: weather?.season,
                                            color: "text-purple-300",
                                        },

                                        {
                                            label: "District",
                                            value: userData?.district,
                                            color: "text-orange-300",
                                        },

                                    ].map((item, i) => (

                                        <motion.div
                                            key={i}
                                            whileHover={{
                                                y: -5,
                                            }}
                                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                                        >

                                            <p className="text-gray-500 mb-4">
                                                {item.label}
                                            </p>

                                            <h2
                                                className={`text-3xl font-bold ${item.color}`}
                                            >
                                                {item.value}
                                            </h2>

                                        </motion.div>

                                    ))}

                                </div>

                            </div>

                            {/* HISTORICAL DATA */}
                            <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8">

                                <div className="mb-8">

                                    <h2 className="text-3xl font-bold mb-2">
                                        30-Day Historical Climate
                                    </h2>

                                    <p className="text-gray-500">
                                        Open-Meteo climate analysis.
                                    </p>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <motion.div
                                        whileHover={{
                                            scale: 1.02,
                                        }}
                                        className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-8"
                                    >

                                        <p className="text-gray-400 mb-4">
                                            Average Temperature
                                        </p>

                                        <h2 className="text-5xl font-bold text-cyan-300">
                                            {historicalData?.avgTemp || 0}°C
                                        </h2>

                                    </motion.div>

                                    <motion.div
                                        whileHover={{
                                            scale: 1.02,
                                        }}
                                        className="rounded-2xl bg-green-500/10 border border-green-500/20 p-8"
                                    >

                                        <p className="text-gray-400 mb-4">
                                            Total Rainfall
                                        </p>

                                        <h2 className="text-5xl font-bold text-green-300">
                                            {historicalData?.totalRain || 0} mm
                                        </h2>

                                    </motion.div>

                                </div>

                            </div>

                            {/* FORECAST */}
                            <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8">

                                <div className="mb-8">

                                    <h2 className="text-3xl font-bold mb-2">
                                        5-Day Forecast
                                    </h2>

                                    <p className="text-gray-500">
                                        OpenWeather forecast data.
                                    </p>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

                                    {forecastData?.map((day, i) => (

                                        <motion.div
                                            key={i}
                                            whileHover={{
                                                y: -5,
                                            }}
                                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center"
                                        >

                                            <h3 className="text-xl font-semibold mb-5">

                                                {new Date(day.dt_txt)
                                                    .toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            weekday: "short",
                                                        }
                                                    )}

                                            </h3>

                                            <div className="space-y-4">

                                                <div className="text-5xl">
                                                    ☁️
                                                </div>

                                                <h2 className="text-3xl font-bold text-cyan-300">

                                                    {Math.round(
                                                        day.main.temp
                                                    )}°C

                                                </h2>

                                                <p className="text-gray-400">

                                                    Humidity {day.main.humidity}%

                                                </p>

                                                <p className="text-gray-500 text-sm">

                                                    {day.weather[0].main}

                                                </p>

                                            </div>

                                        </motion.div>

                                    ))}

                                </div>

                            </div>

                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default Page;