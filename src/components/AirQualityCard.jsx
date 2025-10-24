import { useEffect, useMemo, useState } from 'react';
import { MapPin, Crosshair, RefreshCcw } from 'lucide-react';

const AQI_BANDS = [
  { max: 50, label: 'Good', color: 'bg-green-500', text: 'text-green-300' },
  { max: 100, label: 'Moderate', color: 'bg-yellow-400', text: 'text-yellow-300' },
  { max: 150, label: 'Unhealthy for SG', color: 'bg-orange-500', text: 'text-orange-300' },
  { max: 200, label: 'Unhealthy', color: 'bg-red-500', text: 'text-red-300' },
  { max: 300, label: 'Very Unhealthy', color: 'bg-purple-600', text: 'text-purple-300' },
  { max: Infinity, label: 'Hazardous', color: 'bg-rose-900', text: 'text-rose-300' },
];

// OpenAQ helper to approximate AQI from PM2.5 using US EPA formula
function pm25ToAQI(pm) {
  // Breakpoints (µg/m3)
  const ranges = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
  ];
  const bp = ranges.find(r => pm >= r.cLow && pm <= r.cHigh) || ranges[ranges.length - 1];
  const aqi = ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm - bp.cLow) + bp.iLow;
  return Math.round(aqi);
}

export default function AirQualityCard() {
  const [coords, setCoords] = useState(null);
  const [aq, setAq] = useState({ loading: false, error: null, data: null });

  const fetchAQ = async (latitude, longitude) => {
    try {
      setAq({ loading: true, error: null, data: null });
      const url = `https://api.openaq.org/v2/latest?coordinates=${latitude},${longitude}&radius=20000&limit=50`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch air quality');
      const json = await res.json();
      // Consolidate by parameter
      const params = {};
      for (const r of json.results || []) {
        for (const m of r.measurements || []) {
          const key = m.parameter?.toUpperCase();
          if (!key) continue;
          if (!params[key]) params[key] = [];
          params[key].push(m.value);
        }
      }
      const avg = (arr) => (arr && arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
      const pm25 = avg(params['PM25']);
      const pm10 = avg(params['PM10']);
      const no2 = avg(params['NO2']);
      const so2 = avg(params['SO2']);
      const o3 = avg(params['O3']);
      const co = avg(params['CO']);
      const aqi = pm25 != null ? pm25ToAQI(pm25) : null;
      setAq({ loading: false, error: null, data: { aqi, pm25, pm10, no2, so2, o3, co } });
    } catch (e) {
      setAq({ loading: false, error: e.message || 'Error', data: null });
    }
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setAq((s) => ({ ...s, error: 'Geolocation not supported' }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        fetchAQ(latitude, longitude);
      },
      (err) => {
        setAq((s) => ({ ...s, error: err.message || 'Location permission denied' }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const band = useMemo(() => {
    if (!aq.data?.aqi && aq.data?.aqi !== 0) return null;
    return AQI_BANDS.find((b) => aq.data.aqi <= b.max) || AQI_BANDS[AQI_BANDS.length - 1];
  }, [aq.data]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">Live Air Quality</h3>
          <p className="text-sm text-neutral-400">Using OpenAQ community data near your location</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={locate} className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition">
            <Crosshair className="h-4 w-4" /> Locate
          </button>
          <button onClick={() => coords && fetchAQ(coords.latitude, coords.longitude)} className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div className="sm:col-span-1">
          <div className="text-sm text-neutral-400 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {coords ? (
              <span>
                {coords.latitude.toFixed(3)}, {coords.longitude.toFixed(3)}
              </span>
            ) : (
              <span>Awaiting location...</span>
            )}
          </div>
          <div className="mt-3">
            {aq.loading ? (
              <div className="animate-pulse h-24 w-24 rounded-full bg-white/10" />
            ) : aq.error ? (
              <div className="text-sm text-rose-300">{aq.error}</div>
            ) : (
              <div className="flex flex-col items-start">
                <div className="text-xs text-neutral-400">AQI</div>
                <div className="flex items-end gap-2">
                  <div className="text-5xl font-extrabold">{aq.data?.aqi ?? '—'}</div>
                  {band && (
                    <span className={`text-sm font-medium ${band.text}`}>{band.label}</span>
                  )}
                </div>
                {band && <div className={`mt-3 h-2 w-40 rounded-full ${band.color}`} />}
              </div>
            )}
          </div>
        </div>

        <div className="sm:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
          <Pollutant label="PM2.5" value={aq.data?.pm25} unit="µg/m³" color="text-emerald-300" />
          <Pollutant label="PM10" value={aq.data?.pm10} unit="µg/m³" color="text-yellow-300" />
          <Pollutant label="NO₂" value={aq.data?.no2} unit="µg/m³" color="text-orange-300" />
          <Pollutant label="O₃" value={aq.data?.o3} unit="µg/m³" color="text-blue-300" />
          <Pollutant label="CO" value={aq.data?.co} unit="mg/m³" color="text-neutral-300" />
          <Pollutant label="SO₂" value={aq.data?.so2} unit="µg/m³" color="text-purple-300" />
        </div>
      </div>

      <div className="mt-4 text-xs text-neutral-500">
        Source: OpenAQ. AQI approximated from PM2.5 using US EPA breakpoints; may differ from local indices.
      </div>
    </div>
  );
}

function Pollutant({ label, value, unit, color }) {
  return (
    <div className="rounded-md bg-white/5 border border-white/10 p-3">
      <div className="text-neutral-400 text-xs">{label}</div>
      <div className={`font-semibold ${color}`}>{value != null ? value.toFixed(1) : '—'} <span className="text-neutral-500 text-xs">{value != null ? unit : ''}</span></div>
    </div>
  );
}
