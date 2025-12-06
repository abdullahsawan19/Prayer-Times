import CustomizedSwitches from "./DarkAndLight";
import Cards from "./Cards";
import Container from "@mui/material/Container";

import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";

import { useDarkMode } from "../DarkModeContext";
import { usePrayerTimes } from "../PrayerTimesContext";

export default function Payars() {
  const { darkMode } = useDarkMode();
  const { timings, loading, city, country } = usePrayerTimes();

  const [formattedDates, setFormattedDates] = useState({
    gregorian: "",
    hijri: "",
    Times: "",
  });

  useEffect(() => {
    const updateDates = () => {
      const now = new Date();

      const gregorian = now.toLocaleString("en-EG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const Times = now.toLocaleString("en-EG", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const hijri = now.toLocaleString("ar-EG-u-ca-islamic", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      setFormattedDates({ gregorian, hijri, Times });
    };

    updateDates();
    const interval = setInterval(updateDates, 1000);

    return () => clearInterval(interval);
  }, []);

  function getNextPrayer(timings) {
    if (!timings) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

    for (const name of prayers) {
      const timeStr = timings[name];
      const [hour, minute] = timeStr.split(":").map(Number);
      const prayerMinutes = hour * 60 + minute;

      if (prayerMinutes > currentMinutes) {
        return { name, time: timeStr };
      }
    }

    // لو عدى كل الأوقات، نرجع أول صلاة في اليوم التالي
    return { name: "Fajr", time: timings["Fajr"] };
  }

  function getCountdownToNextPrayer(targetTime) {
    if (!targetTime) return "";

    const now = new Date();
    const [targetHour, targetMinute] = targetTime.split(":").map(Number);

    const nowInMinutes = now.getHours() * 60 + now.getMinutes();
    const targetInMinutes = targetHour * 60 + targetMinute;

    let diff = targetInMinutes - nowInMinutes;

    // لو الوقت عدى، يعني الصلاة الجاية بكرة
    if (diff <= 0) diff += 24 * 60;

    const hours = Math.floor(diff / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (diff % 60).toString().padStart(2, "0");

    return `- ${hours}:${minutes}`;
  }
  const nextPrayer = getNextPrayer(timings);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 5,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // صف في الشاشات الكبيرة
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          paddingBottom: { xs: 2, sm: 4 },
        }}
      >
        {/* التاريخ والتوقيت */}
        <Box
          sx={{
            textAlign: { xs: "left", sm: "left" },
            flex: 1, // خذ المساحة المتاحة
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              paddingTop: { xs: 2, sm: 6 },
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
              fontWeight: "bold",
            }}
          >
            Prayer times in {city}, {country}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            📅 Gregorian: {formattedDates.gregorian}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            🕋 Hijri: {formattedDates.hijri}
          </Typography>
          <Typography variant="body1">
            ⏰ Current Time: {formattedDates.Times}
          </Typography>
        </Box>

        {/* زر الوضع الليلي */}
        <Box
          sx={{
            alignSelf: { xs: "flex-start", md: "center" },
          }}
        >
          <CustomizedSwitches />
        </Box>
      </Box>
      <hr style={{ borderColor: darkMode ? "white" : "black" }} />
      <Typography variant="h3">
        {loading
          ? "Loading next prayer..."
          : `Next Prayer in ${getCountdownToNextPrayer(nextPrayer?.time)}`}
      </Typography>{" "}
      <Box sx={{ mt: 11 }}>
        <Cards />
      </Box>
    </Container>
  );
}
