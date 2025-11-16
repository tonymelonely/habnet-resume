"use client";

import React, { useEffect, useState, useCallback } from "react";

type CRTWindowProps = {
  onClose: () => void;
};

type StorySection = {
  id: string;
  title: string;
  text: string;
};

const STORY_SECTIONS: StorySection[] = [
  {
    id: "2012",
    title: "2012 – De kelder waar alles begon",
    text: `
Ik was 13 jaar oud en leefde praktisch online.
Van programmeren wist ik letterlijk nog niets.
Ik speelde veel Habbo Hotel en retro’s, maar kreeg nooit echt aandacht.
Dus dacht ik: waarom maak ik er niet gewoon zelf één?
Misschien val ik dan wel op.

Alleen… programmeren kon ik nog niet,
dus begon ik kleine dingen te leren via het internet.
`,
  },
  {
    id: "2015",
    title: "2015 – Eerste echte projecten",
    text: `
Ik bouwde mijn eerste Engelse Habbo-retro.
In het begin wilde ik het in het Nederlands maken,
omdat mijn Engels toen nog belabberd was 😅.
Maar na veel proberen liep het totaal niet —
dus ging ik over naar Engels (met veel Google Translate).

Tot mijn verbazing liep het nog best goed.
Toen ik van de middelbare school afging stopte ik ermee,
omdat ik me volledig op m’n studie moest richten.
`,
  },
  {
    id: "2019",
    title: "2019 – Discord bots, automation & mini-games",
    text: `
Mijn skills schoten toen écht omhoog.
Ik maakte bots, mini-games, tools, UI’s… alles wat ik leuk vond.

In die tijd verhuisde ik ook naar Spanje.
Daar bouwde ik mijn eerste grote project:
- de volledige website van het bedrijf waar ik werkte (promotiebedrijf)
- de website van hun manege
- en een WordPress-site voor de orde waar ik bij zat.

Een supermooie periode.
`,
  },
  {
    id: "2023",
    title: "2023–2024 – Grotere projecten",
    text: `
Van hobby naar steeds vaker echte opdrachten.
Vooral Discord-bots, automatisering en systemen voor kleinere websites.
Ik begon steeds meer richting “professionele” code te gaan.
`,
  },
  {
    id: "2025",
    title: "2024–2025 – Soulora, Dispatch Nexus & AI",
    text: `
Mijn grootste projecten tot nu toe. Complex, realtime en professioneel.

• Auraverse:
  Mijn social-media platform gericht op mensen, niet op geld.
  Realtime, modern, veilig — en gigantisch veel werk, maar supergaaf.

• Dispatch Nexus:
  Een toekomstgerichte 911-operator-ervaring
  met realtime systemen, AI-cases, units op een neon-Amsterdam map
  en een volledige sim-engine.

• AI Chatbot:
  Ik vind ChatGPT en Gemini op sommige vlakken nét niet.
  Vooral visueel kan het véél beter.
  Daarom ben ik mijn eigen visual-focused AI gaan bouwen:
  meer beeld, meer interactie, beter ontwerp.

  Ps. De previews die ik hier onder geef is een sneak peak.
  Niemand wet nog echt hoe het er uit ziet behalve 3 andere.
`,
  },
  {
    id: "now",
    title: "En nu…",
    text: `
Merk ik dat ik het eigenlijk mis om voor — of samen met — een retro hotel te werken.
Er zit nog zoveel meer potentie in mij,
en ik wil elke dag blijven leren en blijven groeien.
`,
  },
];

const STORY_MEDIA: Record<string, string[]> = {
  "2025": [
    "/images/auraverse.png",
    "/images/dispatch-nexus.png",
    "/images/percy.png",
  ],
};

