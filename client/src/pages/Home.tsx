/**
 * Brolly Settings Page
 * Design: Dark theme with teal accents
 * Colors: near-black backgrounds, teal (#14b8a6) accents, white text
 * Typography: Space Grotesk headers, JetBrains Mono values
 */

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toaster, toast } from "sonner";

interface Settings {
  displayHourMarkers: boolean;
  displayMinorMarkers: boolean;
  batteryIndicatorEnabled: boolean;
  shakeMode: number;
  dateVisible: number;
  tempVisible: number;
  tempUnit: number;
  weatherService: number;
  customLocation: string;
  btDisconnectMinInnerRed: boolean;
  btDisconnectOuterColor: string;
  btDisconnectInnerColor: string;
  vibrateBtDisconnect: boolean;
  vibrateBtReconnect: boolean;
  frequency: number;
  hourHandOuter: string;
  hourHandInner: string;
  minHandOuter: string;
  minHandInner: string;
  numberFont: number;
  numberSize: number; // 0=small (12px), 1=medium (24px), 2=large (32px)
  iconSize: number; // 0=small (75%), 1=medium (100%), 2=large (125%)
  backgroundColor: string;
  numberColor: string;
  numberColorMode: number; // 0=single color, 1=rainbow
  iconColor: string;
  iconColorMode: number; // 0=single color, 1=rainbow
  hourMarkerColor: string;
  minuteMarkerColor: string;
  centerDot50Color: string;
  centerDot20Color: string;
  middleRing20Color: string;
  dateColor: string;
  tempColor: string;
  secondsHandColor: string;
  secondsHandMode: number; // 0=never, 1=always, 2=shake only
  secondsShakeDur: number; // seconds: 5, 10, 20, 30
  sunriseMarkerVisible: number; // 0=always, 1=with weather icons, 2=off
  sunriseMarkerColor: string;
  sunsetMarkerColor: string;
  wuApiKey: string;
}

const DEFAULT_SETTINGS: Settings = {
  displayHourMarkers: true,
  displayMinorMarkers: true,
  batteryIndicatorEnabled: true,
  shakeMode: 0,
  dateVisible: 0,
  tempVisible: 0,
  tempUnit: 0,
  weatherService: 0,
  customLocation: "",
  btDisconnectMinInnerRed: true,
  btDisconnectOuterColor: "#ff0000",
  btDisconnectInnerColor: "#ff0000",
  vibrateBtDisconnect: true,
  vibrateBtReconnect: false,
  frequency: 30,
  hourHandOuter: "#ffffff",
  hourHandInner: "#000000",
  minHandOuter: "#000000",
  minHandInner: "#0061fe",
  numberFont: 3,
  numberSize: 1,
  iconSize: 1,
  backgroundColor: "#000000",
  numberColor: "#ffffff",
  numberColorMode: 0,
  iconColor: "#ffffff",
  iconColorMode: 0,
  hourMarkerColor: "#ffffff",
  minuteMarkerColor: "#ffffff",
  centerDot50Color: "#ff0000",
  centerDot20Color: "#ff0000",
  middleRing20Color: "#ff0000",
  dateColor: "#858585",
  tempColor: "#858585",
  secondsHandColor: "#ffffff",
  secondsHandMode: 2,
  secondsShakeDur: 10,
  sunriseMarkerVisible: 0,
  sunriseMarkerColor: "#ff9500",
  sunsetMarkerColor: "#0061fe",
  wuApiKey: "",
};

// Color presets for quick theme application
interface ColorPreset {
  name: string;
  colors: Partial<Settings>;
}

