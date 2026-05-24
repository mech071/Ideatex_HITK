"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "motion/react";

import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const Circle = dynamic(
  () => import("react-leaflet").then((m) => m.Circle),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export default function Home() {

  const [mounted, setMounted] = useState(false);

  // TEMPERATURE DEFAULT
  const [layer, setLayer] = useState("temperature");

  const [points, setPoints] = useState([]);

  // Fix Leaflet hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch weather data
  useEffect(() => {

    const cities = [
      { name: "Delhi", lat: 28.6139, lon: 77.2090 },
      { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
      { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
      { name: "Chennai", lat: 13.0827, lon: 80.2707 },
      { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
      { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
      { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
      { name: "Patna", lat: 25.5941, lon: 85.1376 },

      // North
      { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
      { name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
      { name: "Srinagar", lat: 34.0837, lon: 74.7973 },
      { name: "Dehradun", lat: 30.3165, lon: 78.0322 },

      // West
      { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
      { name: "Pune", lat: 18.5204, lon: 73.8567 },
      { name: "Nagpur", lat: 21.1458, lon: 79.0882 },
      { name: "Surat", lat: 21.1702, lon: 72.8311 },

      // Central
      { name: "Bhopal", lat: 23.2599, lon: 77.4126 },
      { name: "Indore", lat: 22.7196, lon: 75.8577 },
      { name: "Raipur", lat: 21.2514, lon: 81.6296 },

      // East
      { name: "Ranchi", lat: 23.3441, lon: 85.3096 },
      { name: "Bhubaneswar", lat: 20.2961, lon: 85.8245 },
      { name: "Guwahati", lat: 26.1445, lon: 91.7362 },

      // South
      { name: "Visakhapatnam", lat: 17.6868, lon: 83.2185 },
      { name: "Coimbatore", lat: 11.0168, lon: 76.9558 },
      { name: "Kochi", lat: 9.9312, lon: 76.2673 },
      { name: "Madurai", lat: 9.9252, lon: 78.1198 },
      { name: "Mysore", lat: 12.2958, lon: 76.6394 },

      // Northeast
      { name: "Shillong", lat: 25.5788, lon: 91.8933 },
      { name: "Imphal", lat: 24.8170, lon: 93.9368 },
    ];

    const fetchData = async () => {

      try {

        const results = await Promise.all(
          cities.map(async (city) => {

            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,rain`
            );

            const data = await res.json();

            return {
              ...city,
              temp: data.current.temperature_2m,
              humidity: data.current.relative_humidity_2m,
              rain: data.current.rain,
            };
          })
        );

        setPoints(results);

      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
    };

    fetchData();

  }, []);

  const getColor = (value) => {

    if (layer === "temperature") {

      if (value > 38) return "#ff0000";
      if (value > 32) return "#ff6600";
      if (value > 26) return "#ffaa00";

      return "#ffe066";
    }

    if (layer === "humidity") {

      if (value > 85) return "#0047ff";
      if (value > 70) return "#00aaff";
      if (value > 50) return "#6dd5ff";

      return "#bdefff";
    }

    // Rainfall

    if (value > 10) return "#006400";
    if (value > 5) return "#00a000";
    if (value > 1) return "#44cc44";

    return "#9be89b";
  };

  const getValue = (point) => {

    if (layer === "temperature") return point.temp;

    if (layer === "humidity") return point.humidity;

    return point.rain;
  };

  const getUnit = () => {

    if (layer === "temperature") return "°C";

    if (layer === "humidity") return "%";

    return " mm";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.8,
      }}
      className="w-full overflow-x-hidden bg-[#07140d] text-white"
    >

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">

        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          <Image
            src="/farmer_dashboard2.jpg"
            alt="Farmer Dashboard"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/55" />

        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 blur-3xl rounded-full"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">

          <motion.h1
            initial={{
              opacity: 0,
              y: 80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1.6,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-5xl md:text-8xl font-bold tracking-wide mb-6 font-(family-name:--font-poiret)"
          >
            Prakriti
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1.5,
              delay: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-2xl text-lg md:text-xl text-gray-200 mb-8 leading-relaxed font-(family-name:--font-quicksand)"
          >
            AI-powered crop intelligence platform for smarter agricultural
            planning, yield prediction, and climate-aware farming decisions.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1.4,
              delay: 1.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex gap-4"
          >
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 hover:scale-105 transition duration-300 font-semibold shadow-2xl"
            >
              Get Started
            </Link>

            <Link
              href="/"
              className="px-6 py-3 rounded-xl border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-105 transition duration-300 font-semibold"
            >
              See Features
            </Link>
          </motion.div>
        </div>
      </section>

      {/* WEATHER MAP */}
      <section className="relative py-28 px-6 overflow-hidden bg-[#07140d]">

        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute top-10 left-10 w-72 h-72 bg-green-500/10 blur-3xl rounded-full"
        />

        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-400/10 blur-3xl rounded-full"
        />

        <div className="relative z-10 max-w-7xl mx-auto">

          <motion.div
            initial={{
              opacity: 0,
              y: 60,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-(family-name:--font-poiret) mb-6">
              Live Agricultural Weather Map
            </h2>

            <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed">
              Monitor rainfall, humidity, and temperature distribution across
              India in real time for smarter agricultural planning.
            </p>
          </motion.div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">

            {["rainfall", "temperature", "humidity"].map((item) => (
              <button
                key={t[item.key]}
                onClick={() => setLayer(item)}
                className={`px-5 py-3 rounded-xl transition font-semibold border capitalize ${
                  layer === item
                    ? "bg-green-600 border-green-500"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                {t[item.key]}
              </button>
            ))}
          </div>

          {/* LEGEND */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 mb-8 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 backdrop-blur-xl"
          >

            {layer === "temperature" && (
              <>
                <Legend color="#ff0000" text="Above 38°C" />
                <Legend color="#ff6600" text="32°C - 38°C" />
                <Legend color="#ffaa00" text="26°C - 32°C" />
                <Legend color="#ffe066" text="Below 26°C" />
              </>
            )}

            {layer === "humidity" && (
              <>
                <Legend color="#0047ff" text="Above 85%" />
                <Legend color="#00aaff" text="70% - 85%" />
                <Legend color="#6dd5ff" text="50% - 70%" />
                <Legend color="#bdefff" text="Below 50%" />
              </>
            )}

            {layer === "rainfall" && (
              <>
                <Legend color="#006400" text="Heavy Rainfall" />
                <Legend color="#00a000" text="Moderate Rainfall" />
                <Legend color="#44cc44" text="Light Rainfall" />
                <Legend color="#9be89b" text="Minimal Rainfall" />
              </>
            )}
          </motion.div>

          {/* MAP */}
          <motion.div
            initial={{
              opacity: 0,
              y: 70,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1.2,
            }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(34,197,94,0.08)]"
          >

            <div className="h-[500px] md:h-[700px] w-full">

              {mounted && (
                <MapContainer
                  center={[22.9734, 78.6569]}
                  zoom={5}
                  minZoom={5}
                  maxZoom={7}
                  maxBounds={[
                    [6.0, 67.0],
                    [37.5, 97.5],
                  ]}
                  maxBoundsViscosity={1}
                  scrollWheelZoom={false}
                  zoomControl={false}
                  className="h-full w-full z-0"
                >

                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {points.map((point, i) => (

                    <Circle
                      key={i}
                      center={[point.lat, point.lon]}
                      radius={90000}
                      pathOptions={{
                        fillColor: getColor(getValue(point)),
                        color: getColor(getValue(point)),
                        fillOpacity: 0.35,
                        weight: 2,
                      }}
                    >

                      <Popup>
                        <div className="text-black">
                          <h3 className="font-bold text-lg mb-2">
                            {point.name}
                          </h3>

                          <p>
                            {layer}: {getValue(point)}
                            {getUnit()}
                          </p>
                        </div>
                      </Popup>

                    </Circle>

                  ))}

                </MapContainer>
              )}

            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-32 px-6 overflow-hidden bg-[#07140d]">

        <motion.div
          animate={{
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 blur-3xl rounded-full"
        />

        <motion.div
          animate={{
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
          }}
          className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-400/10 blur-3xl rounded-full"
        />

        <div className="relative z-10 max-w-7xl mx-auto">

          <motion.div
            initial={{
              opacity: 0,
              y: 70,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-(family-name:--font-poiret) mb-6">
              Explore Crop Intelligence
            </h2>

            <p className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed">
              Real-time environmental insights combined with machine learning
              models to support modern Indian agriculture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {[
              {
                title: "Yield Predictor",
                desc: "Predict crop productivity using environmental and soil conditions.",
              },
              {
                title: "Fertilizer Recommender",
                desc: "Get optimized fertilizer recommendations based on crop data.",
              },
              {
                title: "Risk Calculator",
                desc: "Analyze climate and rainfall risks before cultivation decisions.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: 80,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                }}
                className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 transition duration-300 cursor-pointer hover:border-green-400/40 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]"
              >
                <h3 className="text-3xl font-semibold mb-4 font-(family-name:--font-poiret) tracking-wider">
                  {card.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {card.desc}
                </p>

                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="h-0.5 bg-green-400 mt-6"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
<section className="relative pt-10 pb-24 px-6 bg-[#07140d] overflow-hidden">

  <motion.div
    initial={{
      opacity: 0,
      y: 50,
    }}
    whileInView={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      duration: 1,
    }}
    viewport={{ once: true }}
    className="max-w-4xl mx-auto text-center"
  >

    <h2 className="text-4xl md:text-6xl font-bold mb-6 font-(family-name:--font-poiret)">
      Ready to Predict Smarter?
    </h2>

    <Link
      href="/login"
      className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-700 transition duration-300 font-semibold text-lg shadow-[0_0_40px_rgba(34,197,94,0.25)] hover:scale-105"
    >
      Get Started
    </Link>

  </motion.div>
</section>

    </motion.div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-5 h-5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <p className="text-sm text-gray-300">
        {text}
      </p>
    </div>
  );
}