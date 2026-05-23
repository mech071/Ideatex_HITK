"use client";

import Link from "next/link";
import { motion } from "motion/react";

const cards = [
    {
        title: "Crop & Yield Predictor",
        desc: "AI-based crop recommendation using soil and climate conditions. Estimate agricultural productivity with environmental analytics.",
        href: "/crop-predictor",
    },
    {
        title: "Cost Calculator",
        desc: "Analyze farming expenses, revenue generated, and profitability. Make wiser financial decisions based on current market trends.",
        href: "/cost-calculator",
    },
];

const Page = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#07140d] text-white">

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#07140d] via-[#0b1f14] to-[#07140d]" />

            {/* Glows */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.45, 0.2],
                    scale: [1, 1.08, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/20 blur-3xl rounded-full"
            />

            <motion.div
                animate={{
                    opacity: [0.15, 0.35, 0.15],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/10 blur-3xl rounded-full"
            />

            {/* Grid */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Floating Particles */}
            <motion.div
                animate={{
                    y: [0, -40, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[20%] left-[15%] w-4 h-4 rounded-full bg-green-400/40 blur-sm"
            />

            <motion.div
                animate={{
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[60%] right-[20%] w-6 h-6 rounded-full bg-emerald-300/30 blur-sm"
            />

            <motion.div
                animate={{
                    y: [0, -25, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[20%] left-[40%] w-5 h-5 rounded-full bg-lime-300/30 blur-sm"
            />

            {/* Cards */}
            {/* Cards */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full">

                    {cards.map((card, i) => (

                        <motion.div
                            key={i}
                            initial={{
                                opacity: 0,
                                y: 80,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 1,
                                delay: i * 0.2,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            whileHover={{
                                y: -12,
                                scale: 1.02,
                            }}
                            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,197,94,0.08)] group"
                        >

                            {/* Gloss Shine */}
                            <motion.div
                                initial={{
                                    x: "-120%",
                                }}
                                whileHover={{
                                    x: "220%",
                                }}
                                transition={{
                                    duration: 1,
                                }}
                                className="absolute top-0 left-0 h-full w-32 bg-white/10 blur-2xl rotate-12"
                            />

                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-40" />

                            {/* CONTENT */}
                            <div className="relative z-10 flex flex-col md:flex-row h-full">

                                {/* IMAGE */}
                                <div className="relative md:w-[40%] h-[250px] md:h-auto overflow-hidden">

                                    <motion.img
                                        whileHover={{
                                            scale: 1.08,
                                        }}
                                        transition={{
                                            duration: 0.6,
                                        }}
                                        src={
                                            card.title.includes("Cost")
                                                ? "/cost.jpg"
                                                : "/crop.jpg"
                                        }
                                        alt={card.title}
                                        className={`w-full h-full object-cover ${card.title.includes("Cost")
                                                ? "object-center"
                                                : "object-[30%_center]"
                                            }`}
                                    />

                                    {/* Dark Overlay */}
                                    <div className="absolute inset-0 bg-black/20" />
                                </div>

                                {/* TEXT */}
                                <div className="flex-1 p-10 flex flex-col justify-between">

                                    <div>

                                        <h2 className="text-3xl md:text-4xl font-bold mb-5 font-(family-name:--font-poiret)">
                                            {card.title}
                                        </h2>

                                        <p className="text-gray-400 leading-relaxed text-lg">
                                            {card.desc}
                                        </p>

                                    </div>

                                    <Link
                                        href={card.href}
                                        className="mt-10 inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-semibold hover:bg-green-700 transition duration-300 w-fit"
                                    >
                                        Open
                                    </Link>

                                </div>

                            </div>

                        </motion.div>

                    ))}

                </div>
            </div>
        </div>
    );
};

export default Page;