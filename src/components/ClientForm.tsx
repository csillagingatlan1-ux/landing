"use client";

import { useMemo, useState } from "react";

type FormData = {
  fullName: string;
  originCountry: string;
  hasEnglish: boolean;
  otherLanguage: string;
  phone: string;
  isWhatsappNumber: boolean;
  email: string;
  status: "Student" | "Worker" | "";
  institution: string;
  department: string;
};

const initialForm: FormData = {
  fullName: "",
  originCountry: "",
  hasEnglish: true,
  otherLanguage: "",
  phone: "",
  isWhatsappNumber: false,
  email: "",
  status: "",
  institution: "",
  department: "",
};

export default function ClientForm() {
  const [form, setForm] = useState<FormData>(initialForm);

  function patch<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const canContinue = useMemo(() => {
    const baseValid =
      form.fullName.trim() &&
      form.originCountry.trim() &&
      form.phone.trim() &&
      form.email.trim() &&
      form.status;

    if (!baseValid) {
      return false;
    }

    if (form.status === "Student") {
      return form.institution.trim() && form.department.trim();
    }

    return true;
  }, [form]);

  return (
    <div className="card form-card">
      <span className="step-badge">1 / 3</span>
      <h2 className="step-title">Your details</h2>
      <p className="step-subtitle">Simple first step. Only the most important details.</p>

      <div className="section">
        <label className="label">Full name</label>
        <input
          className="input"
          value={form.fullName}
          onChange={(e) => patch("fullName", e.target.value)}
          placeholder="Your full name"
        />
      </div>

      <div className="section">
        <label className="label">Country of origin</label>
        <input
          className="input"
          value={form.originCountry}
          onChange={(e) => patch("originCountry", e.target.value)}
          placeholder="Your country"
        />
      </div>

      <div className="section">
        <label className="label">Spoken language</label>
        <div className="inline-row">
          <button
            type="button"
            className={`chip ${form.hasEnglish ? "active" : ""}`}
            onClick={() => patch("hasEnglish", !form.hasEnglish)}
          >
            EN
          </button>
        </div>
        <div style={{ marginTop: 10 }}>
          <input
            className="input"
            value={form.otherLanguage}
            onChange={(e) => patch("otherLanguage", e.target.value)}
            placeholder="Other language"
          />
        </div>
      </div>

      <div className="section">
        <label className="label">Phone number</label>
        <div className="phone-row">
          <input
            className="input"
            value={form.phone}
            onChange={(e) => patch("phone", e.target.value)}
            placeholder="+36 ..."
          />
          <button
            type="button"
            className={`icon-toggle ${form.isWhatsappNumber ? "active" : ""}`}
            onClick={() => patch("isWhatsappNumber", !form.isWhatsappNumber)}
            title="WhatsApp number"
            aria-label="WhatsApp number"
          >
            ??
          </button>
        </div>
        <div className="helper">Tap the icon if this phone number is also your WhatsApp number.</div>
      </div>

      <div className="section">
        <label className="label">Email address</label>
        <input
          className="input"
          value={form.email}
          onChange={(e) => patch("email", e.target.value)}
          placeholder="name@email.com"
        />
      </div>

      <div className="section">
        <label className="label">I am</label>
        <div className="grid-2">
          <button
            type="button"
            className={`choice ${form.status === "Student" ? "active" : ""}`}
            onClick={() => patch("status", "Student")}
          >
            ?? Student
          </button>
          <button
            type="button"
            className={`choice ${form.status === "Worker" ? "active" : ""}`}
            onClick={() => {
              patch("status", "Worker");
              patch("institution", "");
              patch("department", "");
            }}
          >
            ?? Worker
          </button>
        </div>
      </div>

      {form.status === "Student" && (
        <>
          <div className="section">
            <label className="label">Institution name</label>
            <input
              className="input"
              value={form.institution}
              onChange={(e) => patch("institution", e.target.value)}
              placeholder="University / institution name"
            />
          </div>

          <div className="section">
            <label className="label">Department</label>
            <input
              className="input"
              value={form.department}
              onChange={(e) => patch("department", e.target.value)}
              placeholder="Department"
            />
          </div>
        </>
      )}

      <div className="review-box">
        <h3 className="review-title">Quick review</h3>
        <p className="review-line">Name: {form.fullName || "-"}</p>
        <p className="review-line">Country: {form.originCountry || "-"}</p>
        <p className="review-line">
          Language: {[
            form.hasEnglish ? "EN" : "",
            form.otherLanguage.trim()
          ].filter(Boolean).join(", ") || "-"}
        </p>
        <p className="review-line">Phone: {form.phone || "-"}</p>
        <p className="review-line">WhatsApp: {form.isWhatsappNumber ? "Yes" : "No"}</p>
        <p className="review-line">Email: {form.email || "-"}</p>
        <p className="review-line">Status: {form.status || "-"}</p>
        {form.status === "Student" && (
          <>
            <p className="review-line">Institution: {form.institution || "-"}</p>
            <p className="review-line">Department: {form.department || "-"}</p>
          </>
        )}
      </div>

      <div className="nav-row">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canContinue}
        >
          Next step later
        </button>
      </div>
    </div>
  );
}
