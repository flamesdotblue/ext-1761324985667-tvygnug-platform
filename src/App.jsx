import { useState } from 'react';
import { Leaf, Gauge, Map as MapIcon, Calculator as CalculatorIcon } from 'lucide-react';
import HeroSection from './components/HeroSection';
import CarbonCalculator from './components/CarbonCalculator';
import AirQualityCard from './components/AirQualityCard';
import IndiaEmissionsMap from './components/IndiaEmissionsMap';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: CalculatorIcon },
    { id: 'air', label: 'Air Quality', icon: Gauge },
    { id: 'map', label: 'India Emissions Map', icon: MapIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="relative">
        <HeroSection />
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4">
          <nav className="backdrop-blur-md bg-white/10 border border-white/10 rounded-full px-2 py-1 flex items-center gap-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    active ? 'bg-emerald-500 text-black' : 'hover:bg-white/10'
                  }`}
                  aria-pressed={active}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'calculator' && (
          <section>
            <h2 className="text-2xl font-semibold flex items-center gap-2"><Leaf className="h-6 w-6 text-emerald-400" /> Carbon Footprint Calculator</h2>
            <p className="text-neutral-400 mt-1">Estimate your annual emissions and discover ways to reduce them.</p>
            <div className="mt-6">
              <CarbonCalculator />
            </div>
          </section>
        )}

        {activeTab === 'air' && (
          <section>
            <h2 className="text-2xl font-semibold flex items-center gap-2"><Gauge className="h-6 w-6 text-sky-400" /> Air Quality Near You</h2>
            <p className="text-neutral-400 mt-1">Live AQI with health guidance and pollutant breakdown.</p>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AirQualityCard />
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold mb-3">Understanding AQI</h3>
                <ul className="space-y-2 text-sm text-neutral-300">
                  <li><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2" /> 0-50: Good – Air quality is satisfactory.</li>
                  <li><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2" /> 51-100: Moderate – Acceptable; some pollutants may be a concern for a small number of unusually sensitive people.</li>
                  <li><span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2" /> 101-150: Unhealthy for Sensitive Groups.</li>
                  <li><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2" /> 151-200: Unhealthy – Everyone may begin to experience health effects.</li>
                  <li><span className="inline-block w-2 h-2 rounded-full bg-purple-600 mr-2" /> 201-300: Very Unhealthy – Health warnings of emergency conditions.</li>
                  <li><span className="inline-block w-2 h-2 rounded-full bg-rose-900 mr-2" /> 300+: Hazardous – Serious health effects for everyone.</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'map' && (
          <section>
            <h2 className="text-2xl font-semibold flex items-center gap-2"><MapIcon className="h-6 w-6 text-emerald-400" /> India Emissions Map</h2>
            <p className="text-neutral-400 mt-1">Explore emissions across major Indian cities with per-capita insights.</p>
            <div className="mt-6">
              <IndiaEmissionsMap />
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-white/10 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-neutral-400">
          <p>EcoTrack • Empowering sustainable decisions</p>
          <p className="text-sm">Paris Agreement target: 2.0t CO₂e/year</p>
        </div>
      </footer>
    </div>
  );
}
