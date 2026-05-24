"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import {
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

const sidebarItems = [
    {
        key: "overview",
        value: "Overview",
    },

    {
        key: "cropPrediction",
        value: "Crop Prediction",
    },

    {
        key: "weather",
        value: "Weather",
    },

    {
        key: "soilData",
        value: "Soil Data",
    },

    {
        key: "riskAnalysis",
        value: "Risk Analysis",
    },

    {
        key: "alerts",
        value: "Alerts",
    },

    {
        key: "settings",
        value: "Settings",
    },
];
const dashboardTranslations = {
    en: {
        overview: "Overview",
        cropPrediction: "Crop Prediction",
        weather: "Weather",
        soilData: "Soil Data",
        riskAnalysis: "Risk Analysis",
        alerts: "Alerts",
        settings: "Settings",
        monitor: "Monitor crops, climate and soil insights.",
        logout: "Logout",
        farmer: "Farmer",
        predict: "Predict Crops",
        loading: "Loading Dashboard...",
        languageHindi: "Hindi",
        languageBengali: "Bengali",
        temperature: "Temperature",
        humidity: "Humidity",
        rainfall: "Rainfall",
        thirtyDayRainfall: "30D Rainfall",
        soilPH: "Soil pH",
        nitrogen: "Nitrogen",
        nitrogenInput: "Nitrogen (N)",
        topCrops: "Top Crop Recommendations",
        aiSuitability: "AI-based agricultural suitability",
        weatherSummary: "Weather Summary",
        condition: "Condition",
        season: "Season",
        district: "District",
        manualPredictor: "Manual Crop Predictor",
        enterSoil: "Enter soil parameters manually to generate top crop recommendations.",
        phosphorus: "Phosphorus (P)",
        potassium: "Potassium (K)",
        ph: "pH",
        topRecommendations: "Top Recommendations",
        aiRankings: "AI-generated crop suitability rankings.",
        currentWeather: "Current Weather",
        liveAtmosphere: "Live atmospheric conditions.",
        historicalClimate: "30-Day Historical Climate",
        climateAnalysis: "Open-Meteo climate analysis.",
        avgTemperature: "Average Temperature",
        totalRainfall: "Total Rainfall",
        forecast: "5-Day Forecast",
        forecastData: "OpenWeather forecast data.",
    },
    hi: {
        overview: "अवलोकन",
        cropPrediction: "फसल पूर्वानुमान",
        weather: "मौसम",
        soilData: "मिट्टी का डेटा",
        riskAnalysis: "जोखिम विश्लेषण",
        alerts: "अलर्ट",
        settings: "सेटिंग्स",
        monitor: "फसलों, जलवायु और मिट्टी की जानकारी पर नजर रखें।",
        logout: "लॉगआउट",
        farmer: "किसान",
        predict: "फसल का अनुमान लगाएं",
        loading: "डैशबोर्ड लोड हो रहा है...",
        languageHindi: "हिन्दी",
        languageBengali: "বাংলা",
        temperature: "तापमान",
        humidity: "नमी",
        rainfall: "वर्षा",
        thirtyDayRainfall: "30 दिन की वर्षा",
        soilPH: "मिट्टी का pH",
        nitrogen: "नाइट्रोजन",
        nitrogenInput: "नाइट्रोजन (N)",
        topCrops: "शीर्ष फसल सुझाव",
        aiSuitability: "AI आधारित कृषि उपयुक्तता",
        weatherSummary: "मौसम सारांश",
        condition: "स्थिति",
        season: "मौसम",
        district: "जिला",
        manualPredictor: "मैनुअल फसल पूर्वानुमान",
        enterSoil: "शीर्ष फसल सुझाव पाने के लिए मिट्टी के मान दर्ज करें।",
        phosphorus: "फॉस्फोरस (P)",
        potassium: "पोटैशियम (K)",
        ph: "pH",
        topRecommendations: "शीर्ष सुझाव",
        aiRankings: "AI द्वारा तैयार फसल उपयुक्तता रैंकिंग।",
        currentWeather: "वर्तमान मौसम",
        liveAtmosphere: "लाइव वायुमंडलीय स्थितियां।",
        historicalClimate: "30-दिन का ऐतिहासिक जलवायु डेटा",
        climateAnalysis: "Open-Meteo जलवायु विश्लेषण।",
        avgTemperature: "औसत तापमान",
        totalRainfall: "कुल वर्षा",
        forecast: "5-दिन का पूर्वानुमान",
        forecastData: "OpenWeather पूर्वानुमान डेटा।",
    },
    bn: {
        overview: "ওভারভিউ",
        cropPrediction: "ফসল পূর্বাভাস",
        weather: "আবহাওয়া",
        soilData: "মাটির তথ্য",
        riskAnalysis: "ঝুঁকি বিশ্লেষণ",
        alerts: "সতর্কতা",
        settings: "সেটিংস",
        monitor: "ফসল, জলবায়ু এবং মাটির তথ্য নজরে রাখুন।",
        logout: "লগআউট",
        farmer: "কৃষক",
        predict: "ফসল অনুমান করুন",
        loading: "ড্যাশবোর্ড লোড হচ্ছে...",
        languageHindi: "हिन्दी",
        languageBengali: "বাংলা",
        temperature: "তাপমাত্রা",
        humidity: "আর্দ্রতা",
        rainfall: "বৃষ্টিপাত",
        thirtyDayRainfall: "৩০ দিনের বৃষ্টিপাত",
        soilPH: "মাটির pH",
        nitrogen: "নাইট্রোজেন",
        nitrogenInput: "নাইট্রোজেন (N)",
        topCrops: "সেরা ফসলের পরামর্শ",
        aiSuitability: "AI ভিত্তিক কৃষি উপযুক্ততা",
        weatherSummary: "আবহাওয়ার সারাংশ",
        condition: "অবস্থা",
        season: "মৌসুম",
        district: "জেলা",
        manualPredictor: "ম্যানুয়াল ফসল পূর্বাভাস",
        enterSoil: "সেরা ফসলের পরামর্শ পেতে মাটির মান লিখুন।",
        phosphorus: "ফসফরাস (P)",
        potassium: "পটাশিয়াম (K)",
        ph: "pH",
        topRecommendations: "সেরা পরামর্শ",
        aiRankings: "AI তৈরি ফসলের উপযুক্ততা র‍্যাঙ্কিং।",
        currentWeather: "বর্তমান আবহাওয়া",
        liveAtmosphere: "লাইভ বায়ুমণ্ডলীয় অবস্থা।",
        historicalClimate: "৩০ দিনের ঐতিহাসিক জলবায়ু",
        climateAnalysis: "Open-Meteo জলবায়ু বিশ্লেষণ।",
        avgTemperature: "গড় তাপমাত্রা",
        totalRainfall: "মোট বৃষ্টিপাত",
        forecast: "৫ দিনের পূর্বাভাস",
        forecastData: "OpenWeather পূর্বাভাস তথ্য।",
    },
};

