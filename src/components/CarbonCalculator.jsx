import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Leaf } from 'lucide-react';

const COLORS = ['#34d399', '#fbbf24', '#60a5fa', '#a78bfa'];

const DIET_EMISSIONS = {
  Vegan: 1.5,
  Vegetarian: 2.0,
  'Light Meat': 3.0,
  'Medium Meat': 4.0,
  'Heavy Meat': 5.0,
};

export default function CarbonCalculator() {
  const [inputs, setInputs] = useState({
    carKmPerYear: 8000,
    airHoursPerYear: 10,
    electricityKWhPerMonth: 150,
    diet: 'Medium Meat',
    wasteKgPerMonth: 20,
  });

  const factors = {
    car: 0.0002, // t CO2e per km
    air: 0.09, // t CO2e per hour
    electricity: 0.0007, // t CO2e per kWh
    waste: 0.0012, // t CO2e per kg
  };

  const results = useMemo(() => {
    const transport = inputs.carKmPerYear * factors.car + inputs.airHoursPerYear * factors.air;
    const energy = inputs.electricityKWhPerMonth * 12 * factors.electricity;
    const diet = DIET_EMISSIONS[inputs.diet] ?? 3.5;
    const waste = inputs.wasteKgPerMonth * 12 * factors.waste;
    const total = transport + energy + diet + waste;
    return { transport, energy, diet, waste, total };
  }, [inputs]);

  const pieData = [
    { name: 'Transport', value: Number(results.transport.toFixed(2)) },
    { name: 'Energy', value: Number(results.energy.toFixed(2)) },
    { name: 'Diet', value: Number(results.diet.toFixed(2)) },
    { name: 'Waste', value: Number(results.waste.toFixed(2)) },
  ];

  const globalAvg = 4.7;
  const target = 2.0; // Paris Agreement guidance

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: name === 'diet' ? value : Number(value) }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-semibold mb-4">Your Inputs</h3>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-neutral-300">Car travel (km/year)</span>
            <input
              type="number"
              name="carKmPerYear"
              value={inputs.carKmPerYear}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min={0}
            />
          </label>
          <label className="block">
            <span className="text-sm text-neutral-300">Air travel (hours/year)</span>
            <input
              type="number"
              name="airHoursPerYear"
              value={inputs.airHoursPerYear}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min={0}
            />
          </label>
          <label className="block">
            <span className="text-sm text-neutral-300">Electricity (kWh/month)</span>
            <input
              type="number"
              name="electricityKWhPerMonth"
              value={inputs.electricityKWhPerMonth}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min={0}
            />
          </label>
          <label className="block">
            <span className="text-sm text-neutral-300">Diet</span>
            <select
              name="diet"
              value={inputs.diet}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {Object.keys(DIET_EMISSIONS).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-neutral-300">Waste (kg/month)</span>
            <input
              type="number"
              name="wasteKgPerMonth"
              value={inputs.wasteKgPerMonth}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min={0}
            />
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-400/20 p-4">
            <div className="text-sm text-neutral-300">Total</div>
            <div className="text-2xl font-bold">{results.total.toFixed(2)} t/yr</div>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <div className="text-sm text-neutral-300">Global average</div>
            <div className="text-xl font-semibold">{globalAvg} t/yr</div>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <div className="text-sm text-neutral-300">Target</div>
            <div className="text-xl font-semibold">{target} t/yr</div>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-white/5 border border-white/10 p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2"><Leaf className="h-4 w-4 text-emerald-400" /> Recommendations</h4>
          <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-1">
            <li>Reduce air travel where possible; consider virtual meetings or trains for short routes.</li>
            <li>Improve home energy efficiency and switch to LED lighting to reduce electricity emissions.</li>
            <li>Shift towards a plant-forward diet to lower diet-related emissions.</li>
            <li>Increase recycling and composting to cut waste emissions.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-semibold mb-4">Emission Breakdown</h3>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Metric label="Transport" value={results.transport} color="text-emerald-300" />
          <Metric label="Energy" value={results.energy} color="text-yellow-300" />
          <Metric label="Diet" value={results.diet} color="text-blue-300" />
          <Metric label="Waste" value={results.waste} color="text-purple-300" />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div className="rounded-md bg-white/5 border border-white/10 p-3">
      <div className="text-neutral-400 text-xs">{label}</div>
      <div className={`font-semibold ${color}`}>{value.toFixed(2)} t/yr</div>
    </div>
  );
}
