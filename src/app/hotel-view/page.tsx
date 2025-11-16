// app/hotel-view/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CLOUD_IMAGES = ["/clouds.png", "/clouds1.png", "/clouds2.png"];
const BASE_WIDTH = 2512;
const BASE_HEIGHT = 1227;

function CloudLayer({ count, z }: { count: number; z: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0"
      style={{ zIndex: z, height: "40%" }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const img =
          CLOUD_IMAGES[Math.floor(Math.random() * CLOUD_IMAGES.length)];
        const slow = i % 2 === 0;
        const negativeDelaySeconds = -(Math.random() * 30);

        return (
          <div
            key={i}
            className={`absolute bg-no-repeat bg-contain ${slow ? "animate-cloud-slow" : "animate-cloud-fast"
              }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 22}%`,
              width: "18%",
              height: "12%",
              opacity: 0.8 + Math.random() * 0.15,
              backgroundImage: `url(${img})`,
              transform: "translateX(0)",
              animationDelay: `${negativeDelaySeconds}s`,
              imageRendering: "pixelated",
            }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export default function HotelViewPage() {
  const router = useRouter();

  const [showLobbyPreview, setShowLobbyPreview] = useState(false);
  const [phase, setPhase] = useState<
    "idle" | "bubble1" | "bubble2" | "zoom" | "doors" | "black" | "lobby"
  >("idle");
  const [lobbyZoomPhase, setLobbyZoomPhase] = useState<
    "none" | "start" | "out" | "fade-out"
  >("none");

  const [scale, setScale] = useState(1);

  useEffect(() => {
    try {
      localStorage.removeItem("completedBasement");
    } catch { }
  }, []);

  useEffect(() => {
    function handleResize() {
      const vw = window.innerWidth;
      const s = vw / BASE_WIDTH;
      setScale(s);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleDoorDoubleClick() {
    if (phase !== "idle") return;
    setPhase("bubble1");
  }

  useEffect(() => {
    if (phase === "bubble1") {
      const t = setTimeout(() => setPhase("bubble2"), 4000);
      return () => clearTimeout(t);
    }

    if (phase === "bubble2") {
      const t = setTimeout(() => setPhase("zoom"), 5000);
      return () => clearTimeout(t);
    }

    if (phase === "zoom") {
      const t = setTimeout(() => setPhase("doors"), 2500);
      return () => clearTimeout(t);
    }

    if (phase === "doors") {
      const t = setTimeout(() => setPhase("black"), 1600);
      return () => clearTimeout(t);
    }

    if (phase === "black") {
      setShowLobbyPreview(true);
      setLobbyZoomPhase("start");

      const t1 = setTimeout(() => {
        setLobbyZoomPhase("out");
      }, 35);

      const t2 = setTimeout(() => {
        router.push("/lobby");
      }, 800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [phase, router]);

  return (
    <main className="fixed inset-0 bg-[#000] overflow-hidden">
      {/* Vast canvas dat 1-op-1 schaalt (net als lobby) */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <div className="relative w-[2512px] h-[1300px] bg-gradient-to-b from-[#7fd5ff] via-[#5ab9ff] to-[#e9fbff] overflow-hidden">
          {/* Zon */}
          <div className="sunny-glow pointer-events-none absolute -top-24 right-[-60px] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,1),_rgba(253,224,71,0.3)_55%,_transparent_75%)] mix-blend-screen" />

          {/* Wolken */}
          <CloudLayer count={10} z={3} />

          {/* HOTEL + AVATARS */}
          <div
            className={`
              absolute inset-0 overflow-hidden z-10
              pointer-events-none md:pointer-events-auto
              [transform-origin:50%_87%]
              transition-transform duration-[3500ms] ease-out
              ${phase === "zoom" ? "scale-[5]" : ""}
              ${phase === "doors" ? "scale-[15]" : ""}
            `}
          >
            {/* MINI LOBBY ACHTER DE DEUREN */}
            <img
              src="/lobby_Mini.png"
              className="
                absolute
                -bottom-[47%] left-1/2 -translate-x-1/2
                w-[380%] h-auto
                scale-[0.17]
                opacity-100
                pointer-events-none
                z-[1]
              "
              draggable={false}
            />

            {/* HOTEL */}
            <img
              src="/habnet_hotel_snow.png"
              alt="Habnet Hotel"
              className="
                z-2 pointer-events-none
                absolute bottom-[-10%] left-1/2 -translate-x-1/2
                h-[120%] w-auto select-none
                drop-shadow-[0_20px_45px_rgba(15,23,42,0.9)]
              "
              draggable={false}
            />

            {/* AVATARS links */}
            <div className="pointer-events-none absolute bottom-[5%] left-[20%] hidden md:flex gap-6">
              <img
                src="/Gio.png"
                alt="Gio"
                className="h-[10%] w-auto drop-shadow-[0_12px_24px_rgba(15,23,42,0.9)]"
              />
              <img
                src="/David.png"
                alt="David"
                className="h-[10%] w-auto drop-shadow-[0_12px_24px_rgba(15,23,42,0.9)]"
              />
            </div>

            {/* AVATAR rechts */}
            <div className="pointer-events-none absolute bottom-[5%] right-[22.5%] hidden md:flex gap-6">
              <img
                src="/frank.png"
                alt="frank"
                className="h-[50%] drop-shadow-[0_12px_24px_rgba(15,23,42,0.9)]"
              />
            </div>

            {/* DEUR HITBOX */}
            <button
              onDoubleClick={handleDoorDoubleClick}
              className="
                pointer-events-auto
                absolute z-26 bottom-[10%] left-1/2 -translate-x-1/2
                h-[21%] w-[8%]
                rounded-md border-2 border-transparent
                bg-yellow-300/0 hover:bg-yellow-300/15 hover:border-yellow-300/80
              "
            />

            {/* VISUELE DEUREN */}
            <div className="pointer-events-none absolute bottom-[10%] left-1/2 -ml-1 -translate-x-1/2 h-[21.3%] w-[7.7%] z-[25]">
              <div className="relative w-full h-full">
                <img
                  src="/deur_links.png"
                  alt="Linkerdeur"
                  className={`
                    absolute inset-y-0 left-0 w-1/2 h-full object-cover
                    transition-transform duration-[1400ms] ease-out
                    ${phase === "doors" || phase === "black"
                      ? "-translate-x-full"
                      : "translate-x-0"
                    }
                  `}
                  draggable={false}
                />
                <img
                  src="/deur_rechts.png"
                  alt="Rechterdeur"
                  className={`
                    absolute inset-y-0 right-0 w-1/2 h-full object-cover
                    transition-transform duration-[1400ms] ease-out
                    ${phase === "doors" || phase === "black"
                      ? "translate-x-full"
                      : "translate-x-0"
                    }
                  `}
                  draggable={false}
                />
              </div>
            </div>

            {/* Rode loper */}
            <img
              src="/rode_loper.png"
              alt="Rode loper"
              className="
                pointer-events-none
                absolute bottom-[-5%] left-1/2 pr-2 -translate-x-1/2
                w-[32%] h-[15%]
              "
            />

            {/* Tekst boven loper */}
            <div
              className="
                absolute bottom-[3%] left-1/2 -translate-x-1/2
                hidden md:block text-[9px] z-21
                font-semibold tracking-wide text-black/80 font-mono
                drop-shadow-[0_0_3px_rgba(255,255,255,0.7)] select-none
              "
            >
              <b>
                Dubbelklik op deur <br /> om verder te gaan
              </b>
            </div>
          </div>

          {/* Extra wolkenlaag boven hotel */}
          {phase === "zoom" || phase === "doors" || phase === "black" ? (
            <CloudLayer count={4} z={4} />
          ) : (
            <CloudLayer count={4} z={20} />
          )}

          {/* Gras + sneeuwrand onderaan */}
          <div className="absolute bottom-0 left-0 w-full h-[10%] z-5">
            <div className="absolute inset-0 bg-[linear-gradient(to_top,#14532d_0,#166534_40%,#22c55e_100%)] border-t-4 border-[#052e16]" />
            <div
              className="
                absolute -top-[1.4%] left-0 w-full h-[2.3%]
                rounded-t-[18px]
                bg-[repeating-linear-gradient(
                  to_right,
                  #ffffff 0,
                  #ffffff 12px,
                  #f5f5f5 12px,
                  #f5f5f5 18px,
                  #e5e7eb 18px,
                  #e5e7eb 22px
                )]
                shadow-[0_-4px_0_rgba(15,23,42,0.45)]
                border-t border-white/80
              "
            />
          </div>

          {/* BUBBLE 1 */}
          {(phase === "bubble1" || phase === "bubble2") && (
            <div className="absolute left-[58%] bottom-[30%] z-[50] habbo-chat-anim pointer-events-none">
              <div className="relative inline-flex items-stretch border-[2px] border-black rounded-md bg-white shadow-[2px_2px_0_rgba(0,0,0,1)]">
                <div className="flex items-center gap-1 bg-[#ffd54a] px-2 border-r-[2px] border-black">
                  <img
                    src="/mijn_hoofd.png"
                    alt="avatar"
                    className="w-6 h-6 rounded-[3px]"
                  />
                  <span className="text-[14px] font-bold text-black leading-none">
                    Tony:
                  </span>
                </div>
                <div className="flex items-center px-3 py-1">
                  <span className="text-[14px] text-black leading-none whitespace-nowrap">
                    Een moment, ik kom er aan.
                  </span>
                </div>
              </div>
              <div className="absolute left-40 -bottom-[7px] w-0 h-0 border-t-[10px] border-t-black border-x-[8px] border-x-transparent" />
              <div className="absolute left-40 -bottom-[6px] w-0 h-0 border-t-[9px] border-t-white border-x-[7px] border-x-transparent" />
            </div>
          )}

          {/* BUBBLE 2 */}
          {phase === "bubble2" && (
            <div className="absolute left-[53%] bottom-[30%] z-[50] habbo-chat-anim pointer-events-none">
              <div className="relative inline-flex items-stretch border-[2px] border-black rounded-md bg-white shadow-[2px_2px_0_rgba(0,0,0,1)]">
                <div className="flex items-center gap-1 bg-[#ffd54a] px-2 border-r-[2px] border-black">
                  <img
                    src="/mijn_hoofd.png"
                    alt="avatar"
                    className="w-6 h-6 rounded-[3px]"
                  />
                  <span className="text-[14px] font-bold text-black leading-none">
                    Tony:
                  </span>
                </div>
                <div className="flex items-center px-3 py-1">
                  <span className="text-[14px] text-black leading-none whitespace-nowrap">
                    Kom binnen, ik laat je mijn interactieve resumé zien!
                  </span>
                </div>
              </div>
              <div className="absolute left-40 -bottom-[7px] w-0 h-0 border-t-[10px] border-t-black border-x-[8px] border-x-transparent" />
              <div className="absolute left-40 -bottom-[6px] w-0 h-0 border-t-[9px] border-t-white border-x-[7px] border-x-transparent" />
            </div>
          )}

          {/* LOBBY PREVIEW OVERLAY */}
          {showLobbyPreview && (
            <>
              <div
                className="absolute inset-0 z-[39] opacity-100"
                style={{ pointerEvents: "none" }}
              >
                <img
                  src="/lobby.png"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Lobby"
                />

                <div className="absolute top-[10.75%] left-[63.65%] h-[40%] flex justify-between z-10">
                  <img
                    src="/deur_links_lobby.png"
                    className="door door-left pointer-events-none transition-transform duration-[1400ms] ease-out"
                    alt="Linkerdeur kelder"
                  />
                  <img
                    src="/deur_rechts_lobby.png"
                    className="door door-right pointer-events-none transition-transform duration-[1400ms] ease-out"
                    alt="Rechterdeur kelder"
                  />
                  <button
                    className="
                      absolute inset-0 pointer-events-auto
                      rounded-md border-2 border-transparent
                      bg-yellow-300/0 hover:bg-yellow-300/10 hover:border-yellow-300/60
                      cursor-pointer
                    "
                    aria-label="Dubbelklik om naar de kelder te gaan"
                  />
                </div>

                <img
                  src="/tony.png"
                  alt="Tony"
                  className="tony absolute pointer-events-none z-20 top-[30%] left-[85%] h-[35%]"
                />
              </div>

              <div
                className={`
                  pointer-events-none absolute inset-0 z-[40]
                  flex items-center justify-center
                  [transform-origin:50%_50%]
                  transition-opacity duration-[700ms] ease-out
                  ${lobbyZoomPhase === "start"
                    ? "scale-[1.18]"
                    : "scale-100"
                  }
                `}
              >
                <img
                  src="/lobby_Mini.png"
                  className="w-full h-full object-cover select-none"
                  alt="Lobby mini"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
