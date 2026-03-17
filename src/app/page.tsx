"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type StatusType = "student" | "worker";

type FieldName =
  | "fullName"
  | "countryOfOrigin"
  | "spokenLanguage"
  | "phoneNumber"
  | "email"
  | "university"
  | "department";

type TouchedState = Record<FieldName, boolean>;

const EMPTY_TOUCHED: TouchedState = {
  fullName: false,
  countryOfOrigin: false,
  spokenLanguage: false,
  phoneNumber: false,
  email: false,
  university: false,
  department: false,
};

export default function Page() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [spokenLanguage, setSpokenLanguage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsAppPreferred, setWhatsAppPreferred] = useState(true);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<StatusType>("student");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [touched, setTouched] = useState<TouchedState>(EMPTY_TOUCHED);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem("landingStep1");
    window.localStorage.removeItem("landingStep2");
    window.localStorage.removeItem("landingStep3");

    setFullName("");
    setCountryOfOrigin("");
    setSpokenLanguage("");
    setPhoneNumber("");
    setWhatsAppPreferred(true);
    setEmail("");
    setStatus("student");
    setUniversity("");
    setDepartment("");
    setShowErrors(false);
    setTouched(EMPTY_TOUCHED);
  }, []);

  const isStudent = status === "student";

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<FieldName, string>> = {};

    if (fullName.trim().length < 2) nextErrors.fullName = "Full name is required.";
    if (countryOfOrigin.trim().length < 2) nextErrors.countryOfOrigin = "Country of origin is required.";
    if (spokenLanguage.trim().length < 2) nextErrors.spokenLanguage = "Spoken language is required.";
    if (phoneNumber.trim().length < 6) nextErrors.phoneNumber = "Phone number is required.";

    if (email.trim().length < 6) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (isStudent) {
      if (university.trim().length < 2) nextErrors.university = "University is required for students.";
      if (department.trim().length < 2) nextErrors.department = "Department is required for students.";
    }

    return nextErrors;
  }, [
    fullName,
    countryOfOrigin,
    spokenLanguage,
    phoneNumber,
    email,
    isStudent,
    university,
    department,
  ]);

  const isFormValid = Object.keys(errors).length === 0;

  function markTouched(field: FieldName) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function shouldShowError(field: FieldName) {
    return Boolean(errors[field]) && (touched[field] || showErrors);
  }

  function handleContinue() {
    setShowErrors(true);

    setTouched({
      fullName: true,
      countryOfOrigin: true,
      spokenLanguage: true,
      phoneNumber: true,
      email: true,
      university: true,
      department: true,
    });

    if (!isFormValid) return;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "landingStep1",
        JSON.stringify({
          fullName,
          countryOfOrigin,
          spokenLanguage,
          phoneNumber,
          whatsAppPreferred,
          email,
          status,
          university,
          department,
        })
      );
    }

    router.push("/step2");
  }

  return (
    <main className="min-h-[100dvh] bg-[#e7e7e7] px-3 py-4 text-white">
      <section className="mx-auto w-full max-w-[430px]">
        <div className="overflow-hidden rounded-[42px] bg-[#050505] shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
          <div className="relative px-5 pt-5 pb-6">
            <div className="relative z-10 flex justify-end">
              <button
                type="button"
                aria-label="English language"
                className="inline-flex h-[58px] min-w-[58px] items-center justify-center rounded-[18px] border border-white/20 bg-black/15 px-4 text-[15px] font-semibold text-white backdrop-blur-sm"
              >
                EN
              </button>
            </div>

            <div className="relative z-10 mt-4 overflow-hidden rounded-[30px]">
              <div className="relative h-[430px] w-full">
                <img
                  src="/debrecen-university-night.jpg"
                  alt="Debrecen University at night"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/8 to-black/30" />
                <div className="absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-t from-black/82 via-black/38 to-transparent" />

                <div className="absolute inset-x-5 bottom-8">
                  <h1 className="max-w-[320px] text-[37px] font-semibold leading-[1.02] tracking-[-0.045em] text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.34)]">
                    Find your apartment in Debrecen
                  </h1>

                  <p className="mt-4 text-[15px] leading-6 text-white/84">
                    For international tenants
                  </p>
                </div>
              </div>
            </div>

            <section className="relative z-20 -mt-8 rounded-[30px] border border-white/14 bg-black/62 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl">
              <div className="mb-5">
                <h2 className="text-[18px] font-semibold text-white">
                  Quick request
                </h2>
                <p className="mt-2 text-[15px] leading-6 text-white/72">
                  Fill in your details and continue
                </p>
              </div>

              <form
                className="space-y-3.5"
                autoComplete="off"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleContinue();
                }}
              >
                <InputOnly
                  placeholder="Full name *"
                  value={fullName}
                  onChange={setFullName}
                  onBlur={() => markTouched("fullName")}
                  type="text"
                  hasError={shouldShowError("fullName")}
                  errorText={errors.fullName}
                />

                <InputOnly
                  placeholder="Country of origin *"
                  value={countryOfOrigin}
                  onChange={setCountryOfOrigin}
                  onBlur={() => markTouched("countryOfOrigin")}
                  type="text"
                  hasError={shouldShowError("countryOfOrigin")}
                  errorText={errors.countryOfOrigin}
                />

                <InputOnly
                  placeholder="Spoken language *"
                  value={spokenLanguage}
                  onChange={setSpokenLanguage}
                  onBlur={() => markTouched("spokenLanguage")}
                  type="text"
                  hasError={shouldShowError("spokenLanguage")}
                  errorText={errors.spokenLanguage}
                />

                <InputOnly
                  placeholder="Phone number (WhatsApp) *"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  onBlur={() => markTouched("phoneNumber")}
                  type="tel"
                  hasError={shouldShowError("phoneNumber")}
                  errorText={errors.phoneNumber}
                />

                <label className="flex cursor-pointer items-center gap-3 px-1 py-1">
                  <input
                    checked={whatsAppPreferred}
                    onChange={(e) => setWhatsAppPreferred(e.target.checked)}
                    type="checkbox"
                    className="h-5 w-5 accent-green-500"
                  />
                  <span className="text-[15px] text-white/96">
                    WhatsApp preferred contact
                  </span>
                </label>

                <InputOnly
                  placeholder="Email address *"
                  value={email}
                  onChange={setEmail}
                  onBlur={() => markTouched("email")}
                  type="email"
                  hasError={shouldShowError("email")}
                  errorText={errors.email}
                />

                <div className="grid grid-cols-2 gap-2 rounded-full border border-white/14 bg-black/32 p-1">
                  <button
                    type="button"
                    onClick={() => setStatus("student")}
                    className={[
                      "h-12 rounded-full text-[15px] font-semibold transition",
                      status === "student"
                        ? "bg-white text-black shadow-[0_8px_18px_rgba(255,255,255,0.12)]"
                        : "text-white/80",
                    ].join(" ")}
                  >
                    Student
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("worker")}
                    className={[
                      "h-12 rounded-full text-[15px] font-semibold transition",
                      status === "worker"
                        ? "bg-white text-black shadow-[0_8px_18px_rgba(255,255,255,0.12)]"
                        : "text-white/80",
                    ].join(" ")}
                  >
                    Worker
                  </button>
                </div>

                {isStudent ? (
                  <>
                    <InputOnly
                      placeholder="e.g. University of Debrecen *"
                      value={university}
                      onChange={setUniversity}
                      onBlur={() => markTouched("university")}
                      type="text"
                      hasError={shouldShowError("university")}
                      errorText={errors.university}
                    />

                    <InputOnly
                      placeholder="e.g. Faculty of Medicine *"
                      value={department}
                      onChange={setDepartment}
                      onBlur={() => markTouched("department")}
                      type="text"
                      hasError={shouldShowError("department")}
                      errorText={errors.department}
                    />
                  </>
                ) : null}

                {showErrors && !isFormValid ? (
                  <div className="rounded-[18px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-200">
                    Please fill in all required fields.
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={[
                    "mt-2 flex h-[60px] w-full items-center justify-center rounded-[24px] text-[15px] font-semibold uppercase tracking-[0.16em] transition",
                    isFormValid
                      ? "bg-gradient-to-r from-[#74cbbd] via-[#8fd08d] to-[#d8dd72] text-black shadow-[0_14px_36px_rgba(141,216,145,0.24)] active:scale-[0.99]"
                      : "bg-white/15 text-white/35",
                  ].join(" ")}
                >
                  Continue <span className="ml-2 text-[18px]">→</span>
                </button>
              </form>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function InputOnly({
  placeholder,
  value,
  onChange,
  onBlur,
  type,
  hasError,
  errorText,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  type: string;
  hasError?: boolean;
  errorText?: string;
}) {
  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        type={type}
        autoComplete="off"
        placeholder={placeholder}
        className={[
          "h-14 w-full rounded-[22px] px-4 text-[17px] font-medium text-white placeholder:text-white/72 placeholder:font-medium outline-none transition",
          hasError
            ? "border border-red-400/70 bg-red-500/10 focus:border-red-300"
            : "border border-white/18 bg-black/52 focus:border-white/30 focus:bg-black/60",
        ].join(" ")}
      />
      {hasError ? (
        <p className="mt-2 px-1 text-[12px] text-red-300">{errorText}</p>
      ) : null}
    </div>
  );
}
