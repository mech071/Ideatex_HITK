import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import { Poiret_One, Quicksand } from "next/font/google";
import Footer from "./components/footer";

const poiret = Poiret_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poiret",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Prakriti",
  description: "Agriculture",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`
    ${geistSans.variable}
    ${geistMono.variable}
    ${poiret.variable}
    ${quicksand.variable}
    h-full antialiased
  `}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}