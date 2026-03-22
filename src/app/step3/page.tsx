"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Step1Data = {
  fullName?: string;
  countryOfOrigin?: string;
  spokenLanguage?: string;
  phoneNumber?: string;
  whatsAppPreferred?: boolean;
  email?: string;
  status?: "student" | "worker";
  university?: string;
  department?: string;
};

type Step2Data = {
  livingWith?: string;
  smoking?: boolean;
  pet?: boolean;
  moveInDate?: string;
  duration?: string;
  property?: string;
  locations?: string[];
  roomsNeeded?: string;
  colleaguesCount?: string;
};

const STEP1_STORAGE_KEY = "landingStep1";
const STEP2_STORAGE_KEY = "landingStep2";
const STEP3_STORAGE_KEY = "landingStep3";
const FLOW_STARTED_AT_KEY = "landingFlowStartedAt";

export default function Page() {
  const router = useRouter();

  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);

  const [budgetHuf, setBudgetHuf] = useState("");
  const [eurRate, setEurRate] = useState<number>(399);
  const [rateDate, setRateDate] = useState("");
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [other, setOther] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const step1Raw = window.localStorage.getItem(STEP1_STORAGE_KEY);
    const step2Raw = window.localStorage.getItem(STEP2_STORAGE_KEY);
    const step3Raw = window.localStorage.getItem(STEP3_STORAGE_KEY);

    try {
      if (step1Raw) setStep1Data(JSON.parse(step1Raw) as Step1Data);
      if (step2Raw) setStep2Data(JSON.parse(step2Raw) as Step2Data);

      if (step3Raw) {
        const parsed = JSON.parse(step3Raw) as { budgetHuf?: string; other?: string };
        setBudgetHuf((parsed.budgetHuf ?? "").replace(/[^\d]/g, ""));
        setOther(parsed.other ?? "");
      }
    } catch {
      window.localStorage.removeItem(STEP3_STORAGE_KEY);
    }

    const startedAt = window.localStorage.getItem(FLOW_STARTED_AT_KEY);
    if (!startedAt) {
      window.localStorage.setItem(FLOW_STARTED_AT_KEY, String(Date.now()));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRate() {
      try {
        setIsLoadingRate(true);
        const res = await fetch("https://api.frankfurter.app/latest?from=EUR&to=HUF");
        const data = await res.json();

        const nextRate = data?.rates?.HUF;
        const nextDate = data?.date;

        if (!cancelled && typeof nextRate === "number") {
          setEurRate(nextRate);
          setRateDate(nextDate || "");
        }
      } catch {
      } finally {
        if (!cancelled) {
          setIsLoadingRate(false);
        }
      }
    }

    loadRate();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      STEP3_STORAGE_KEY,
      JSON.stringify({
        budgetHuf,
        other,
      })
    );
  }, [budgetHuf, other]);

  const numericBudgetHuf = useMemo(() => {
    const digits = budgetHuf.replace(/[^\d]/g, "");
    return digits ? Number(digits) : 0;
  }, [budgetHuf]);

  const estimatedEur = useMemo(() => {
    if (!numericBudgetHuf || !eurRate) return 0;
    return numericBudgetHuf / eurRate;
  }, [numericBudgetHuf, eurRate]);

  const formattedHuf = useMemo(() => {
    if (!budgetHuf) return "";
    const digits = budgetHuf.replace(/[^\d]/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("hu-HU");
  }, [budgetHuf]);

  const formattedEur = useMemo(() => {
    return estimatedEur.toLocaleString("hu-HU", {
      maximumFractionDigits: 0,
    });
  }, [estimatedEur]);

  const rateLabel = useMemo(() => {
    return `${eurRate.toFixed(2)} Ft / EUR`;
  }, [eurRate]);

  const handleBudgetChange = (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    setBudgetHuf(digits);
  };

  const handleSend = async () => {
    if (!step1Data || !step2Data) {
      alert("Missing form data. Please go back and complete the previous steps.");
      return;
    }

    setIsSending(true);

    const adminLines = [
      "Hello STAR REAL ESTATE AGENCY!",
      "",
      "Apartment request summary:",
      "",
      `Budget: ${formattedHuf || "0"} Ft`,
      `Estimated EUR: € ${formattedEur}`,
      `Exchange rate: ${rateLabel}`,
      "",
      `Name: ${step1Data.fullName || "-"}`,
      `Country: ${step1Data.countryOfOrigin || "-"}`,
      `Language: ${step1Data.spokenLanguage || "-"}`,
      `Phone: ${step1Data.phoneNumber || "-"}`,
      `Email: ${step1Data.email || "-"}`,
      `Status: ${step1Data.status || "-"}`,
      step1Data.status === "student"
        ? `University: ${step1Data.university || "-"}`
        : `University: -`,
      step1Data.status === "student"
        ? `Department: ${step1Data.department || "-"}`
        : `Department: -`,
      "",
      `Living with: ${step2Data.livingWith || "-"}`,
      `Smoking: ${step2Data.smoking ? "Yes" : "No"}`,
      `Pet: ${step2Data.pet ? "Yes" : "No"}`,
      `Move-in date: ${step2Data.moveInDate || "-"}`,
      `Duration: ${step2Data.duration || "-"}`,
      `Property type: ${step2Data.property || "-"}`,
      `Locations: ${step2Data.locations?.join(", ") || "-"}`,
      `Rooms needed: ${step2Data.roomsNeeded || "-"}`,
      `Number of colleagues: ${step2Data.colleaguesCount || "-"}`,
      "",
      `Other: ${other || "-"}`,
    ];

    try {
      const startedAtRaw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(FLOW_STARTED_AT_KEY)
          : null;

      const startedAt = startedAtRaw ? Number(startedAtRaw) : Date.now();
      const formTs = Math.max(1000, Date.now() - startedAt);

      const crmMessage = [
        `Source: debrecenrentals.com`,
        `Channel: landing`,
        ``,
        ...adminLines,
      ].join("\n");

      const emailRes = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminMessage: adminLines.join("\n"),
          customerEmail: step1Data.email || "",
          customerName: step1Data.fullName || "",
          crmLead: {
            consent: true,
            name: step1Data.fullName || "",
            email: step1Data.email || "",
            phone: step1Data.phoneNumber || "",
            message: crmMessage,
            companyWebsite: "",
            formTs,
          },
        }),
      });

      const emailJson = await emailRes.json();

      if (!emailRes.ok || !emailJson?.success) {
        console.error("Send failed:", emailJson);
        alert("A küldés nem sikerült. Ellenőrizd az email és CRM beállításokat.");
        setIsSending(false);
        return;
      }

      if (typeof window !== "undefined") {
        const whatsappText = encodeURIComponent(adminLines.join("\n"));
        const whatsappUrl = `https://wa.me/36304600201?text=${whatsappText}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");

        window.localStorage.removeItem(STEP1_STORAGE_KEY);
        window.localStorage.removeItem(STEP2_STORAGE_KEY);
        window.localStorage.removeItem(STEP3_STORAGE_KEY);
        window.localStorage.removeItem(FLOW_STARTED_AT_KEY);
      }

      router.push("/success");
    } catch (error) {
      console.error("Send failed:", error);
      alert("A küldés nem sikerült.");
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#0b0b0b] px-4 py-4 text-white">
      <section className="mx-auto w-full max-w-[430px]">
        <div className="overflow-hidden rounded-[38px] border border-white/8 bg-[#070707] shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
          <div className="px-5 pt-5 pb-6">
            <div className="mb-7 mt-8 text-center">
              <h1 className="text-[29px] font-semibold tracking-[-0.03em] text-white">
                Your preferences
              </h1>
              <p className="mt-2 text-[15px] text-white/70">Step 3 of 3</p>
              <div className="mx-auto mt-5 h-[3px] w-28 rounded-full bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72]" />
            </div>

            <section className="rounded-[30px] border border-white/20 bg-white/[0.05] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-3 text-[18px] font-semibold text-white">
                    Financial budget
                  </h2>

                  <div className="flex h-[62px] items-center rounded-[24px] border border-white/22 bg-white/12 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <span className="mr-3 text-[18px] text-white/78">Ft</span>
                    <input
                      value={formattedHuf}
                      onChange={(e) => handleBudgetChange(e.target.value)}
                      inputMode="numeric"
                      placeholder="350 000"
                      className="min-w-0 flex-1 bg-transparent text-[24px] font-semibold text-white placeholder:text-white/55 outline-none [font-size:16px] sm:[font-size:24px]"
                    />
                    <span className="ml-3 text-[18px] text-white/78">Ft</span>
                  </div>

                  <div className="mt-4">
                    <div className="text-[40px] font-semibold leading-none text-white">
                      € {formattedEur}
                    </div>

                    <div className="mt-2 text-[18px] font-medium text-white/86">
                      Exchange rate: {isLoadingRate ? "Loading..." : rateLabel}
                    </div>

                    {rateDate ? (
                      <div className="mt-1 text-[14px] text-white/50">
                        Updated: {rateDate}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-[18px] font-semibold text-white">
                    Other
                  </h2>

                  <textarea
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                    placeholder="Write here..."
                    rows={4}
                    className="w-full rounded-[24px] border border-white/22 bg-white/12 px-4 py-4 text-[16px] text-white placeholder:text-white/55 outline-none transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] focus:border-white/40 focus:bg-white/14 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_30px_rgba(0,0,0,0.35)]"
                  />
                </div>
              </div>
            </section>

            <div className="sticky bottom-[max(12px,env(safe-area-inset-bottom))] mt-6 rounded-[28px] border border-white/20 bg-[rgba(10,10,10,0.86)] p-4 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.28)]">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/step2")}
                  className="flex h-[58px] items-center justify-center rounded-[24px] border border-white/22 bg-white/10 text-[16px] font-medium text-white transition-all duration-200 hover:bg-white/14"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending}
                  className="flex h-[58px] items-center justify-center rounded-[24px] bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72] px-3 text-center text-[16px] font-semibold text-black transition-all duration-200 hover:brightness-105 active:scale-[0.99] shadow-[0_18px_40px_rgba(141,216,145,0.28)] disabled:opacity-60"
                >
                  {isSending ? "Sending..." : "Küldés"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
