import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Sample coverage across India. Values are illustrative.
const CITY_DATA = [
  // North
  { city: 'Delhi', lat: 28.6139, lon: 77.2090, emissionsMt: 80, populationM: 32, sources: ['transport', 'industry', 'power'] },
  { city: 'Chandigarh', lat: 30.7333, lon: 76.7794, emissionsMt: 5, populationM: 1.1, sources: ['transport', 'residential'] },
  { city: 'Lucknow', lat: 26.8467, lon: 80.9462, emissionsMt: 10, populationM: 3.4, sources: ['transport', 'residential'] },
  { city: 'Jaipur', lat: 26.9124, lon: 75.7873, emissionsMt: 9, populationM: 3.1, sources: ['transport', 'industry'] },
  { city: 'Amritsar', lat: 31.6340, lon: 74.8723, emissionsMt: 6, populationM: 1.5, sources: ['transport', 'residential'] },
  // South
  { city: 'Bangalore', lat: 12.9716, lon: 77.5946, emissionsMt: 25, populationM: 13, sources: ['transport', 'industry', 'power'] },
  { city: 'Chennai', lat: 13.0827, lon: 80.2707, emissionsMt: 22, populationM: 11.5, sources: ['transport', 'power'] },
  { city: 'Hyderabad', lat: 17.3850, lon: 78.4867, emissionsMt: 23, populationM: 10.5, sources: ['transport', 'industry'] },
  { city: 'Kochi', lat: 9.9312, lon: 76.2673, emissionsMt: 5, populationM: 0.7, sources: ['transport', 'residential'] },
  { city: 'Coimbatore', lat: 11.0168, lon: 76.9558, emissionsMt: 6, populationM: 2.2, sources: ['industry', 'transport'] },
  { city: 'Visakhapatnam', lat: 17.6868, lon: 83.2185, emissionsMt: 8, populationM: 2.3, sources: ['industry', 'power'] },
  // West
  { city: 'Mumbai', lat: 19.0760, lon: 72.8777, emissionsMt: 30, populationM: 21, sources: ['transport', 'industry', 'power'] },
  { city: 'Pune', lat: 18.5204, lon: 73.8567, emissionsMt: 12, populationM: 7.6, sources: ['transport', 'industry'] },
  { city: 'Ahmedabad', lat: 23.0225, lon: 72.5714, emissionsMt: 14, populationM: 8.2, sources: ['industry', 'power'] },
  { city: 'Surat', lat: 21.1702, lon: 72.8311, emissionsMt: 13, populationM: 7.0, sources: ['industry', 'transport'] },
  { city: 'Nagpur', lat: 21.1458, lon: 79.0882, emissionsMt: 7, populationM: 3.0, sources: ['transport', 'residential'] },
  // East
  { city: 'Kolkata', lat: 22.5726, lon: 88.3639, emissionsMt: 20, populationM: 15, sources: ['transport', 'power', 'industry'] },
  { city: 'Patna', lat: 25.5941, lon: 85.1376, emissionsMt: 7, populationM: 2.5, sources: ['transport', 'residential'] },
  { city: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, emissionsMt: 5, populationM: 1.0, sources: ['industry', 'power'] },
  { city: 'Ranchi', lat: 23.3441, lon: 85.3096, emissionsMt: 4, populationM: 1.5, sources: ['industry', 'residential'] },
  // Northeast
  { city: 'Guwahati', lat: 26.1445, lon: 91.7362, emissionsMt: 6, populationM: 1.1, sources: ['transport', 'residential'] },
  { city: 'Shillong', lat: 25.5788, lon: 91.8933, emissionsMt: 2, populationM: 0.3, sources: ['residential'] },
  // Central
  { city: 'Indore', lat: 22.7196, lon: 75.8577, emissionsMt: 8, populationM: 3.2, sources: ['transport', 'industry'] },
  { city: 'Bhopal', lat: 23.2599, lon: 77.4126, emissionsMt: 6, populationM: 2.6, sources: ['transport', 'residential'] },
  { city: 'Raipur', lat: 21.2514, lon: 81.6296, emissionsMt: 7, populationM: 1.9, sources: ['power', 'industry'] },
];

