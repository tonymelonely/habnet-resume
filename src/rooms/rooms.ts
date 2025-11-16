// src/rooms/rooms.ts
export type RoomId = "exterior" | "basement" | "lobby" | "vip";

export type Room = {
  id: RoomId;
  title: string;
  subtitle?: string;
  description?: string;
};

export const ROOMS: Record<RoomId, Room> = {
  exterior: {
    id: "exterior",
    title: "Habnet Hotel – Buiten",
    subtitle: "Dubbelklik op de entree om binnen te gaan",
    description:
      "Dit is de buitenkant van het Habnet hotel. Hier begint jouw interactieve resumé.",
  },
  basement: {
    id: "basement",
    title: "De Kelder",
    subtitle: "Waar het programmeren begon",
    description:
      "Hier begon het allemaal: eerste scripts, experimenten en lange nachten.",
  },
  lobby: {
    id: "lobby",
    title: "De Lobby",
    subtitle: "De weg omhoog",
    description:
      "Van kleine projecten naar grotere systemen, bots en webapps.",
  },
  vip: {
    id: "vip",
    title: "VIP Lounge",
    subtitle: "De huidige fase",
    description:
      "High-end projecten, complexe systemen en de toekomst van Habnet & co.",
  },
};
