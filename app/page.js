import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      <section className="relative h-screen w-full">

        <Image
          src="/farmer_dashboard2.jpg"
          alt="Farmer Dashboard"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white z-10 font-(family-name:--font-quicksand)">

          <h1 className="text-3xl md:text-7xl font-bold tracking-wide mb-6 font-(family-name:--font-poiret)">
            Prakriti
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil sequi libero corporis pariatur nulla, expedita adipisci ipsa error recusandae animi vitae omnis sapiente laudantium necessitatibus aspernatur accusamus, nesciunt distinctio repellat?
          </p>

          <div className="flex gap-4">

            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold shadow-lg"
            >
              Get Started
            </Link>

            <Link
              href="/features"
              className="px-6 py-3 rounded-xl border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white/20 transition font-semibold"
            >
              See Features
            </Link>

          </div>
        </div>
      </section>
      <section className="relative py-28 px-6 bg-[#07140d]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-400/10 blur-3xl rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <h2 className="text-5xl md:text-6xl font-bold font-(family-name:--font-poiret) mb-6 text-white">
              Explore Crop Intelligence
            </h2>

            <p className="max-w-2xl mx-auto text-gray-400 text-lg">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem numquam quibusdam, error neque sequi odit vel, corrupti fuga id dolores assumenda ipsum. Accusamus ad quos impedit, consequatur optio repellendus adipisci!
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 text-white">

            {/* Card 1 */}
            <div className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-8 hover:-translate-y-2 transition duration-300">

              <h3 className="text-3xl font-semibold mb-4">
                Yield Predictor
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
            <div className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-8 hover:-translate-y-2 transition duration-300">

              <h3 className="text-3xl font-semibold mb-4">
                Fertilizer Recommender
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
            <div className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-8 hover:-translate-y-2 transition duration-300">

              <h3 className="text-3xl font-semibold mb-4">
                Risk Calculator
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}