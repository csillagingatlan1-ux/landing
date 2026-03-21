"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Step1Data = {
  status?: "student" | "worker";
};

type Step2Data = {
  livingWith: string;
  smoking: boolean;
  pet: boolean;
  moveInDate: string;
  duration: string;
  property: string;
  locations: string[];
  roomsNeeded: string;
  colleaguesCount: string;
};

const STEP1_STORAGE_KEY = "landingStep1";
const STEP2_STORAGE_KEY = "landingStep2";

function formatDateForStorage(date: Date | null) {
  if (!date) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function parseStoredDate(value: string) {
  if (!value) return null;

  if (/^\d{4}\.\d{2}\.\d{2}$/.test(value)) {
    const [y, m, d] = value.split(".").map(Number);
    return new Date(y, m - 1, d);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function Page() {
  const router = useRouter();

  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  const [livingWith, setLivingWith] = useState("");
  const [smoking, setSmoking] = useState(false);
  const [pet, setPet] = useState(false);
  const [moveInDate, setMoveInDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [duration, setDuration] = useState("");
  const [property, setProperty] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [roomsNeeded, setRoomsNeeded] = useState("");
  const [colleaguesCount, setColleaguesCount] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const step1Raw = window.localStorage.getItem(STEP1_STORAGE_KEY);
    const step2Raw = window.localStorage.getItem(STEP2_STORAGE_KEY);

    try {
      if (step1Raw) {
        const parsed = JSON.parse(step1Raw) as Step1Data;
        setStep1Data(parsed);
      }

      if (step2Raw) {
        const parsed = JSON.parse(step2Raw) as Partial<Step2Data>;
        setLivingWith(parsed.livingWith ?? "");
        setSmoking(parsed.smoking ?? false);
        setPet(parsed.pet ?? false);
        setMoveInDate(parseStoredDate(parsed.moveInDate ?? ""));
        setDuration(parsed.duration ?? "");
        setProperty(parsed.property ?? "");
        setLocations(parsed.locations ?? []);
        setRoomsNeeded(parsed.roomsNeeded ?? "");
        setColleaguesCount(parsed.colleaguesCount ?? "");
      }
    } catch {
      window.localStorage.removeItem(STEP2_STORAGE_KEY);
    }
  }, []);

  const isWorker = step1Data?.status === "worker";

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const toggleLocation = (location: string) => {
    setLocations((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location]
    );
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "Select date";
    return formatDateForStorage(date);
  };

  const isSameDay = (a: Date | null, b: Date | null) => {
    if (!a || !b) return false;

    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const isBeforeToday = (date: Date) => {
    return date.getTime() < today.getTime();
  };

  const getCalendarDays = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<Date | null> = [];

    for (let i = 0; i < startDay; i += 1) days.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) days.push(new Date(year, month, day));
    while (days.length % 7 !== 0) days.push(null);

    return days;
  };

  const calendarDays = getCalendarDays(calendarMonth);

  const monthLabel = calendarMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const goToPreviousMonth = () => {
    const prevMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() - 1,
      1
    );

    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    if (prevMonth < minMonth) return;
    setCalendarMonth(prevMonth);
  };

  const goToNextMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
    );
  };

  const handleSelectDate = (date: Date) => {
    if (isBeforeToday(date)) return;
    setMoveInDate(date);
    setIsCalendarOpen(false);
  };

  const handleContinue = () => {
    if (typeof window !== "undefined") {
      const payload: Step2Data = {
        livingWith,
        smoking,
        pet,
        moveInDate: formatDateForStorage(moveInDate),
        duration,
        property,
        locations,
        roomsNeeded,
        colleaguesCount,
      };

      window.localStorage.setItem(STEP2_STORAGE_KEY, JSON.stringify(payload));
    }

    router.push("/step3");
  };

  return (
    <>
      <main className="min-h-[100dvh] bg-[#0b0b0b] px-4 py-4 text-white">
        <section className="mx-auto w-full max-w-[430px]">
          <div className="overflow-hidden rounded-[38px] border border-white/8 bg-[#070707] shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
            <div className="px-5 pt-5 pb-6">
              <div className="mb-7 mt-8 text-center">
                <h1 className="text-[29px] font-semibold tracking-[-0.03em] text-white">
                  Your preferences
                </h1>
                <p className="mt-2 text-[16px] text-white/70">
                  Help us find you the perfect place
                </p>
                <div className="mx-auto mt-5 h-[3px] w-28 rounded-full bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72]" />
              </div>

              <section className="rounded-[30px] border border-white/20 bg-white/[0.05] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="space-y-7">
                  <div>
                    <h2 className="mb-3 text-[18px] font-semibold text-white">
                      Who would you live with?
                    </h2>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Alone", icon: "👤" },
                        { label: "Relative / Friend", icon: "👥" },
                        { label: "Doesn't matter", icon: "✨" },
                      ].map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => setLivingWith(option.label)}
                          className={[
                            "min-h-[92px] rounded-[24px] border px-3 py-4 transition-all duration-200 hover:-translate-y-[1px]",
                            livingWith === option.label
                              ? "border-transparent bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72] text-black shadow-[0_18px_40px_rgba(141,216,145,0.28),0_0_0_1px_rgba(255,255,255,0.08)]"
                              : "border-white/22 bg-white/10 text-white/92 hover:bg-white/12",
                          ].join(" ")}
                        >
                          <div className="mb-2 text-[20px]">{option.icon}</div>
                          <div className="text-[14px] font-medium leading-5">
                            {option.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <ToggleCard
                      label="Smoking"
                      value={smoking}
                      onClick={() => setSmoking((prev) => !prev)}
                    />

                    <ToggleCard
                      label="Pet"
                      value={pet}
                      onClick={() => setPet((prev) => !prev)}
                    />
                  </div>

                  <div>
                    <h2 className="mb-3 text-[18px] font-semibold text-white">
                      From when?
                    </h2>

                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(true)}
                      className="flex h-[60px] w-full items-center justify-between rounded-[24px] border border-white/22 bg-white/12 px-4 text-left text-[16px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-200 hover:bg-white/14"
                    >
                      <span className="text-white/92">
                        {formatDisplayDate(moveInDate)}
                      </span>
                      <span className="text-[22px] text-white/40">›</span>
                    </button>
                  </div>

                  <div>
                    <h2 className="mb-3 text-[18px] font-semibold text-white">
                      How long?
                    </h2>

                    <div className="grid grid-cols-3 gap-3">
                      {["12 months", "2 years", "3 years", "4 years", "5 years"].map(
                        (option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setDuration(option)}
                            className={[
                              "h-[54px] rounded-[22px] border px-3 text-[14px] font-medium transition-all duration-200 hover:-translate-y-[1px]",
                              duration === option
                                ? "border-transparent bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72] text-black shadow-[0_18px_40px_rgba(141,216,145,0.28),0_0_0_1px_rgba(255,255,255,0.08)]"
                                : "border-white/22 bg-white/10 text-white/92 hover:bg-white/12",
                            ].join(" ")}
                          >
                            {option}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-3 text-[18px] font-semibold text-white">
                      What are you looking for?
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                      {["Apartment", "House"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setProperty(option)}
                          className={[
                            "h-[56px] rounded-[24px] border px-4 text-[16px] font-medium transition-all duration-200 hover:-translate-y-[1px]",
                            property === option
                              ? "border-transparent bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72] text-black shadow-[0_18px_40px_rgba(141,216,145,0.28),0_0_0_1px_rgba(255,255,255,0.08)]"
                              : "border-white/22 bg-white/10 text-white/92 hover:bg-white/12",
                          ].join(" ")}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-3 text-[18px] font-semibold text-white">
                      Location
                    </h2>

                    <p className="mb-3 text-[14px] text-white/68">
                      Choose multiple
                    </p>

                    <div className="flex flex-wrap gap-2.5">
                      {[
                        "University Area",
                        "Downtown",
                        "Along public transport routes",
                        "Near railway station",
                        "Near airport",
                        "Near highway",
                      ].map((location) => (
                        <button
                          key={location}
                          type="button"
                          onClick={() => toggleLocation(location)}
                          className={[
                            "rounded-full border px-4 py-2.5 text-[14px] font-medium transition-all duration-200 hover:-translate-y-[1px]",
                            locations.includes(location)
                              ? "border-transparent bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72] text-black shadow-[0_14px_30px_rgba(141,216,145,0.24),0_0_0_1px_rgba(255,255,255,0.06)]"
                              : "border-white/22 bg-white/10 text-white/92 hover:bg-white/12",
                          ].join(" ")}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-3 text-[18px] font-semibold text-white">
                      Rooms needed
                    </h2>

                    <select
                      value={roomsNeeded}
                      onChange={(e) => setRoomsNeeded(e.target.value)}
                      className="h-[56px] w-full rounded-[24px] border border-white/22 bg-white/12 px-4 text-[16px] text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] focus:border-white/40 focus:bg-white/14 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_30px_rgba(0,0,0,0.35)]"
                    >
                      <option value="" className="bg-[#111] text-white">
                        Select number of rooms
                      </option>
                      <option value="1" className="bg-[#111] text-white">1</option>
                      <option value="2" className="bg-[#111] text-white">2</option>
                      <option value="3" className="bg-[#111] text-white">3</option>
                      <option value="4" className="bg-[#111] text-white">4</option>
                    </select>
                  </div>

                  {isWorker ? (
                    <div>
                      <h2 className="mb-3 text-[18px] font-semibold text-white">
                        Colleagues count
                      </h2>

                      <select
                        value={colleaguesCount}
                        onChange={(e) => setColleaguesCount(e.target.value)}
                        className="h-[56px] w-full rounded-[24px] border border-white/22 bg-white/12 px-4 text-[16px] text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] focus:border-white/40 focus:bg-white/14 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_30px_rgba(0,0,0,0.35)]"
                      >
                        <option value="" className="bg-[#111] text-white">
                          Select number of colleagues
                        </option>
                        {Array.from({ length: 10 }, (_, index) => String(index + 1)).map(
                          (count) => (
                            <option key={count} value={count} className="bg-[#111] text-white">
                              {count}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  ) : null}
                </div>
              </section>

              <div className="sticky bottom-[max(12px,env(safe-area-inset-bottom))] mt-6 rounded-[28px] border border-white/20 bg-[rgba(10,10,10,0.86)] p-4 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.28)]">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="flex h-[58px] items-center justify-center rounded-[24px] border border-white/22 bg-white/10 text-[16px] font-medium text-white transition-all duration-200 hover:bg-white/14"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="flex h-[58px] items-center justify-center rounded-[24px] bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72] text-[16px] font-semibold text-black transition-all duration-200 hover:brightness-105 active:scale-[0.99] shadow-[0_18px_40px_rgba(141,216,145,0.28)]"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div
        className={[
          "fixed inset-0 z-40 bg-black/55 transition",
          isCalendarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setIsCalendarOpen(false)}
      />

      <div
        className={[
          "fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] rounded-t-[30px] border border-white/20 bg-[#141414] p-5 shadow-[0_-20px_60px_rgba(0,0,0,0.45)] transition-transform duration-300",
          isCalendarOpen ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/14" />

        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/24 bg-white/14 text-white/92 transition hover:bg-white/18"
          >
            ←
          </button>

          <div className="text-[16px] font-semibold text-white">{monthLabel}</div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/24 bg-white/14 text-white/92 transition hover:bg-white/18"
          >
            →
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.14em] text-white/56">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} className="h-10 rounded-full" />;

            const isSelected = isSameDay(date, moveInDate);
            const disabled = isBeforeToday(date);
            const isToday = isSameDay(date, today);

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => handleSelectDate(date)}
                className={[
                  "h-10 rounded-full text-[14px] font-medium transition",
                  disabled
                    ? "cursor-not-allowed text-white/18"
                    : isSelected
                    ? "bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72] text-black shadow-[0_10px_26px_rgba(141,216,145,0.18)]"
                    : isToday
                    ? "border border-[#d8dd72]/60 bg-white/16 text-white"
                    : "bg-white/14 text-white/92 hover:bg-white/18",
                ].join(" ")}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setMoveInDate(null);
              setIsCalendarOpen(false);
            }}
            className="flex h-[52px] items-center justify-center rounded-[20px] border border-white/24 bg-white/14 text-[14px] font-medium text-white/92 transition hover:bg-white/18"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => setIsCalendarOpen(false)}
            className="flex h-[52px] items-center justify-center rounded-[20px] bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72] text-[14px] font-semibold text-black shadow-[0_10px_26px_rgba(141,216,145,0.18)]"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

function ToggleCard({
  label,
  value,
  onClick,
}: {
  label: string;
  value: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-[60px] items-center justify-between rounded-[24px] border px-4 transition-all duration-200 hover:-translate-y-[1px]",
        value
          ? "border-transparent bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72] text-black shadow-[0_18px_40px_rgba(141,216,145,0.28),0_0_0_1px_rgba(255,255,255,0.08)]"
          : "border-white/22 bg-white/10 text-white/92 hover:bg-white/12",
      ].join(" ")}
    >
      <span className="text-[16px] font-medium">{label}</span>

      <span
        className={[
          "relative h-7 w-12 rounded-full transition-all duration-200",
          value ? "bg-black/20" : "bg-white/20",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-[2px] h-6 w-6 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.22)] transition-all duration-200",
            value ? "left-[22px]" : "left-[2px]",
          ].join(" ")}
        />
      </span>
    </button>
  );
}