const cropTranslations = {
    en: {
        apple: "Apple",
        banana: "Banana",
        blackgram: "Blackgram",
        chickpea: "Chickpea",
        coconut: "Coconut",
        coffee: "Coffee",
        cotton: "Cotton",
        grapes: "Grapes",
        jute: "Jute",
        kidneybeans: "Kidney Beans",
        lentil: "Lentil",
        maize: "Maize",
        mango: "Mango",
        mothbeans: "Moth Beans",
        mungbean: "Mung Bean",
        muskmelon: "Muskmelon",
        orange: "Orange",
        papaya: "Papaya",
        pigeonpeas: "Pigeon Peas",
        pomegranate: "Pomegranate",
        rice: "Rice",
        watermelon: "Watermelon",
    },
    hi: {
        apple: "सेब",
        banana: "केला",
        blackgram: "उड़द",
        chickpea: "चना",
        coconut: "नारियल",
        coffee: "कॉफी",
        cotton: "कपास",
        grapes: "अंगूर",
        jute: "जूट",
        kidneybeans: "राजमा",
        lentil: "मसूर",
        maize: "मक्का",
        mango: "आम",
        mothbeans: "मोठ",
        mungbean: "मूंग",
        muskmelon: "खरबूजा",
        orange: "संतरा",
        papaya: "पपीता",
        pigeonpeas: "अरहर",
        pomegranate: "अनार",
        rice: "धान",
        watermelon: "तरबूज",
    },
    bn: {
        apple: "আপেল",
        banana: "কলা",
        blackgram: "মাষকলাই",
        chickpea: "ছোলা",
        coconut: "নারকেল",
        coffee: "কফি",
        cotton: "তুলা",
        grapes: "আঙুর",
        jute: "পাট",
        kidneybeans: "রাজমা",
        lentil: "মসুর",
        maize: "ভুট্টা",
        mango: "আম",
        mothbeans: "মট বিন",
        mungbean: "মুগ",
        muskmelon: "খরমুজ",
        orange: "কমলা",
        papaya: "পেঁপে",
        pigeonpeas: "অড়হর",
        pomegranate: "ডালিম",
        rice: "ধান",
        watermelon: "তরমুজ",
    },
};