const COLOR_PRESETS: ColorPreset[] = [
  {
    name: "Default",
    colors: {
      backgroundColor: "#000000",
      numberColor: "#ffffff",
      iconColor: "#ffffff",
      hourMarkerColor: "#ffffff",
      minuteMarkerColor: "#ffffff",
      hourHandOuter: "#ffffff",
      hourHandInner: "#000000",
      minHandOuter: "#ffffff",
      minHandInner: "#0061fe",
      dateColor: "#858585",
      tempColor: "#858585",
    },
  },
  {
    name: "Inverted",
    colors: {
      backgroundColor: "#ffffff",
      numberColor: "#000000",
      iconColor: "#000000",
      hourMarkerColor: "#000000",
      minuteMarkerColor: "#000000",
      hourHandOuter: "#000000",
      hourHandInner: "#ffffff",
      minHandOuter: "#000000",
      minHandInner: "#0061fe",
      dateColor: "#858585",
      tempColor: "#858585",
    },
  },
  {
    name: "Ocean",
    colors: {
      backgroundColor: "#001a4d",
      numberColor: "#00d4ff",
      iconColor: "#00d4ff",
      hourMarkerColor: "#00d4ff",
      minuteMarkerColor: "#0099cc",
      hourHandOuter: "#00ffff",
      hourHandInner: "#001a4d",
      minHandOuter: "#00ffff",
      minHandInner: "#ff6600",
      dateColor: "#858585",
      tempColor: "#858585",
    },
  },
  {
    name: "Sunset",
    colors: {
      backgroundColor: "#2a1a00",
      numberColor: "#ffaa00",
      iconColor: "#ffaa00",
      hourMarkerColor: "#ffaa00",
      minuteMarkerColor: "#ff6600",
      hourHandOuter: "#ffdd00",
      hourHandInner: "#2a1a00",
      minHandOuter: "#ff6600",
      minHandInner: "#ff0000",
      dateColor: "#858585",
      tempColor: "#858585",
    },
  },
  {
    name: "Forest",
    colors: {
      backgroundColor: "#0a2a0a",
      numberColor: "#66ff66",
      iconColor: "#66ff66",
      hourMarkerColor: "#66ff66",
      minuteMarkerColor: "#33cc33",
      hourHandOuter: "#99ff99",
      hourHandInner: "#0a2a0a",
      minHandOuter: "#66ff66",
      minHandInner: "#ffff00",
      dateColor: "#858585",
      tempColor: "#858585",
    },
  },
  {
    name: "Midnight",
    colors: {
      backgroundColor: "#0a0a1a",
      numberColor: "#9999ff",
      iconColor: "#9999ff",
      hourMarkerColor: "#9999ff",
      minuteMarkerColor: "#6666ff",
      hourHandOuter: "#ccccff",
      hourHandInner: "#0a0a1a",
      minHandOuter: "#9999ff",
      minHandInner: "#ff99ff",
      dateColor: "#858585",
      tempColor: "#858585",
    },
  },
  {
    name: "Crimson",
    colors: {
      backgroundColor: "#2a0a0a",
      numberColor: "#ff6666",
      iconColor: "#ff6666",
      hourMarkerColor: "#ff6666",
      minuteMarkerColor: "#ff3333",
      hourHandOuter: "#ff9999",
      hourHandInner: "#2a0a0a",
      minHandOuter: "#ff6666",
      minHandInner: "#ffff00",
      dateColor: "#858585",
      tempColor: "#858585",
    },
  },
  {
    name: "Monochrome",
    colors: {
      backgroundColor: "#1a1a1a",
      numberColor: "#cccccc",
      iconColor: "#cccccc",
      hourMarkerColor: "#cccccc",
      minuteMarkerColor: "#999999",
      hourHandOuter: "#ffffff",
      hourHandInner: "#1a1a1a",
      minHandOuter: "#cccccc",
      minHandInner: "#666666",
      dateColor: "#858585",
      tempColor: "#858585",
    },
  },
  {
    name: "Neon",
    colors: {
      backgroundColor: "#0a0a0a",
      numberColor: "#00ff00",
      iconColor: "#00ff00",
      hourMarkerColor: "#00ff00",
      minuteMarkerColor: "#00cc00",
      hourHandOuter: "#00ff00",
      hourHandInner: "#0a0a0a",
      minHandOuter: "#ff00ff",
      minHandInner: "#00ffff",
      dateColor: "#858585",
      tempColor: "#858585",
    },
  },
  {
    name: "Amber",
    colors: {
      backgroundColor: "#1a1000",
      numberColor: "#ffcc00",
      iconColor: "#ffcc00",
      hourMarkerColor: "#ffcc00",
      minuteMarkerColor: "#ff9900",
      hourHandOuter: "#ffee99",
      hourHandInner: "#1a1000",
      minHandOuter: "#ffcc00",
      minHandInner: "#ff6600",
      dateColor: "#858585",
      tempColor: "#858585",
    },
  },
];

// Helper: CloudPebble passes a `return_to` query param for the emulator.
// Use it if present; otherwise fall back to the standard pebblekit-js protocol.
function getReturnTo(): string {
  const params = new URLSearchParams(window.location.search);
  // CloudPebble emulator passes a return_to param; real Pebble/Rebble app uses pebblejs://close#
  return params.get('return_to') || 'pebblejs://close#';
}

