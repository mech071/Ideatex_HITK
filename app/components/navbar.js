"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {

    const pathname = usePathname();
    // HIDE NAVBAR ON DASHBOARD
    if (pathname?.startsWith("/dashboard")) {
        return null;
    }

    return (
        <div
            className='fixed top-0 left-0 z-50 w-full h-18
            bg-white/10 backdrop-blur-md border-b border-white/20
            flex items-center justify-between px-6 shadow-lg'
        >

            {/* LEFT */}
            <div className="grp1 flex gap-6 items-center">

                {/* LOGO */}
                <div className="logo">
                    <svg
                        viewBox="0 0 400 400"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className='h-14 w-14'
                    >
                        <circle cx="200" cy="200" r="190" fill="#F0F9F4" />

                        <path
                            d="M50 250 L120 180 L180 220 L240 160 L300 200 L350 170 L350 250 Z"
                            fill="#2D5016"
                            opacity="0.3"
                        />

                        <path
                            d="M80 250 L140 190 L200 220 L260 170 L320 200 L350 180 L350 250 Z"
                            fill="#3D6B1F"
                            opacity="0.5"
                        />

                        <circle cx="200" cy="140" r="35" fill="#FDB022" />
                        <circle cx="200" cy="140" r="28" fill="#FECA57" />

                        <ellipse
                            cx="100"
                            cy="200"
                            rx="25"
                            ry="40"
                            fill="#4CAF50"
                            transform="rotate(-30 100 200)"
                        />

                        <ellipse
                            cx="300"
                            cy="200"
                            rx="25"
                            ry="40"
                            fill="#4CAF50"
                            transform="rotate(30 300 200)"
                        />

                        <g transform="translate(150, 240)">
                            <line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="80"
                                stroke="#8B7355"
                                strokeWidth="3"
                            />
                        </g>

                        <g transform="translate(200, 230)">
                            <line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="90"
                                stroke="#8B7355"
                                strokeWidth="3"
                            />
                        </g>

                        <g transform="translate(250, 240)">
                            <line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="80"
                                stroke="#8B7355"
                                strokeWidth="3"
                            />
                        </g>

                        <circle
                            cx="200"
                            cy="200"
                            r="190"
                            stroke="#2E7D32"
                            strokeWidth="4"
                            fill="none"
                        />
                    </svg>
                </div>

                {/* TITLE */}
                <div className="header text-black text-3xl font-bold font-(family-name:--font-poiret) tracking-wider">
                    Prakriti
                </div>

            </div>

            {/* RIGHT */}
            <div className="grp2">

                {pathname === "/" ? (

                    <Link
                        href="/login"
                        className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition delay-100"
                    >
                        Get Started
                    </Link>

                ) : (

                    <Link
                        href="/dashboard"
                        className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition delay-100"
                    >
                        Home
                    </Link>

                )}

            </div>

        </div>
    );
};

export default Navbar;