const Page = () => {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);
    const [activeTab, setActiveTab] =
        useState("Overview");
    const [language, setLanguage] = useState("en");
    const t = dashboardTranslations[language];
    const cropNames =
        cropTranslations[language] || cropTranslations.en;
    const getCropName = (cropName) =>
        cropNames[cropName?.toLowerCase()] || cropName;
    const activeSidebarItem = sidebarItems.find(
        (item) => item.value === activeTab
    );
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
                {t.loading}
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
        <div className="min-h-screen bg-black text-white flex relative overflow-hidden">

            {/* SIDEBAR */}
            <div
                className={`
                fixed lg:relative z-50
                top-0 left-0 h-screen
                ${sidebarOpen
                        ? "w-[260px] translate-x-0"
                        : "w-[260px] -translate-x-full lg:translate-x-0 lg:w-[80px]"}
                border-r border-white/10
                bg-[#050505]
                flex flex-col justify-between
                transition-all duration-300
                overflow-hidden
            `}
            >

                <div>

                    {/* TOP */}
                    <div className="p-6 flex items-center justify-between">

                        {sidebarOpen && (
                            <h1 className="text-3xl font-bold text-green-500">
                                Prakriti
                            </h1>
                        )}

                        <button
                            onClick={() =>
                                setSidebarOpen(!sidebarOpen)
                            }
                            className="mt-8 p-2 rounded-xl border border-white/10 bg-[#111] cursor-pointer"
                        >
                            {sidebarOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </button>

                    </div>

                    {/* ITEMS */}
                    <div
                        className={`
        space-y-2
        px-3
        transition-all duration-300
        ${sidebarOpen
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"}
    `}
                    >

                        {sidebarItems.map((item, i) => (

                            <motion.div
                                key={i}
                                whileHover={{
                                    x: 4,
                                }}
                                onClick={() => {

                                    setActiveTab(item.value);

                                    setSidebarOpen(false);

                                }}
                                className={`
                px-4 py-4 rounded-xl
                cursor-pointer transition
                flex items-center
                whitespace-nowrap
                overflow-hidden
                ${activeTab === item.value
                                        ? "bg-green-500/20 text-green-300 border border-green-500/20"
                                        : "hover:bg-white/5 text-gray-400"}
            `}
                            >

                                {t[item.key]}

                            </motion.div>

                        ))}

                    </div>

                </div>

                {/* USER */}
                <div className="border-t border-white/10 p-4">

                    {sidebarOpen && (
                        <div className="mb-4">

                            <p className="font-semibold">
                                {userData?.name}
                            </p>

                            <p className="text-sm text-gray-500">
                                {t.farmer}
                            </p>

                        </div>
                    )}

                    <button
                        onClick={async () => {

                            await signOut(auth);

                            router.push("/login");

                        }}
                        className={`
                        rounded-xl
                        bg-red-500/10
                        border border-red-500/20
                        hover:bg-red-500/20
                        transition
                        py-3
                        ${sidebarOpen
                                ? "w-full"
                                : "w-full text-sm"}
                    `}
                    >
                        {sidebarOpen ? t.logout : "↩"}
                    </button>

                </div>

            </div>

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                    className="fixed inset-0 bg-black/50 z-40"
                />
            )}

            {/* MAIN */}
            <div className="flex-1 overflow-y-auto bg-[#080808] transition-all duration-300">

                <div className="p-6 md:p-10">

                    {/* TOP */}
                    <div className="border-b border-white/10 pb-6 mb-10 flex items-center justify-between">

                        <div>

                            <h1 className="text-4xl font-bold">
                                {activeSidebarItem
                                    ? t[activeSidebarItem.key]
                                    : activeTab}
                            </h1>

                            <p className="text-gray-500 mt-2">
                                {t.monitor}
                            </p>

                        </div>
                        <div className="flex gap-2 mt-3 justify-end">

                            <button
                                onClick={() => setLanguage("en")}
                                className={`px-3 py-1 rounded-lg border transition ${language === "en"
                                        ? "bg-green-500 text-black"
                                        : "border-white/10"
                                    }`}
                            >
                                EN
                            </button>

                            <button
                                onClick={() => setLanguage("hi")}
                                className={`px-3 py-1 rounded-lg border transition ${language === "hi"
                                        ? "bg-green-500 text-black"
                                        : "border-white/10"
                                    }`}
                            >
                                {t.languageHindi}
                            </button>

                            <button
                                onClick={() => setLanguage("bn")}
                                className={`px-3 py-1 rounded-lg border transition ${language === "bn"
                                        ? "bg-green-500 text-black"
                                        : "border-white/10"
                                    }`}
                            >
                                {t.languageBengali}
                            </button>

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
                                        title: t.temperature,
                                        value: `${weather?.temperature}°C`,
                                        color: "text-cyan-300",
                                    },

                                    {
                                        title: t.humidity,
                                        value: `${weather?.humidity}%`,
                                        color: "text-blue-300",
                                    },

                                    {
                                        title: t.thirtyDayRainfall,
                                        value: `${historicalData?.totalRain} mm`,
                                        color: "text-green-300",
                                    },

                                    {
                                        title: t.soilPH,
                                        value: soil?.ph,
                                        color: "text-yellow-300",
                                    },

                                    {
                                        title: t.nitrogen,
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
                                                    {t.topCrops}
                                                </h2>

                                                <p className="text-gray-500 mt-2">
                                                    {t.aiSuitability}
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
                                                            {getCropName(crop.crop)}
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

                                </div>

                                {/* RIGHT */}
                                <div className="space-y-6">

                                    {/* WEATHER */}
                                    <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8">

                                        <h2 className="text-2xl font-bold mb-6">
                                            {t.weatherSummary}
                                        </h2>

                                        <div className="space-y-5">

                                            <div className="flex items-center justify-between">

                                                <span className="text-gray-500">
                                                    {t.condition}
                                                </span>

                                                <span>
                                                    {weather?.condition}
                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between">

                                                <span className="text-gray-500">
                                                    {t.season}
                                                </span>

                                                <span>
                                                    {weather?.season}
                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between">

                                                <span className="text-gray-500">
                                                    {t.district}
                                                </span>

                                                <span>
                                                    {userData?.district}
                                                </span>

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
                                        {t.manualPredictor}
                                    </h2>

                                    <p className="text-gray-500">
                                        {t.enterSoil}
                                    </p>

                                </div>

                                {/* INPUTS */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    <input
                                        type="number"
                                        placeholder={t.nitrogenInput}
                                        value={manualN}
                                        onChange={(e) =>
                                            setManualN(e.target.value)
                                        }
                                        className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition"
                                    />

                                    <input
                                        type="number"
                                        placeholder={t.phosphorus}
                                        value={manualP}
                                        onChange={(e) =>
                                            setManualP(e.target.value)
                                        }
                                        className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition"
                                    />

                                    <input
                                        type="number"
                                        placeholder={t.potassium}
                                        value={manualK}
                                        onChange={(e) =>
                                            setManualK(e.target.value)
                                        }
                                        className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition"
                                    />

                                    <input
                                        type="number"
                                        placeholder={t.ph}
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
                                    {t.predict}
                                </button>

                            </div>

                            {/* RESULTS */}
                            {manualCrops.length > 0 && (

                                <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8">

                                    <div className="mb-8">

                                        <h2 className="text-3xl font-bold mb-2">
                                            {t.topRecommendations}
                                        </h2>

                                        <p className="text-gray-500">
                                            {t.aiRankings}
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
                                                        {getCropName(crop.crop)}
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
                                        {t.currentWeather}
                                    </h2>

                                    <p className="text-gray-500">
                                        {t.liveAtmosphere}
                                    </p>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                                    {[
                                        {
                                            label: t.temperature,
                                            value: `${weather?.temperature}°C`,
                                            color: "text-cyan-300",
                                        },

                                        {
                                            label: t.humidity,
                                            value: `${weather?.humidity}%`,
                                            color: "text-blue-300",
                                        },

                                        {
                                            label: t.rainfall,
                                            value: `${weather?.rainfall} mm`,
                                            color: "text-green-300",
                                        },

                                        {
                                            label: t.condition,
                                            value: weather?.condition,
                                            color: "text-yellow-300",
                                        },

                                        {
                                            label: t.season,
                                            value: weather?.season,
                                            color: "text-purple-300",
                                        },

                                        {
                                            label: t.district,
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
                                        {t.historicalClimate}
                                    </h2>

                                    <p className="text-gray-500">
                                        {t.climateAnalysis}
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
                                            {t.avgTemperature}
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
                                            {t.totalRainfall}
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
                                        {t.forecast}
                                    </h2>

                                    <p className="text-gray-500">
                                        {t.forecastData}
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

                                                    {t.humidity} {day.main.humidity}%

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

