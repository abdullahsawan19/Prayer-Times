import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const PrayerTimesContext = createContext();

export function usePrayerTimes() {
  return useContext(PrayerTimesContext);
}

export function PrayerTimesProvider({
  children,
  initialCity = "Cairo",
  initialCountry = "Egypt",
}) {
  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState(initialCountry);
  const [timings, setTimings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrayerTimes() {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`
        );
        setTimings(res.data.data.timings);
      } catch (err) {
        console.error("فشل تحميل مواقيت الصلاة:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrayerTimes();
  }, [city, country]);

  return (
    <PrayerTimesContext.Provider
      value={{
        timings,
        loading,
        city,
        country,
        setCity,
        setCountry,
      }}
    >
      {children}
    </PrayerTimesContext.Provider>
  );
}
