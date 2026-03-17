"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("landingStep1");
    localStorage.removeItem("landingStep2");
    localStorage.removeItem("landingStep3");
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-4 py-4 text-white">
      <section className="mx-auto w-full max-w-none md:max-w-none md:max-w-[430px]">
        <div className="overflow-hidden rounded-[38px] border border-white/8 bg-[#070707] shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
          <div className="px-5 pt-5 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex h-[58px] w-[172px] items-center justify-center rounded-[18px] bg-white px-4 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                
              </div>

              <button
                type="button"
                aria-label="English language"
                className="inline-flex h-[58px] min-w-[58px] items-center justify-center rounded-[18px] border border-white/14 bg-white/[0.03] px-4 text-[15px] font-semibold text-white backdrop-blur-sm"
              >
                EN
              </button>
            </div>

            <div className="mt-10 text-center">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72] text-[52px] font-bold text-black shadow-[0_24px_60px_rgba(141,216,145,0.22)]">
                ✓
              </div>

              <h1 className="mt-6 text-[34px] font-semibold tracking-[-0.03em] text-white">
                Request sent successfully
              </h1>

              <p className="mx-auto mt-4 max-w-[320px] text-[16px] leading-7 text-white/68">
                Your apartment request has been sent. We will contact you shortly
                on WhatsApp or email.
              </p>
            </div>

            <section className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-white">
                  STAR REAL ESTATE AGENCY
                </h2>
                <p className="mt-2 text-[22px] font-medium text-white/72">Debrecen</p>

                <a
                  href="mailto:csillagingatlan1@gmail.com"
                  rel="noreferrer"
                  className="mt-5 inline-block rounded-[14px] border border-white/12 bg-black/30 px-3 py-2 text-[18px] font-medium text-white underline underline-offset-4 transition hover:bg-white/10"
                >
                  csillagingatlan1@gmail.com
                </a>
              </div>

              <div className="mt-6 space-y-4 text-[15px] text-white/88">
                <ServiceRow text="English communication" />
                <ServiceRow text="Help with address card and residence permit processing" />
                <ServiceRow text="Remote photo / video viewing" />
                <ServiceRow text="Fast full-service process until apartment handover" />
              </div>
            </section>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => router.push("/step3")}
                className="flex h-[58px] items-center justify-center rounded-[24px] border border-white/10 bg-black/40 text-[15px] font-medium text-white"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex h-[58px] items-center justify-center rounded-[24px] bg-gradient-to-r from-[#6ad0c5] via-[#8fd08d] to-[#d8dd72] text-[15px] font-semibold text-black shadow-[0_16px_36px_rgba(141,216,145,0.24)]"
              >
                Main page
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ServiceRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-[2px] inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#8fd08d] text-[14px] font-bold text-black">
        ✓
      </span>
      <span className="flex-1 leading-6">{text}</span>
    </div>
  );
}






