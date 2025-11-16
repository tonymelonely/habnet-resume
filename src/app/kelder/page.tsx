"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CRTWindow from "./CRTWindow";

type Phase = "idle" | "pc" | "door" | "black";

const BASE_WIDTH = 2512;
const BASE_HEIGHT = 1227;

export default function KelderPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [showReturnSign, setShowReturnSign] = useState(false);
  const [completedBasement, setCompletedBasement] = useState(false);
  const [scale, setScale] = useState(1);


  function handlePcClick() {
    if (phase !== "idle") return;
    setPhase("pc");
  }

  function handleDoorDoubleClick() {
    if (phase !== "idle") return;
    setPhase("door");
  }

  useEffect(() => {
    if (showReturnSign) {
      localStorage.setItem("completedBasement", "true");
      setCompletedBasement(true);
    }
  }, [showReturnSign]);

  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;
      const vw = window.innerWidth;
      const s = vw / BASE_WIDTH;

      setScale(s);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (phase === "door") {
      const t = setTimeout(() => setPhase("black"), 1400);
      return () => clearTimeout(t);
    }
    if (phase === "black") {
      const t = setTimeout(() => router.push("/lobby"), 700);
      return () => clearTimeout(t);
    }
  }, [phase, router]);

  return (
    <main className="fixed inset-0 bg-[#000] overflow-hidden">
      <div
        className="absolute top-0 left-0"
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <div className="relative w-[2512px] h-[1300px] overflow-hidden">
          <img
            src="/kelder.png"
            alt="Kelder"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />
          <img
            src="/voorgrond_kelder.png"
            alt="Kelder"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-50"
            draggable={false}
          />

          <button
            onClick={handlePcClick}
            className=" absolute left-[7%] top-[46%] w-[22%] h-[30%] cursor-pointer bg-red-500/0 hover:bg-red-500/10 rounded-md z-20 "
            aria-label="Klik op de computer"
          />
          <div className=" absolute left-[43.5%] top-[4.7%] w-[30%] h-[76%] bg-black z-[5] " />

          <div className="absolute left-[43.5%] top-[4.7%] w-[30%] h-[76%] z-20 flex justify-between">
            <img
              src="/deur_links_kelder.png"
              className={` w-[50%] h-full object-cover pointer-events-none transition-transform duration-[1300ms] ease-out ${phase === "door" || phase === "black" ? "-translate-x-full" : "translate-x-0"} `}
              alt="Deur links"
            />

            <img
              src="/deur_rechts_kelder.png"
              className={` w-[50%] h-full object-cover pointer-events-none transition-transform duration-[1300ms] ease-out ${phase === "door" || phase === "black" ? "translate-x-full" : "translate-x-0"} `}
              alt="Deur rechts"
            />

            <button
              onDoubleClick={handleDoorDoubleClick}
              className=" absolute inset-0  cursor-pointer rounded-md bg-blue-300/0 hover:bg-blue-300/10 "
              aria-label="Dubbelklik om naar de lobby terug te gaan"
            />
          </div>

          <div
            className={` absolute inset-0 bg-black transition-opacity duration-[700ms] pointer-events-none ${phase === "black" ? "opacity-100" : "opacity-0"} `}
          />
          {showReturnSign && (
            <div
              className=" absolute  right-[60%]  top-[12%] w-[18%]  cursor-pointer  z-50  transition-transform  hover:scale-105 "
              onClick={() => {
                setPhase("door");
                setTimeout(() => setPhase("black"), 1200);
                setTimeout(() => router.push("/lobby"), 1800);
              }}
            >
              <img
                src="/bord_terug.png"
                className="w-full h-auto select-none drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]"
                draggable={false}
              />
            </div>
          )}
          {phase === "pc" && (
            <div className=" absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[60] ">
              <CRTWindow onClose={() => {
                setPhase("idle");
                setShowReturnSign(true);
              }} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
