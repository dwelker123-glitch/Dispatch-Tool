import type { FlightAssignment } from "../types/dispatch";

export const mockFlights: FlightAssignment[] = [
  { id: "f1", driverId: "d1", flightNumber: "UA1996", gate: "E3", start: "07:00", end: "08:08", etd: "08:55", eta: "11:18", inboundEta: "06:42", aircraft: "A320", serviceType: "load-ua", notes: "ALL service. High priority departure.", edited: true },
  { id: "f2", driverId: "d1", flightNumber: "UA2325", gate: "C23", start: "08:10", end: "09:50", etd: "09:00", eta: "12:24", inboundEta: "07:45", aircraft: "737-900", serviceType: "positioning", notes: "Positioning and final load." },
  { id: "f3", driverId: "d1", flightNumber: "UA1876", gate: "B18", start: "10:14", end: "11:18", etd: "11:35", eta: "14:52", inboundEta: "09:40", aircraft: "737 MAX", serviceType: "load-ua", notes: "Cart count changed by dispatcher.", edited: true },
  { id: "f4", driverId: "d2", flightNumber: "NK1711", gate: "B2", start: "07:00", end: "08:25", etd: "08:32", eta: "11:04", inboundEta: "06:58", aircraft: "A321", serviceType: "positioning", notes: "Other carrier load." },
  { id: "f5", driverId: "d2", flightNumber: "NK948", gate: "A11", start: "08:35", end: "09:42", etd: "09:58", eta: "12:20", inboundEta: "07:22", aircraft: "A320", serviceType: "positioning", notes: "Check dry ice requirement." },
  { id: "f6", driverId: "d2", flightNumber: "F9 1044", gate: "D21", start: "09:52", end: "11:00", etd: "11:24", eta: "14:12", inboundEta: "09:12", aircraft: "A321", serviceType: "other-work", notes: "Gate runner requested." },
  { id: "f7", driverId: "d3", flightNumber: "UA2389", gate: "C7", start: "08:12", end: "09:08", etd: "09:30", eta: "12:44", inboundEta: "07:54", aircraft: "737-800", serviceType: "load-other", notes: "Standard ALL service." },
  { id: "f8", driverId: "d3", flightNumber: "UA2070", gate: "F12", start: "09:50", end: "11:02", etd: "11:20", eta: "15:01", inboundEta: "09:18", aircraft: "737-900", serviceType: "load-other", notes: "Watch late aircraft turn." },
  { id: "f9", driverId: "d4", flightNumber: "UA499", gate: "A5", start: "06:30", end: "07:38", etd: "08:05", eta: "10:48", inboundEta: "06:12", aircraft: "A319", serviceType: "positioning", notes: "Short turn." },
  { id: "f10", driverId: "d4", flightNumber: "UA1036", gate: "E14", start: "07:46", end: "09:10", etd: "09:15", eta: "12:10", inboundEta: "07:04", aircraft: "A320", serviceType: "load-ua", notes: "Load all carts." },
  { id: "f11", driverId: "d5", flightNumber: "UA1044", gate: "C20", start: "06:35", end: "07:46", etd: "09:01", eta: "11:59", inboundEta: "06:28", aircraft: "A320", serviceType: "load-ua", notes: "Early stage." },
  { id: "f12", driverId: "d5", flightNumber: "UA2183", gate: "B22", start: "07:52", end: "09:40", etd: "09:13", eta: "12:37", inboundEta: "07:15", aircraft: "757", serviceType: "load-ua", notes: "Long service window." },
  { id: "f13", driverId: "d5", flightNumber: "LUNCH", gate: "-", start: "09:45", end: "10:15", etd: "-", eta: "-", inboundEta: "-", aircraft: "-", serviceType: "break", notes: "Meal period." },
  { id: "f14", driverId: "d6", flightNumber: "UA202", gate: "B17", start: "06:52", end: "08:55", etd: "09:20", eta: "12:01", inboundEta: "06:40", aircraft: "787", serviceType: "positioning", notes: "FWD staged." },
  { id: "f15", driverId: "d6", flightNumber: "UA3470", gate: "A16", start: "09:22", end: "10:28", etd: "10:50", eta: "13:18", inboundEta: "08:48", aircraft: "E175", serviceType: "other-work", notes: "Regional load." },
  { id: "open1", driverId: null, flightNumber: "UA2333", gate: "Z36", start: "06:35", end: "07:02", etd: "07:30", eta: "09:45", inboundEta: "06:10", aircraft: "737", serviceType: "unplanned", notes: "Unplanned open load." },
  { id: "open2", driverId: null, flightNumber: "UA343", gate: "C11", start: "09:05", end: "09:35", etd: "09:52", eta: "12:08", inboundEta: "08:40", aircraft: "A320", serviceType: "unplanned", notes: "Needs truck assignment." }
];
