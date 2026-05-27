"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What is Prakriti?",
    answer:
      "Prakriti is an AI-powered crop yield prediction platform designed for Indian agriculture. It analyzes environmental and agricultural factors to help farmers make better crop decisions.",
  },
  {
    question: "How does the prediction system work?",
    answer:
      "The system uses machine learning models trained on agricultural datasets such as rainfall, temperature, humidity, soil conditions, and historical crop yield data.",
  },
  {
  question: "Why does crop prediction take around 60–90 seconds?",
  answer:
    "The prediction process depends on multiple real-time agricultural and environmental data sources. When a user selects a location, the system fetches live weather parameters such as temperature, humidity, rainfall, seasonal conditions, and climate data from external APIs. These requests can take time depending on network speed, API response latency, and server load. After collecting the data, the backend preprocesses the information and runs it through machine learning models to generate crop yield predictions and recommendations. Since several operations happen sequentially, the overall prediction time may take approximately 60–90 seconds.",
},
{
  question: "Why does the dashboard sometimes take time to load initially?",
  answer:
    "The backend services are hosted on Render’s free tier infrastructure, which uses an automatic sleep mode to conserve server resources during inactivity. If the application has not been used for some time, the backend server enters a dormant state. The first request made to the dashboard wakes the server and reinitializes the environment, which can take up to 60 seconds. After the server becomes active, subsequent requests are significantly faster.",
},
  {
    question: "Does Prakriti support live weather data?",
    answer:
      "Yes. The platform can integrate weather APIs to fetch real-time temperature, humidity, rainfall, and seasonal conditions based on the selected location.",
  },
  {
    question: "Can farmers use this without technical knowledge?",
    answer:
      "Yes. The interface is designed to be simple and accessible, with clear predictions and visual insights.",
  },
  {
    question: "Is the prediction always accurate?",
    answer:
      "No prediction system can guarantee 100% accuracy because agriculture depends on unpredictable environmental conditions. The system provides estimated outcomes based on available data.",
  },
  {
    question: "Can this work for all Indian states?",
    answer:
      "Yes. The platform is designed to support multiple Indian states and districts, provided relevant agricultural and weather data is available.",
  },
]

const FAQItem = ({ faq, index, activeIndex, setActiveIndex }) => {
  const isOpen = activeIndex === index

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.03]">
      <button
        onClick={() => setActiveIndex(isOpen ? null : index)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-white font-medium text-lg">
          {faq.question}
        </span>

        <ChevronDown
          className={`text-white transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-gray-400 leading-7">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

const page = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4 mt-10 font-(family-name:--font-poiret)">
            Frequently Asked Questions
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-[Poiret-One]">
            Everything you need to know about Prakriti and the crop yield
            prediction system.
          </p>
        </div>

        <div className="space-y-4 font-[Poiret-One]">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default page