function getColor(mt) {
  if (mt < 6) return '#34d399'; // low
  if (mt < 12) return '#fbbf24'; // medium
  if (mt < 20) return '#fb923c'; // high
  return '#ef4444'; // very high
}

function calcPerCapita(mt, popM) {
  const totalT = mt * 1_000_000; // Mt -> tonnes
  const perCapita = totalT / (popM * 1_000_000);
  return perCapita; // t per person
}

function FitIndia() {
  const map = useMap();
  useMemo(() => {
    map.setView([22.9734, 78.6569], 5);
  }, [map]);
  return null;
}

export default function IndiaEmissionsMap() {
  const [selected, setSelected] = useState(null);

  const totals = useMemo(() => {
    const totalCities = CITY_DATA.length;
    const combinedMt = CITY_DATA.reduce((a, c) => a + c.emissionsMt, 0);
    const avgPerCapita = CITY_DATA.reduce((a, c) => a + calcPerCapita(c.emissionsMt, c.populationM), 0) / totalCities;
    const top = [...CITY_DATA].sort((a, b) => b.emissionsMt - a.emissionsMt).slice(0, 10);
    return { totalCities, combinedMt, avgPerCapita, top };
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <div className="xl:col-span-3 rounded-xl overflow-hidden border border-white/10">
        <MapContainer style={{ height: '70vh', width: '100%' }} zoom={5} center={[22.9734, 78.6569]} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitIndia />
          {CITY_DATA.map((c) => {
            const radius = Math.max(6, Math.sqrt(c.emissionsMt) * 4); // scale circle size
            const color = getColor(c.emissionsMt);
            const perCapita = calcPerCapita(c.emissionsMt, c.populationM);
            return (
              <CircleMarker
                key={c.city}
                center={[c.lat, c.lon]}
                radius={radius}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
                eventHandlers={{ click: () => setSelected(c) }}
              >
                <Tooltip direction="top" offset={[0, -2]} opacity={1} permanent={false}>
                  <div className="text-xs">
                    <div className="font-semibold">{c.city}</div>
                    <div>{c.emissionsMt} Mt/yr • Pop {c.populationM}M</div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div className="xl:col-span-1 rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-semibold mb-4">Statistics</h3>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Cities" value={totals.totalCities} />
          <Stat label="Combined" value={`${totals.combinedMt.toFixed(0)} Mt/yr`} />
          <Stat label="Avg per capita" value={`${totals.avgPerCapita.toFixed(2)} t`} />
        </dl>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-neutral-300">Top 10 emitting cities</h4>
          <ul className="mt-2 space-y-2 text-sm">
            {totals.top.map((c, idx) => (
              <li key={c.city} className="flex items-center justify-between">
                <span className="text-neutral-300">{idx + 1}. {c.city}</span>
                <span className="text-neutral-400">{c.emissionsMt} Mt</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-lg bg-white/5 border border-white/10 p-4 text-sm">
          <h4 className="font-medium mb-2">City details</h4>
          {selected ? (
            <div className="space-y-1">
              <div className="text-neutral-200 font-semibold">{selected.city}</div>
              <div className="text-neutral-400">Total: {selected.emissionsMt} Mt/yr</div>
              <div className="text-neutral-400">Population: {selected.populationM} M</div>
              <div className="text-neutral-400">Per capita: {calcPerCapita(selected.emissionsMt, selected.populationM).toFixed(2)} t</div>
              <div className="text-neutral-400">Sources: {selected.sources.join(', ')}</div>
            </div>
          ) : (
            <div className="text-neutral-400">Click a city marker to view details.</div>
          )}
        </div>

        <div className="mt-6 text-xs text-neutral-500">
          Circle size = total emissions; color: green (low) → yellow (medium) → orange (high) → red (very high)
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-md bg-white/5 border border-white/10 p-3">
      <div className="text-neutral-400 text-xs">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
