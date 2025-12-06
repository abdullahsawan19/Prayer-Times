import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useDarkMode } from "../DarkModeContext";
import { MdOutlineWbTwilight } from "react-icons/md";
import {
  BsFillSunriseFill,
  BsFillSunFill,
  BsFillSunsetFill,
} from "react-icons/bs";
import { WiMoonWaxingCrescent3 } from "react-icons/wi";
import { usePrayerTimes } from "../PrayerTimesContext";
import { useMemo } from "react";

const prayers = [
  { name: "Fajr", icon: <MdOutlineWbTwilight /> },
  { name: "Sunrise", icon: <BsFillSunriseFill /> },
  { name: "Dhuhr", icon: <BsFillSunFill /> },
  { name: "Asr", icon: <BsFillSunsetFill /> },
  { name: "Maghrib", icon: <MdOutlineWbTwilight /> },
  { name: "Isha", icon: <WiMoonWaxingCrescent3 /> },
];

function convertTo12Hour(time24) {
  if (!time24) return "";
  const [hour, minute] = time24.split(":").map(Number);
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function Cards() {
  const { darkMode } = useDarkMode();
  const { timings, loading } = usePrayerTimes();

  const nextPrayer = useMemo(() => {
    if (!timings) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayerOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

    for (const name of prayerOrder) {
      const timeStr = timings[name];
      const [hour, minute] = timeStr.split(":").map(Number);
      const prayerMinutes = hour * 60 + minute;

      if (prayerMinutes > currentMinutes) {
        return { name, time: timeStr };
      }
    }

    return { name: "Fajr", time: timings["Fajr"] };
  }, [timings]);

  return (
    <div
      className="cards-container"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "space-around",
      }}
    >
      {prayers.map((prayer) => (
        <div className="card" key={prayer.name}>
          <Box
            sx={{
              minWidth: 180,
              flexBasis: {
                xs: "100%",
                sm: "48%",
                md: "30%",
              },
              flexGrow: 1,
            }}
          >
            <Card
              variant="outlined"
              sx={{
                backgroundColor:
                  prayer.name === nextPrayer?.name
                    ? darkMode
                      ? "rgba(17, 10, 42, 0.41)" // لون مميز في الوضع الداكن
                      : "rgba(57, 110, 59, 0.6)" // لون مميز في الوضع الفاتح
                    : "transparent", // الخلفية العادية لكل البطاقات
                backdropFilter: "blur(8px)",
                border: "2px solid rgba(255, 255, 255, 0.7)",
                borderRadius: "16px",
                boxShadow:
                  prayer.name === nextPrayer?.name
                    ? darkMode
                      ? "0 6px 16px rgba(17, 10, 42, 0.41)"
                      : "0 4px 8px rgba(57, 110, 59, 0.6)"
                    : "0 4px 8px rgba(0, 0, 0, 0.3)",
                transform:
                  prayer.name === nextPrayer?.name ? "scale(1.09)" : "scale(1)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ color: darkMode ? "white" : "black" }}
                  >
                    {prayer.name}
                  </Typography>
                  <div style={{ fontSize: "24px", color: "#555" }}>
                    {prayer.icon}
                  </div>
                </div>
                <Typography
                  variant="body2"
                  sx={{
                    color: darkMode ? "white" : "black",
                    fontSize: "1.4rem",
                    marginTop: "15px",
                  }}
                >
                  {loading ? "..." : convertTo12Hour(timings?.[prayer.name])}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </div>
      ))}
    </div>
  );
}
