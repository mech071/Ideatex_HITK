"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="relative bg-black border-t border-white/10 text-white px-6 py-12 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-green-500/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Brand */}
        <div>
          <h2 className="text-4xl font-bold mb-4 font-(family-name:--font-poiret)">
            Prakriti
          </h2>

          <p className="text-gray-400 leading-relaxed max-w-md">
            Real-time environmental insights combined with machine learning
              models to support modern Indian agriculture.
          </p>
        </div>

        {/* Links */}
        <div className="md:flex md:justify-end">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-gray-400">

              <Link href="/login" className="hover:text-white transition">
                Login
              </Link>

              <Link href="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>

            </div>
          </div>
        </div>

      </div>

    </footer>
  );
};

export default Footer;
