"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const Page = () => {

  const [district, setDistrict] = useState("");

  const [showNPK, setShowNPK] = useState(false);

  const [weatherData, setWeatherData] = useState(null);

  const [P, setP] = useState("");
  const [K, setK] = useState("");

  const [crops, setCrops] = useState([]);

  const handleChange = (e) => {
    setDistrict(e.target.value);
  };

  // WEATHER API
  const weather = async () => {

    const response = await fetch("/api/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        district,
      }),
    });

    const data = await response.json();

    console.log(data);

    setWeatherData(data);

    setTimeout(() => {
      setShowNPK(true);
    }, 500);
  };

  // CROP PREDICTION API
  const predictCrops = async () => {

    if (!weatherData) return;

    const response = await fetch(
      "/api/get-crop-recommendation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({

          // SoilGrids API values
          N: weatherData.soil.nitrogen,

          ph: weatherData.soil.ph,

          // User Inputs
          P: Number(P),
          K: Number(K),

          // Weather APIs
          temperature:
            weatherData.weather.temperature,

          humidity:
            weatherData.weather.humidity,

          rainfall:
            weatherData.weather.rainfall,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    setCrops(data.data.top_5);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06111f] text-white">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06111f] via-[#0a1b2f] to-[#06111f]" />

      {/* Blue Glow */}
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
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full"
      />

      {/* Teal Glow */}
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
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/10 blur-3xl rounded-full"
      />

      {/* Grid Overlay */}
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
        className="absolute top-[20%] left-[15%] w-4 h-4 rounded-full bg-cyan-400/40 blur-sm"
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
        className="absolute top-[60%] right-[20%] w-6 h-6 rounded-full bg-blue-300/30 blur-sm"
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
        className="absolute bottom-[20%] left-[40%] w-5 h-5 rounded-full bg-sky-300/30 blur-sm"
      />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 md:p-14 shadow-[0_0_50px_rgba(59,130,246,0.08)]"
        >

          {/* Heading */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.8,
            }}
            className="text-4xl md:text-6xl font-bold font-(family-name:--font-poiret) mb-5"
          >
            Welcome to Crop Predictor
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
              duration: 0.8,
            }}
            className="text-gray-400 text-lg leading-relaxed mb-10"
          >
            Let’s start with your district so we can analyze local climate
            conditions and generate accurate crop recommendations.
          </motion.p>

          {/* INPUT SECTION */}
          <div className="relative min-h-[260px]">

            <AnimatePresence mode="wait">

              {/* DISTRICT INPUT */}
              {!showNPK && (

                <motion.div
                  key="district"
                  initial={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -40,
                    scale: 0.95,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="flex flex-col md:flex-row gap-4"
                >

                  <input
                    type="text"
                    placeholder="Enter your district..."
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white placeholder:text-gray-500 outline-none backdrop-blur-xl focus:border-cyan-400 transition duration-300"
                    value={district}
                    onChange={handleChange}
                  />

                  <button
                    className="rounded-2xl bg-cyan-500 hover:bg-cyan-600 px-8 py-4 font-semibold transition duration-300 shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:scale-[1.03]"
                    onClick={weather}
                  >
                    Continue
                  </button>

                </motion.div>
              )}

              {/* PK INPUT */}
              {showNPK && (

                <motion.div
                  key="pk"
                  initial={{
                    opacity: 0,
                    y: 40,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="space-y-6"
                >

                  {/* API DATA DISPLAY */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="rounded-2xl border border-cyan-400/20 bg-white/5 px-6 py-5 backdrop-blur-xl">
                      <p className="text-gray-400 text-sm mb-2">
                        Soil Nitrogen (API)
                      </p>

                      <h2 className="text-3xl font-bold text-cyan-300">
                        {weatherData.soil.nitrogen.toFixed(2)}
                      </h2>
                    </div>

                    <div className="rounded-2xl border border-cyan-400/20 bg-white/5 px-6 py-5 backdrop-blur-xl">
                      <p className="text-gray-400 text-sm mb-2">
                        Soil pH (API)
                      </p>

                      <h2 className="text-3xl font-bold text-cyan-300">
                        {weatherData.soil.ph.toFixed(2)}
                      </h2>
                    </div>

                  </div>

                  {/* USER INPUTS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                      type="number"
                      placeholder="Phosphorus (P)"
                      value={P}
                      onChange={(e) => setP(e.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white placeholder:text-gray-500 outline-none backdrop-blur-xl focus:border-cyan-400 transition duration-300"
                    />

                    <input
                      type="number"
                      placeholder="Potassium (K)"
                      value={K}
                      onChange={(e) => setK(e.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white placeholder:text-gray-500 outline-none backdrop-blur-xl focus:border-cyan-400 transition duration-300"
                    />

                  </div>

                  {/* PREDICT BUTTON */}
                  <button
                    onClick={predictCrops}
                    className="rounded-2xl bg-cyan-500 hover:bg-cyan-600 px-8 py-4 font-semibold transition duration-300 shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:scale-[1.03]"
                  >
                    Predict Crops
                  </button>

                  {/* RESULTS */}
                  {crops.length > 0 && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.6,
                      }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6"
                    >

                      {crops.map((crop, i) => (

                        <motion.div
                          key={i}
                          whileHover={{
                            scale: 1.03,
                            y: -4,
                          }}
                          className="rounded-2xl border border-cyan-400/20 bg-white/5 px-6 py-5 backdrop-blur-xl shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                        >

                          <h3 className="text-2xl font-semibold capitalize mb-2">
                            {crop.crop || crop.name || crop.label}
                          </h3>

                          <p className="text-cyan-300">
                            Confidence: {(crop.confidence * 100).toFixed(1)}%
                          </p>

                        </motion.div>

                      ))}

                    </motion.div>
                  )}

                </motion.div>
              )}

            </AnimatePresence>

          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default Page;