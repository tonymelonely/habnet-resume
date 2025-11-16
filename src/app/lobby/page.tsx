// app/lobby/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "idle" | "intro" | "zoom" | "doors" | "black";

const BASE_WIDTH = 2512;
const BASE_HEIGHT = 1227;

export default function LobbyPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [completedBasement, setCompletedBasement] = useState(false);

  const [scale, setScale] = useState(1);

  // ==== 1) schaal alleen op basis van breedte, top-left anchor ====
  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;
      const vw = window.innerWidth;
      const s = vw / BASE_WIDTH; // altijd full width

      setScale(s);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ==== 2) completedBasement uit localStorage ====
  useEffect(() => {
    if (typeof window === "undefined") return;
    const val = localStorage.getItem("completedBasement") === "true";
    setCompletedBasement(val);
  }, []);

  // ==== 3) intro bubble (alleen als kelder nog NIET klaar is) ====
  useEffect(() => {
    if (completedBasement) return;
    if (phase !== "idle") return;

    const t = setTimeout(() => setPhase("intro"), 2000);
    return () => clearTimeout(t);
  }, [phase, completedBasement]);

  function handleDoorDoubleClick() {
    if (completedBasement) return;
    if (phase !== "intro") return;
    setPhase("zoom");
  }

  // ==== 4) animatie naar kelder ====
  useEffect(() => {
    if (completedBasement) return;

    if (phase === "zoom") {
      const t = setTimeout(() => setPhase("doors"), 2500);
      return () => clearTimeout(t);
    }
    if (phase === "doors") {
      const t = setTimeout(() => setPhase("black"), 1600);
      return () => clearTimeout(t);
    }
    if (phase === "black") {
      const t = setTimeout(() => {
        router.push("/kelder");
      }, 700);
      return () => clearTimeout(t);
    }
  }, [phase, router, completedBasement]);

  return (
    <main className="fixed inset-0 bg-[#000] overflow-hidden">
      {/* Canvas van 2512x1227 dat alleen geschaald wordt, geen offset */}
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
          {/* LOBBY WORLD */}
          <div
            className={`
              absolute inset-0 overflow-hidden z-10
              pointer-events-none md:pointer-events-auto
              [transform-origin:80%_40%]
              transition-transform duration-[3500ms] ease-out
              ${!completedBasement && phase === "zoom" ? "scale-[2.2]" : ""}
              ${!completedBasement && phase === "doors" ? "scale-[7]" : ""}
              ${!completedBasement && phase === "black" ? "scale-[25]" : ""}
            `}
          >
            <img
              src="/lobby.png"
              alt="Habnet Lobby"
              className="
                pointer-events-none
                absolute inset-0
                w-full h-full
                object-cover
                select-none
              "
              draggable={false}
            />

            {/* deuren + hitbox + Tony */}
            <div className="absolute mt-[10.75%] ml-[63.65%] h-[703px] flex justify-between z-10">
              <img
                src="/deur_links_lobby.png"
                className={`
                  door door-left pointer-events-none
                  transition-transform duration-[1400ms] ease-out
                  ${
                    !completedBasement &&
                    (phase === "doors" || phase === "black")
                      ? "-translate-x-full"
                      : "translate-x-0"
                  }
                `}
                alt="Linkerdeur kelder"
              />
              <img
                src="/deur_rechts_lobby.png"
                className={`
                  door door-right pointer-events-none
                  transition-transform duration-[1400ms] ease-out
                  ${
                    !completedBasement &&
                    (phase === "doors" || phase === "black")
                      ? "translate-x-full"
                      : "translate-x-0"
                  }
                `}
                alt="Rechterdeur kelder"
              />
              <button
                onDoubleClick={handleDoorDoubleClick}
                className="
                  absolute inset-0
                  pointer-events-auto
                  rounded-md border-2 border-transparent
                  bg-yellow-300/0
                  hover:bg-yellow-300/10 hover:border-yellow-300/60
                  cursor-pointer
                "
                aria-label="Dubbelklik om naar de kelder te gaan"
              />
            </div>

            <img
              src="/tony.png"
              alt="Tony"
              className="
                tony absolute pointer-events-none z-20 mt-[30%] h-[500px] ml-[85%]
              "
            />
          </div>

          {/* BUBBLE OVERLAY */}
          {(phase === "intro" || completedBasement) && (
            <div
              className={`
                absolute
                z-[50]
                pointer-events-none
                ${
                  completedBasement
                    ? "left-[70%] top-[40%]"
                    : "left-[85%] top-[46%]"
                }
              `}
            >
              <div
                className={`
                  absolute inline-flex items-stretch border-[2px] border-black rounded-md bg-white shadow-[2px_2px_0_rgba(0,0,0,1)]
                  ${!completedBasement ? "habbo-chat-anim" : ""} 
                `}
              >
                <div className="flex items-center gap-2 bg-[#ffd54a] px-2 border-r-[2px] border-black">
                  <img
                    src="/mijn_hoofd.png"
                    alt="avatar"
                    className="w-8 h-8 rounded-[3px]"
                  />
                  <span className="text-[14px] mr-5 font-bold text-black leading-none">
                    Tony:
                  </span>
                </div>

                {completedBasement ? (
                  <div className="flex items-center px-3 py-1">
                    <span className="text-[14px] text-black leading-snug whitespace-nowrap text-center">
                      Niet heel groot of spectaculair misschien,
                      <br />
                      maar er zit wél tijd, liefde en nostalgie in dit stukje
                      kelder.
                      <br />
                      En dit is eigenlijk maar een klein deel van wat ik kan
                      bouwen.
                      <br />
                      Nu is het aan jullie: zien jullie mij in het team passen?
                      <br />
                      Zo ja, dan ga ik er 100% voor. Zo niet,
                      <br />
                      dan zijn we gewoon even goede vrienden en wie weet 
                      <br />
                      kruisen onze paden later nog een keer.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center px-3 py-1">
                    <span className="text-[14px] text-black leading-snug whitespace-nowrap">
                      Laten we als eerst naar de kelder gaan
                      <br />
                      waar het allemaal begon.{" "}
                      <b>Dubbelklik op de deuren</b> en we gaan naar de kelder.
                    </span>
                  </div>
                )}

                <div
                  className={`
                    absolute ${completedBasement ? "left-115" : "left-80"}
                    -bottom-[10px] w-0 h-0
                    border-t-[10px] border-t-black border-x-[8px] border-x-transparent
                  `}
                />
                <div
                  className={`
                    absolute ${completedBasement ? "left-115" : "left-80"}
                    -bottom-[9px] w-0 h-0
                    border-t-[9px] border-t-white border-x-[7px] border-x-transparent
                  `}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