export default function CRTWindow({ onClose }: CRTWindowProps) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [autoMode, setAutoMode] = useState(false);

  const section = STORY_SECTIONS[sectionIndex];
  const totalSections = STORY_SECTIONS.length;

  useEffect(() => {
    setTypedText("");
    setCharIndex(0);
    setIsTyping(true);
  }, [sectionIndex]);

  useEffect(() => {
    if (!section) return;
    if (!isTyping) return;

    if (charIndex >= section.text.length) {
      setIsTyping(false);
      return;
    }

    const delay = section.text[charIndex] === "\n" ? 18 : 22;

    const t = setTimeout(() => {
      setTypedText((prev) => prev + section.text[charIndex]);
      setCharIndex((i) => i + 1);
    }, delay);

    return () => clearTimeout(t);
  }, [charIndex, isTyping, section]);


  useEffect(() => {
    if (!autoMode) return;
    if (isTyping) return;
    if (sectionIndex >= totalSections - 1) return;

    const autoTimer = setTimeout(() => {
      setSectionIndex((idx) => (idx < totalSections - 1 ? idx + 1 : idx));
    }, 1400);

    return () => clearTimeout(autoTimer);
  }, [autoMode, isTyping, sectionIndex, totalSections]);

  const handleSkipOrNext = useCallback(() => {
    if (!section) return;

    if (isTyping) {
      setTypedText(section.text);
      setCharIndex(section.text.length);
      setIsTyping(false);
      return;
    }

    setSectionIndex((idx) =>
      idx < totalSections - 1 ? idx + 1 : idx
    );
  }, [isTyping, section, totalSections]);

  const handlePrev = useCallback(() => {
    setSectionIndex((idx) => (idx > 0 ? idx - 1 : 0));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === " " || e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleSkipOrNext();
      } else if (e.key.toLowerCase() === "p" || e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, handleSkipOrNext, handlePrev]);

  const mediaForSection = section ? STORY_MEDIA[section.id] : undefined;
  const typingFinished = !isTyping;

  return (
    <div className=" relative w-[80vw] max-w-[1400px] h-[65vh] bg-black border-4 border-[#4aff4a] shadow-[0_0_25px_rgba(0,255,0,0.5)] rounded-lg p-4 crt-fx text-[#4aff4a] font-mono " >
      <div className="absolute inset-0 pointer-events-none crt-scan" />

      <div className="mb-2 mr-10 flex items-center justify-between text-xs text-[#8bff8b]">
        <span>
          {sectionIndex + 1}/{totalSections} ▸ {section?.title}
        </span>
        <span className="opacity-70">
          [Space/N: next · P: prev · Esc: close]
        </span>
      </div>

      <div className="relative h-[calc(100%-3rem)] overflow-y-auto pr-3 space-y-4">
        <div>
          <pre className="whitespace-pre-wrap text-sm leading-5">
            {typedText}
            <span className="inline-block w-2 animate-pulse">▌</span>
          </pre>
        </div>

        {section?.id === "2025" && typingFinished && mediaForSection && (
          <div className="mt-4 space-y-3">
            {mediaForSection.map((src, i) => (
              <div
                key={i}
                className=" w-[90%] mx-auto border border-[#4aff4a]/40 bg-black/60 shadow-[0_0_18px_rgba(0,255,0,0.25)] rounded-md overflow-hidden ">
                <img
                  src={src}
                  alt={`Project preview ${i + 1}`}
                  className="w-full h-auto object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-2 left-3 flex gap-2 text-xs">
        <button
          onClick={handlePrev}
          className=" px-3 py-1 rounded bg-black/60 border border-[#4aff4a]/60 hover:bg-[#4aff4a]/10 transition "
        >
          ◀ Terug
        </button>

        <button
          onClick={handleSkipOrNext}
          className=" px-3 py-1 rounded bg-[#4aff4a]/20 border border-[#4aff4a] hover:bg-[#4aff4a]/40 transition "
        >
          {isTyping ? "Skip tekst" : sectionIndex < totalSections - 1 ? "Volgende" : "Laatste sectie"}
        </button>

        <button
          onClick={() => setAutoMode((v) => !v)}
          className={` px-3 py-1 rounded border text-xs ${autoMode ? "bg-[#4aff4a]/40 border-[#4aff4a]" : "bg_black/60 border-[#4aff4a]/60".replace("bg_black", "bg-black")} `}
        >
          Auto: {autoMode ? "aan" : "uit"}
        </button>
      </div>

      <button
        onClick={onClose}
        className=" absolute top-2 right-2 px-3 py-1 text-black text-sm font-bold bg-[#4aff4a] hover:bg-white rounded "
      >
        X
      </button>
    </div>
  );
}