export default function Home() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState("appearance");

  useEffect(() => {
    const stored = localStorage.getItem("aww2ConfigData") || localStorage.getItem("brolly-settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const mapped: Partial<Settings> = {};
        if (parsed.KEY_DISPLAY_HOUR_MARKERS !== undefined) mapped.displayHourMarkers = parsed.KEY_DISPLAY_HOUR_MARKERS !== 0;
        if (parsed.KEY_DISPLAY_MINOR_MARKERS !== undefined) mapped.displayMinorMarkers = parsed.KEY_DISPLAY_MINOR_MARKERS !== 0;
        if (parsed.KEY_SHAKE_MODE !== undefined) mapped.shakeMode = parsed.KEY_SHAKE_MODE;
        if (parsed.KEY_DATE_VISIBLE !== undefined) mapped.dateVisible = parsed.KEY_DATE_VISIBLE;
        if (parsed.KEY_TEMP_VISIBLE !== undefined) mapped.tempVisible = parsed.KEY_TEMP_VISIBLE;
        if (parsed.KEY_TEMP_UNIT !== undefined) mapped.tempUnit = parsed.KEY_TEMP_UNIT;
        if (parsed.KEY_WEATHER_SERVICE !== undefined) mapped.weatherService = parsed.KEY_WEATHER_SERVICE;
        if (parsed.KEY_CUSTOM_LOCATION !== undefined) mapped.customLocation = parsed.KEY_CUSTOM_LOCATION;
        if (parsed.KEY_BT_DISCONNECT_MIN_INNER_RED !== undefined) mapped.btDisconnectMinInnerRed = parsed.KEY_BT_DISCONNECT_MIN_INNER_RED !== 0;
        if (parsed.KEY_BT_DISCONNECT_OUTER_COLOR !== undefined) mapped.btDisconnectOuterColor = rgbToHex(parsed.KEY_BT_DISCONNECT_OUTER_COLOR);
        if (parsed.KEY_BT_DISCONNECT_INNER_COLOR !== undefined) mapped.btDisconnectInnerColor = rgbToHex(parsed.KEY_BT_DISCONNECT_INNER_COLOR);
        if (parsed.KEY_VIBRATE_BT_DISCONNECT !== undefined) mapped.vibrateBtDisconnect = parsed.KEY_VIBRATE_BT_DISCONNECT !== 0;
        if (parsed.KEY_VIBRATE_BT_RECONNECT !== undefined) mapped.vibrateBtReconnect = parsed.KEY_VIBRATE_BT_RECONNECT !== 0;
        if (parsed.KEY_HOUR_HAND_OUTER !== undefined) mapped.hourHandOuter = rgbToHex(parsed.KEY_HOUR_HAND_OUTER);
        if (parsed.KEY_HOUR_HAND_INNER !== undefined) mapped.hourHandInner = rgbToHex(parsed.KEY_HOUR_HAND_INNER);
        if (parsed.KEY_MIN_HAND_OUTER !== undefined) mapped.minHandOuter = rgbToHex(parsed.KEY_MIN_HAND_OUTER);
        if (parsed.KEY_MIN_HAND_INNER !== undefined) mapped.minHandInner = rgbToHex(parsed.KEY_MIN_HAND_INNER);
        if (parsed.KEY_NUMBER_FONT !== undefined) mapped.numberFont = parsed.KEY_NUMBER_FONT;
        if (parsed.KEY_NUMBER_SIZE !== undefined) mapped.numberSize = parsed.KEY_NUMBER_SIZE;
        if (parsed.KEY_ICON_SIZE !== undefined) mapped.iconSize = parsed.KEY_ICON_SIZE;
        if (parsed.KEY_NUMBER_COLOR_MODE !== undefined) mapped.numberColorMode = parsed.KEY_NUMBER_COLOR_MODE;
        if (parsed.KEY_ICON_COLOR_MODE !== undefined) mapped.iconColorMode = parsed.KEY_ICON_COLOR_MODE;
        if (parsed.KEY_BACKGROUND_COLOR !== undefined) mapped.backgroundColor = rgbToHex(parsed.KEY_BACKGROUND_COLOR);
        if (parsed.KEY_NUMBER_COLOR !== undefined) mapped.numberColor = rgbToHex(parsed.KEY_NUMBER_COLOR);
        if (parsed.KEY_ICON_COLOR !== undefined) mapped.iconColor = rgbToHex(parsed.KEY_ICON_COLOR);
        if (parsed.KEY_HOUR_MARKER_COLOR !== undefined) mapped.hourMarkerColor = rgbToHex(parsed.KEY_HOUR_MARKER_COLOR);
        if (parsed.KEY_MINUTE_MARKER_COLOR !== undefined) mapped.minuteMarkerColor = rgbToHex(parsed.KEY_MINUTE_MARKER_COLOR);
        if (parsed.KEY_CENTER_DOT_50_COLOR !== undefined) mapped.centerDot50Color = rgbToHex(parsed.KEY_CENTER_DOT_50_COLOR);
        if (parsed.KEY_CENTER_DOT_20_COLOR !== undefined) mapped.centerDot20Color = rgbToHex(parsed.KEY_CENTER_DOT_20_COLOR);
        if (parsed.KEY_MIDDLE_RING_20_COLOR !== undefined) mapped.middleRing20Color = rgbToHex(parsed.KEY_MIDDLE_RING_20_COLOR);
        if (parsed.KEY_DATE_COLOR !== undefined) mapped.dateColor = rgbToHex(parsed.KEY_DATE_COLOR);
        if (parsed.KEY_TEMP_COLOR !== undefined) mapped.tempColor = rgbToHex(parsed.KEY_TEMP_COLOR);
        if (parsed.KEY_BATTERY_INDICATOR_ENABLED !== undefined) mapped.batteryIndicatorEnabled = parsed.KEY_BATTERY_INDICATOR_ENABLED !== 0;
        if (parsed.KEY_SECONDS_HAND_COLOR !== undefined) {
          const hex = rgbToHex(parsed.KEY_SECONDS_HAND_COLOR);
          if (hex !== "transparent") mapped.secondsHandColor = hex;
        }
        if (parsed.KEY_SECONDS_HAND_MODE !== undefined) mapped.secondsHandMode = parsed.KEY_SECONDS_HAND_MODE;
        if (parsed.KEY_SECONDS_SHAKE_DUR !== undefined) mapped.secondsShakeDur = parsed.KEY_SECONDS_SHAKE_DUR;
        if (parsed.KEY_SUNRISE_MARKER_VISIBLE !== undefined) mapped.sunriseMarkerVisible = parsed.KEY_SUNRISE_MARKER_VISIBLE;
        if (parsed.KEY_SUNRISE_MARKER_COLOR !== undefined) {
          const hex = rgbToHex(parsed.KEY_SUNRISE_MARKER_COLOR);
          if (hex !== "transparent") mapped.sunriseMarkerColor = hex;
        }
        if (parsed.KEY_SUNSET_MARKER_COLOR !== undefined) {
          const hex = rgbToHex(parsed.KEY_SUNSET_MARKER_COLOR);
          if (hex !== "transparent") mapped.sunsetMarkerColor = hex;
        }
        if (parsed.KEY_WU_API_KEY !== undefined) mapped.wuApiKey = parsed.KEY_WU_API_KEY;
        setSettings({ ...DEFAULT_SETTINGS, ...mapped });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const handleSave = () => {
    const configData: Record<string, number | string> = {
      KEY_DISPLAY_HOUR_MARKERS: settings.displayHourMarkers ? 1 : 0,
      KEY_DISPLAY_MINOR_MARKERS: settings.displayMinorMarkers ? 1 : 0,
      KEY_SHAKE_MODE: settings.shakeMode,
      KEY_DATE_VISIBLE: settings.dateVisible,
      KEY_TEMP_VISIBLE: settings.tempVisible,
      KEY_TEMP_UNIT: settings.tempUnit,
      KEY_WEATHER_SERVICE: settings.weatherService,
      KEY_CUSTOM_LOCATION: settings.customLocation,
      KEY_BT_DISCONNECT_MIN_INNER_RED: settings.btDisconnectMinInnerRed ? 1 : 0,
      KEY_BT_DISCONNECT_OUTER_COLOR: hexToRgb(settings.btDisconnectOuterColor),
      KEY_BT_DISCONNECT_INNER_COLOR: hexToRgb(settings.btDisconnectInnerColor),
      KEY_VIBRATE_BT_DISCONNECT: settings.vibrateBtDisconnect ? 1 : 0,
      KEY_VIBRATE_BT_RECONNECT: settings.vibrateBtReconnect ? 1 : 0,
      KEY_HOUR_HAND_OUTER: hexToRgb(settings.hourHandOuter),
      KEY_HOUR_HAND_INNER: hexToRgb(settings.hourHandInner),
      KEY_MIN_HAND_OUTER: hexToRgb(settings.minHandOuter),
      KEY_MIN_HAND_INNER: hexToRgb(settings.minHandInner),
      KEY_NUMBER_FONT: settings.numberFont,
      KEY_NUMBER_SIZE: settings.numberSize,
      KEY_ICON_SIZE: settings.iconSize,
      KEY_NUMBER_COLOR_MODE: settings.numberColorMode,
      KEY_ICON_COLOR_MODE: settings.iconColorMode,
      KEY_BACKGROUND_COLOR: hexToRgb(settings.backgroundColor),
      KEY_NUMBER_COLOR: hexToRgb(settings.numberColor),
      KEY_ICON_COLOR: hexToRgb(settings.iconColor),
      KEY_HOUR_MARKER_COLOR: hexToRgb(settings.hourMarkerColor),
      KEY_MINUTE_MARKER_COLOR: hexToRgb(settings.minuteMarkerColor),
      KEY_CENTER_DOT_50_COLOR: hexToRgb(settings.centerDot50Color),
      KEY_CENTER_DOT_20_COLOR: hexToRgb(settings.centerDot20Color),
      KEY_MIDDLE_RING_20_COLOR: hexToRgb(settings.middleRing20Color),
      KEY_DATE_COLOR: hexToRgb(settings.dateColor),
      KEY_TEMP_COLOR: hexToRgb(settings.tempColor),
      KEY_BATTERY_INDICATOR_ENABLED: settings.batteryIndicatorEnabled ? 1 : 0,
      KEY_SECONDS_HAND_COLOR: hexToRgb(settings.secondsHandColor),
      KEY_SECONDS_HAND_MODE: settings.secondsHandMode,
      KEY_SECONDS_SHAKE_DUR: settings.secondsShakeDur,
      KEY_SUNRISE_MARKER_VISIBLE: settings.sunriseMarkerVisible,
      KEY_SUNRISE_MARKER_COLOR: hexToRgb(settings.sunriseMarkerColor),
      KEY_SUNSET_MARKER_COLOR: hexToRgb(settings.sunsetMarkerColor),
      KEY_WU_API_KEY: settings.wuApiKey,
    };
    localStorage.setItem("aww2ConfigData", JSON.stringify(configData));
    localStorage.setItem("brolly-settings", JSON.stringify(settings));
    toast.success("Settings saved!");
    setTimeout(() => {
      window.location.href = getReturnTo() + encodeURIComponent(JSON.stringify(configData));
    }, 500);
  };

  const handleResetColors = () => {
    // Reset only colour fields, keep weather/font/toggle/visibility settings
    setSettings({
      ...settings,
      hourHandOuter: DEFAULT_SETTINGS.hourHandOuter,
      hourHandInner: DEFAULT_SETTINGS.hourHandInner,
      minHandOuter: DEFAULT_SETTINGS.minHandOuter,
      minHandInner: DEFAULT_SETTINGS.minHandInner,
      backgroundColor: DEFAULT_SETTINGS.backgroundColor,
      numberColor: DEFAULT_SETTINGS.numberColor,
      iconColor: DEFAULT_SETTINGS.iconColor,
      hourMarkerColor: DEFAULT_SETTINGS.hourMarkerColor,
      minuteMarkerColor: DEFAULT_SETTINGS.minuteMarkerColor,
      centerDot50Color: DEFAULT_SETTINGS.centerDot50Color,
      centerDot20Color: DEFAULT_SETTINGS.centerDot20Color,
      middleRing20Color: DEFAULT_SETTINGS.middleRing20Color,
      dateColor: DEFAULT_SETTINGS.dateColor,
      tempColor: DEFAULT_SETTINGS.tempColor,
      secondsHandColor: DEFAULT_SETTINGS.secondsHandColor,
      btDisconnectOuterColor: DEFAULT_SETTINGS.btDisconnectOuterColor,
      btDisconnectInnerColor: DEFAULT_SETTINGS.btDisconnectInnerColor,
      sunriseMarkerColor: DEFAULT_SETTINGS.sunriseMarkerColor,
      sunsetMarkerColor: DEFAULT_SETTINGS.sunsetMarkerColor,
    });
    toast.success("Colours reset to defaults");
  };

  const handleResetAll = () => {
    setSettings(DEFAULT_SETTINGS);
    toast.success("All settings reset to defaults");
  };

  const applyPreset = (preset: ColorPreset) => {
    setSettings({ ...settings, ...preset.colors });
    toast.success(`Applied "${preset.name}" preset`);
  };

  const getPresetImageUrl = (presetName: string): string => {
    const imageMap: Record<string, string> = {
      "Default": "/manus-storage/IMG_C433BD088408-1_c96dc335.jpeg",
      "Inverted": "/manus-storage/IMG_E3B6BCC4B1F1-1_87411413.jpeg",
      "Ocean": "/manus-storage/IMG_9D9434696671-1_47f0da9b.jpeg",
      "Sunset": "/manus-storage/IMG_54901F676A42-1_c57b02f4.jpeg",
      "Forest": "/manus-storage/IMG_D55C24B6C042-1_6d4ca282.jpeg",
      "Midnight": "/manus-storage/IMG_DCB15D56E11B-1_1354e778.jpeg",
      "Crimson": "/manus-storage/IMG_76C2875B1093-1_6a39892f.jpeg",
      "Monochrome": "/manus-storage/IMG_8A12F4F81E5B-1_d6529244.jpeg",
      "Neon": "/manus-storage/JPEGimage-453B-A504-91-0_6b606e97.jpeg",
      "Amber": "/manus-storage/IMG_4CD0B48F6131-1_05797969.jpeg",
    };
    return imageMap[presetName] || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <Toaster />
      {/* Sticky Header with Tabs and Save Button */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-2xl mx-auto px-6 py-4">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-4xl font-bold">Brolly Settings</h1>
          </div>

          {/* Tabs and Save Button */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-0 min-w-0">
            <div className="flex gap-0 min-w-0 flex-wrap">
              {[
                { id: "appearance", label: "APPEARANCE" },
                { id: "weather", label: "WEATHER" },
                { id: "alerts", label: "ALERTS" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 py-2 text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-teal-400 border-b-2 border-teal-400"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap border border-teal-400/50 text-sm flex-shrink-0"
            >
              ✓ Save
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "appearance" && (
            <>
              {/* BACKGROUND Section - Moved to top */}
              <Section title="BACKGROUND">
                <ColorPickerRow
                  label="Background colour"
                  description="Dial background colour"
                  value={settings.backgroundColor}
                  onChange={(v) => setSettings({ ...settings, backgroundColor: v })}
                />
              </Section>

              {/* Combined WATCH HANDS section */}
              <Section title="WATCH HANDS">
                <p className="text-xs text-teal-400/70 font-semibold uppercase tracking-wider">Hour hand</p>
                <ColorPickerRow
                  label="Outer colour"
                  description="Main body colour of the hour hand"
                  value={settings.hourHandOuter}
                  onChange={(v) => setSettings({ ...settings, hourHandOuter: v })}
                />
                <RowSep />
                <ColorPickerRow
                  label="Inner stripe"
                  description="Contrasting stripe running along the shaft"
                  value={settings.hourHandInner}
                  onChange={(v) => setSettings({ ...settings, hourHandInner: v })}
                />
                <RowSep />
                <p className="text-xs text-teal-400/70 font-semibold uppercase tracking-wider pt-1">Minute hand</p>
                <ColorPickerRow
                  label="Outer colour"
                  description="Main body colour of the minute hand"
                  value={settings.minHandOuter}
                  onChange={(v) => setSettings({ ...settings, minHandOuter: v })}
                />
                <RowSep />
                <ColorPickerRow
                  label="Inner stripe"
                  description="Contrasting stripe running along the shaft"
                  value={settings.minHandInner}
                  onChange={(v) => setSettings({ ...settings, minHandInner: v })}
                />
                <RowSep />
                <p className="text-xs text-teal-400/70 font-semibold uppercase tracking-wider pt-1">Seconds hand</p>
                <ColorPickerRow
                  label="Colour"
                  description="Colour of the seconds hand"
                  value={settings.secondsHandColor}
                  onChange={(v) => setSettings({ ...settings, secondsHandColor: v })}
                />
                <RowSep />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Visibility</label>
                  <p className="text-xs text-slate-400">When to show the seconds hand</p>
                  <select
                    value={settings.secondsHandMode}
                    onChange={(e) => setSettings({ ...settings, secondsHandMode: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white"
                  >
                    <option value={1}>Always show</option>
                    <option value={0}>Always hide</option>
                    <option value={2}>Show on shake only</option>
                  </select>
                </div>
                {settings.secondsHandMode === 2 && (
                  <>
                    <RowSep />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Shake duration</label>
                      <p className="text-xs text-slate-400">How long to show seconds hand after a shake</p>
                      <select
                        value={settings.secondsShakeDur}
                        onChange={(e) => setSettings({ ...settings, secondsShakeDur: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white"
                      >
                        <option value={5}>5 seconds</option>
                        <option value={10}>10 seconds</option>
                        <option value={20}>20 seconds</option>
                        <option value={30}>30 seconds</option>
                      </select>
                    </div>
                  </>
                )}
              </Section>

              {/* Combined NUMBERS & MARKERS section */}
              <Section title="NUMBERS & MARKERS">
                <FontPickerRow
                  value={settings.numberFont}
                  onChange={(v) => setSettings({ ...settings, numberFont: v })}
                />
                <RowSep />
                <div className="flex items-center justify-between py-3">
                  <Label className="text-sm font-medium">Number size</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={settings.numberSize === 0 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, numberSize: 0 })}
                    >
                      S
                    </Button>
                    <Button
                      variant={settings.numberSize === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, numberSize: 1 })}
                    >
                      M
                    </Button>
                    <Button
                      variant={settings.numberSize === 2 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, numberSize: 2 })}
                    >
                      L
                    </Button>
                  </div>
                </div>
                <RowSep />
                <SelectRow
                  label="Number colour mode"
                  value={settings.numberColorMode}
                  options={[
                    { value: 0, label: "Single colour" },
                    { value: 1, label: "Rainbow" },
                  ]}
                  onChange={(v) => setSettings({ ...settings, numberColorMode: v })}
                />
                <RowSep />
                {settings.numberColorMode === 0 && (
                  <>
                    <ColorPickerRow
                      label="Number colour"
                      description="Colour of hour numbers on the dial"
                      value={settings.numberColor}
                      onChange={(v) => setSettings({ ...settings, numberColor: v })}
                    />
                    <RowSep />
                  </>
                )}
                <ColorPickerRow
                  label="Hour marker colour"
                  description="Colour of hour position markers"
                  value={settings.hourMarkerColor}
                  onChange={(v) => setSettings({ ...settings, hourMarkerColor: v })}
                />
                <RowSep />
                <ColorPickerRow
                  label="Minute marker colour"
                  description="Colour of minute tick marks"
                  value={settings.minuteMarkerColor}
                  onChange={(v) => setSettings({ ...settings, minuteMarkerColor: v })}
                />
                <RowSep />
                <ToggleRow
                  label="Show hour numbers"
                  description="Display 1–12 at hour positions around the dial"
                  checked={settings.displayHourMarkers}
                  onChange={(v) => setSettings({ ...settings, displayHourMarkers: v })}
                />
                <RowSep />
                <ToggleRow
                  label="Show minute markers"
                  description="60 tick marks at all minute positions"
                  checked={settings.displayMinorMarkers}
                  onChange={(v) => setSettings({ ...settings, displayMinorMarkers: v })}
                />
              </Section>

              {/* Colour Presets Section */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-4">Colour Presets</h3>
                <div className="overflow-x-auto pb-2 -mx-4 px-4">
                  <div className="flex gap-3">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="flex-shrink-0 group relative"
                      >
                        <img
                          src={getPresetImageUrl(preset.name)}
                          alt={preset.name}
                          className="h-32 rounded border-2 border-slate-600 group-hover:border-teal-400 transition-colors object-contain"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded transition-colors"></div>
                        <p className="text-xs font-medium text-foreground mt-2 text-center whitespace-nowrap">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Note: Pebble displays use a 64-colour palette. Colours are automatically rounded to the nearest available shade.
              </div>
            </>
          )}

          {activeTab === "weather" && (
            <>
              <Section title="DIAL DISPLAY">
                <SelectRow
                  label="Dial mode"
                  value={settings.shakeMode}
                  options={[
                    { value: 0, label: "Numbers (shake for weather icons)" },
                    { value: 1, label: "Numbers only" },
                    { value: 2, label: "Weather icons always" },
                  ]}
                  onChange={(v) => setSettings({ ...settings, shakeMode: v })}
                />
                <RowSep />
                <SelectRow
                  label="Icon colour mode"
                  value={settings.iconColorMode}
                  options={[
                    { value: 0, label: "Single colour" },
                    { value: 1, label: "Rainbow" },
                  ]}
                  onChange={(v) => setSettings({ ...settings, iconColorMode: v })}
                />
                {settings.iconColorMode === 0 && (
                  <>
                    <RowSep />
                    <ColorPickerRow
                      label="Icon colour"
                      description="Colour of weather icons"
                      value={settings.iconColor}
                      onChange={(v) => setSettings({ ...settings, iconColor: v })}
                    />
                  </>
                )}
              </Section>

              <Section title="LOCATION & DATA">
                <SelectRow
                  label="Weather service"
                  value={settings.weatherService}
                  options={[
                    { value: 0, label: "Open-Meteo (free, no API key)" },
                    { value: 1, label: "Weather Underground (API key required)" },
                    { value: 2, label: "Native Pebble weather" },
                  ]}
                  onChange={(v) => setSettings({ ...settings, weatherService: v })}
                />
                {settings.weatherService === 1 && (
                  <>
                    <RowSep />
                    <TextInputRow
                      label="Weather Underground API key"
                      description="Your personal API key from weatherunderground.com"
                      value={settings.wuApiKey}
                      onChange={(v) => setSettings({ ...settings, wuApiKey: v })}
                      placeholder="e.g. a1b2c3d4e5f6a1b2"
                    />
                  </>
                )}
                <RowSep />
                <CustomLocationRow
                  value={settings.customLocation}
                  onChange={(v) => setSettings({ ...settings, customLocation: v })}
                />
              </Section>

              <Section title="SUNRISE & SUNSET MARKERS">
                <p className="text-xs text-muted-foreground px-1 mb-3">Sunrise and sunset will show as a larger minute marker at their clock position.</p>
                <SelectRow
                  label="Sunrise/sunset markers"
                  value={settings.sunriseMarkerVisible}
                  options={[
                    { value: 0, label: "Always" },
                    { value: 1, label: "Show with weather icons" },
                    { value: 2, label: "Off" },
                  ]}
                  onChange={(v) => setSettings({ ...settings, sunriseMarkerVisible: v })}
                />
                {settings.sunriseMarkerVisible !== 2 && (
                  <>
                    <RowSep />
                    <ColorPickerRow
                      label="Sunrise marker colour"
                      description="Colour of the sunrise minute marker"
                      value={settings.sunriseMarkerColor}
                      onChange={(v) => setSettings({ ...settings, sunriseMarkerColor: v })}
                    />
                    <RowSep />
                    <ColorPickerRow
                      label="Sunset marker colour"
                      description="Colour of the sunset minute marker"
                      value={settings.sunsetMarkerColor}
                      onChange={(v) => setSettings({ ...settings, sunsetMarkerColor: v })}
                    />
                  </>
                )}
              </Section>

              <Section title="COMPLICATION">
                <SelectRow
                  label="Show date"
                  value={settings.dateVisible}
                  options={[
                    { value: 0, label: "Always" },
                    { value: 1, label: "Never" },
                    { value: 2, label: "On shake" },
                  ]}
                  onChange={(v) => setSettings({ ...settings, dateVisible: v })}
                />
                <RowSep />
                <ColorPickerRow
                  label="Date colour"
                  description="Colour of date text"
                  value={settings.dateColor}
                  onChange={(v) => setSettings({ ...settings, dateColor: v })}
                />
                <RowSep />
                <SelectRow
                  label="Show temperature"
                  value={settings.tempVisible}
                  options={[
                    { value: 0, label: "Always" },
                    { value: 1, label: "Never" },
                    { value: 2, label: "On shake" },
                  ]}
                  onChange={(v) => setSettings({ ...settings, tempVisible: v })}
                />
                <RowSep />
                <ColorPickerRow
                  label="Temperature colour"
                  description="Colour of temperature text"
                  value={settings.tempColor}
                  onChange={(v) => setSettings({ ...settings, tempColor: v })}
                />
                <RowSep />
                <SelectRow
                  label="Temperature unit"
                  value={settings.tempUnit}
                  options={[
                    { value: 0, label: "Celsius (°C)" },
                    { value: 1, label: "Fahrenheit (°F)" },
                  ]}
                  onChange={(v) => setSettings({ ...settings, tempUnit: v })}
                />
              </Section>
            </>
          )}

          {activeTab === "alerts" && (
            <>
              <Section title="BLUETOOTH DISCONNECT">
                <ToggleRow
                  label="Change hand colours on disconnect"
                  description="Minute hand changes colour when phone disconnects"
                  checked={settings.btDisconnectMinInnerRed}
                  onChange={(v) => setSettings({ ...settings, btDisconnectMinInnerRed: v })}
                />
                {settings.btDisconnectMinInnerRed && (
                  <>
                    <RowSep />
                    <ColorPickerRow
                      label="Minute hand outer colour"
                      description="Colour of minute hand body when disconnected"
                      value={settings.btDisconnectOuterColor}
                      onChange={(v) => setSettings({ ...settings, btDisconnectOuterColor: v })}
                    />
                    <RowSep />
                    <ColorPickerRow
                      label="Minute hand inner stripe"
                      description="Colour of minute hand stripe when disconnected"
                      value={settings.btDisconnectInnerColor}
                      onChange={(v) => setSettings({ ...settings, btDisconnectInnerColor: v })}
                    />
                  </>
                )}
                <RowSep />
                <ToggleRow
                  label="Vibrate on disconnect"
                  description="Buzz when phone disconnects"
                  checked={settings.vibrateBtDisconnect}
                  onChange={(v) => setSettings({ ...settings, vibrateBtDisconnect: v })}
                />
              </Section>

              <Section title="CENTRE CAP — BATTERY">
                <ToggleRow
                  label="Battery indicator"
                  description="Show battery status on center cap (red when low)"
                  checked={settings.batteryIndicatorEnabled}
                  onChange={(v) => setSettings({ ...settings, batteryIndicatorEnabled: v })}
                />
                {settings.batteryIndicatorEnabled && (
                  <>
                    <RowSep />
                    <ColorPickerRow
                      label="50%–20% alert colour"
                      description="Battery ring colour when battery is between 50% and 20%"
                      value={settings.centerDot50Color}
                      onChange={(v) => setSettings({ ...settings, centerDot50Color: v })}
                    />
                    <RowSep />
                    <ColorPickerRow
                      label="<20% alert colour"
                      description="All centre cap elements turn this colour when battery drops below 20%"
                      value={settings.centerDot20Color}
                      onChange={(v) => setSettings({ ...settings, centerDot20Color: v, middleRing20Color: v })}
                    />
                  </>
                )}
              </Section>

              {/* Test buttons */}
              <div className="mt-6 space-y-3">
                <p className="text-xs text-muted-foreground px-1">Preview alerts on the watch for 5 seconds</p>
                <Button
                  variant="outline"
                  className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10 active:scale-[0.97] transition-transform"
                  onClick={() => {
                    window.location.href = getReturnTo() + encodeURIComponent(JSON.stringify({ KEY_TEST_BATTERY_50: 1 }));
                  }}
                >
                  Test battery 50%–20% alert (5s)
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 active:scale-[0.97] transition-transform"
                  onClick={() => {
                    window.location.href = getReturnTo() + encodeURIComponent(JSON.stringify({ KEY_TEST_BATTERY_ALERT: 1 }));
                  }}
                >
                  Test battery &lt;20% alert (5s)
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 active:scale-[0.97] transition-transform"
                  onClick={() => {
                    window.location.href = getReturnTo() + encodeURIComponent(JSON.stringify({ KEY_TEST_BT_DISCONNECT: 1 }));
                  }}
                >
                  Test Bluetooth disconnect (5s)
                </Button>
              </div>

              {/* Reset buttons */}
              <div className="mt-6 space-y-2">
                <p className="text-xs text-muted-foreground px-1">Reset settings to factory defaults</p>
                <Button
                  variant="outline"
                  className="w-full border-teal-500/50 text-teal-400 hover:bg-teal-500/10 active:scale-[0.97] transition-transform"
                  onClick={handleResetColors}
                >
                  Reset colours only
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs border-slate-600 text-slate-400 hover:bg-slate-700/50 active:scale-[0.97] transition-transform"
                  onClick={handleResetAll}
                >
                  Reset ALL settings
                </Button>
              </div>
            </>
          )}
        </div>



        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <Button onClick={() => window.history.back()} variant="ghost" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTS
// ============================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-400">{title}</h3>
      {children}
    </div>
  );
}

function RowSep() {
  return <Separator className="my-2" />;
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function SelectRow({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string;
  description?: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full mt-2 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-foreground"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextInputRow({
  label,
  description,
  value,
  onChange,
  placeholder = 'City or coordinates',
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 bg-slate-700 border-slate-600"
        placeholder={placeholder}
      />
    </div>
  );
}

function ColorPickerRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded cursor-pointer border border-slate-600 outline outline-1 outline-white"
        />
        <span className="text-xs font-mono text-muted-foreground w-20 text-right">{value.toUpperCase()}</span>
      </div>
    </div>
  );
}

function FontPickerRow({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const fonts = [
    { value: 0, label: "LECO 28 Light" },
    { value: 1, label: "Bitham 34 Tall Bold" },
    { value: 2, label: "Bitham 42 Bold" },
    { value: 3, label: "Roboto Condensed 21" },
    { value: 4, label: "LECO 42 Bold" },
    { value: 5, label: "Bitham 28 Thin" },
  ];
  return (
    <div>
      <Label className="text-sm font-medium">Number font</Label>
      <p className="text-xs text-muted-foreground mt-1">Style of 1–12 hour numbers on the dial</p>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full mt-2 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-foreground"
      >
        {fonts.map((font) => (
          <option key={font.value} value={font.value}>
            {font.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function hexToRgb(hex: string): number {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 0;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return (r << 16) | (g << 8) | b;
}

function rgbToHex(rgb: number): string {
  if (rgb === -1) return "transparent";
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function CustomLocationRow({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [gpsPlaceholder, setGpsPlaceholder] = useState('City or coordinates');

  const handleGps = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.village || addr.county || '';
          const postcode = addr.postcode || '';
          const country = addr.country || '';
          const parts = [city, postcode, country].filter(Boolean);
          const location = parts.join(', ');
          onChange(location);  // Set the input value
          setGpsPlaceholder(location);
          toast.success(`GPS location confirmed: ${location}`);
        } catch {
          toast.error('Failed to reverse geocode location');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Location permission denied');
        } else {
          toast.error('Failed to get GPS location');
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div>
      <Label className="text-sm font-medium">Location</Label>
      <p className="text-xs text-muted-foreground mt-1">City name or coordinates (use GPS button to auto-detect)</p>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 bg-slate-700 border-slate-600"
        placeholder={gpsPlaceholder}
      />
      <div className="mt-2">
        <Button
          variant="outline"
          className="w-full border-teal-500/50 text-teal-400 hover:bg-teal-500/10 active:scale-[0.97] transition-transform"
          onClick={handleGps}
          disabled={loading}
        >
          {loading ? 'Getting location…' : '📍 Confirm GPS location'}
        </Button>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    Pebble?: {
      sendAppMessage: (data: Record<string, number | boolean>, onSuccess?: () => void) => void;
    };
  }
}
