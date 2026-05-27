"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, provider } from "@/lib/firebase";

const Page = () => {

  const router = useRouter();

  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [landAreaAcres, setLandAreaAcres] = useState("");

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {

        if (user) {
          try {
            const response = await fetch(
              `/api/user?email=${encodeURIComponent(user.email)}`
            );

            if (response.ok) {
              router.push("/dashboard");
            }
          } catch {
            setError("");
          }
        }

      }
    );

    return () => unsubscribe();

  }, [router]);

  const farmer = async (email) => {

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        district,
        email,
        land_area_acres: Number(landAreaAcres),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;

  };

  const handleGoogleLogin = async () => {

    setError("");

    if (
      !name.trim() ||
      !district.trim() ||
      !landAreaAcres
    ) {
      setError("Please fill all fields");
      return;
    }

    if (Number(landAreaAcres) <= 0) {
      setError("Land area must be greater than 0");
      return;
    }

    try {

      // GOOGLE LOGIN
      const result = await signInWithPopup(
        auth,
        provider
      );

      // GET LAT/LON FROM DISTRICT
      const weatherRes = await fetch("/api/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          district,
        }),
      });

      const weatherData = await weatherRes.json();

      if (
        !weatherRes.ok ||
        !weatherData.success
      ) {
        setError(
          weatherData.message ||
          "Unable to fetch district location"
        );
        return;
      }

      // SAVE USER
      await farmer(
        result.user.email
      );

      router.push("/dashboard");

    } catch (error) {

      console.log(error);

      setError(
        error.message ||
        "Something went wrong"
      );

    }

  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative">

        <Image
          src="/rice1.jpg"
          alt="Rice Field"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 flex flex-col justify-center p-14 text-white">

          <h1 className="text-5xl font-bold leading-tight mb-4">
            Smart Agriculture
            <br />
            Starts Here.
          </h1>

          <p className="text-lg text-white/80 max-w-md">
            AI-powered crop prediction and agricultural insights
            tailored for modern farmers.
          </p>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#f8fafc]">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-10">

            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome to Prakriti
            </h2>

            <p className="text-gray-500">
              Create your account to continue.
            </p>

          </div>

          {/* Form */}
          <div className="space-y-5">

            <input
              type="text"
              required
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setError("");
                setName(e.target.value);
              }}
              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none focus:border-green-500 transition"
            />

            <input
              type="text"
              required
              placeholder="District"
              value={district}
              onChange={(e) => {
                setError("");
                setDistrict(e.target.value);
              }}
              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none focus:border-green-500 transition"
            />

            <input
              type="number"
              required
              min="0.1"
              step="0.1"
              placeholder="Land Area (acres)"
              value={landAreaAcres}
              onChange={(e) => {
                setError("");
                setLandAreaAcres(e.target.value);
              }}
              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none focus:border-green-500 transition"
            />

            {
              error && (
                <p className="text-red-500 text-sm font-medium ml-2">
                  {error}
                </p>
              )
            }

            {/* GOOGLE BUTTON */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-800 font-semibold hover:bg-gray-50 transition shadow-sm"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-6 h-6"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.243 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.176 35.091 26.715 36 24 36c-5.222 0-9.623-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.058 3.116-3.057 5.552-5.894 7.57l.003-.002 6.19 5.238C35.163 40.49 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>

              Continue with Google

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Page;
