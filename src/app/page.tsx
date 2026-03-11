"use client";

import { useState } from "react";

export default function Page() {

const [status,setStatus] = useState("student")

return (

<main className="min-h-screen bg-black text-white">

<section className="relative min-h-screen overflow-hidden">

{/* BACKGROUND IMAGE */}

<img
src="/debrecen-university-night.jpg"
alt="Debrecen University"
className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
/>

<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90" />


{/* CONTENT */}

<div className="relative z-10 mx-auto max-w-[420px] px-4 pt-4 pb-10 flex flex-col min-h-screen">

{/* HEADER */}

<div className="flex justify-between items-start">

<div className="bg-black/40 border border-white/10 rounded-2xl p-3 backdrop-blur">

<img
src="/star-logo.png"
alt="STAR Real Estate Agency"
className="h-16 w-auto object-contain"
/>

</div>

<button className="border border-white/20 bg-black/40 backdrop-blur px-4 py-2 rounded-xl text-sm font-semibold">
EN
</button>

</div>


{/* HERO TEXT */}

<div className="mt-12 max-w-[300px]">

<p className="inline-block text-xs tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full mb-3">
Apartments in Debrecen
</p>

<h1 className="text-3xl font-semibold leading-tight">
Find your apartment in Debrecen
</h1>

<p className="text-white/80 mt-2 text-sm">
For international tenants
</p>

</div>


{/* FORM CARD */}

<div className="mt-6 bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl">

<p className="font-semibold">
Quick request
</p>

<p className="text-sm text-white/60">
Fill in your details and continue
</p>


<input
placeholder="Full name"
className="w-full h-12 px-4 rounded-xl bg-black border border-white/20"
/>

<input
placeholder="Country of origin"
className="w-full h-12 px-4 rounded-xl bg-black border border-white/20"
/>

<input
placeholder="Spoken language"
className="w-full h-12 px-4 rounded-xl bg-black border border-white/20"
/>


{/* PHONE */}

<div className="flex gap-2">

<select className="w-24 h-12 rounded-xl bg-black border border-white/20">

<option>+1</option>
<option>+44</option>
<option>+49</option>
<option>+91</option>
<option>+971</option>

</select>

<input
placeholder="Phone number"
className="flex-1 h-12 px-4 rounded-xl bg-black border border-white/20"
/>

</div>


<label className="flex items-center gap-2 text-sm">

<input type="checkbox"/>

WhatsApp preferred contact

</label>


<input
placeholder="Email address"
className="w-full h-12 px-4 rounded-xl bg-black border border-white/20"
/>


{/* STATUS */}

<div>

<p className="text-sm mb-2">
Status
</p>

<div className="grid grid-cols-2 gap-2">

<button
onClick={()=>setStatus("student")}
className="h-12 border rounded-xl"
>
Student
</button>

<button
onClick={()=>setStatus("worker")}
className="h-12 border rounded-xl"
>
Worker
</button>

</div>

</div>


{status === "student" && (

<>

<input
placeholder="University / Institution"
className="w-full h-12 px-4 rounded-xl bg-black border border-white/20"
/>

<input
placeholder="Department / Faculty"
className="w-full h-12 px-4 rounded-xl bg-black border border-white/20"
/>

</>

)}


<button className="w-full h-14 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold text-lg">

Continue →

</button>

</div>

</div>

</section>

</main>

)

}