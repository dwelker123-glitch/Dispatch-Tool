import type { OperationType, StaffMember, StaffRole, StaffStatus } from "../types/dispatch";

const firstNames = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Jamie",
  "Avery",
  "Cameron",
  "Quinn",
  "Drew",
  "Reese",
  "Parker",
  "Rowan",
  "Skyler",
  "Hayden",
  "Kendall",
  "Emerson",
  "Finley",
  "Logan",
];

const lastNames = [
  "Sample",
  "Testman",
  "Mocker",
  "Placeholder",
  "Training",
  "Practice",
  "Sandbox",
  "Demo",
  "Example",
  "Pilot",
];

const shiftStarts = ["04:00", "05:00", "06:00", "07:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
const locations = ["ORD", "SEA", "DFW", "DEN", "LAX", "IAH"] as const;

const statusCycle: StaffStatus[] = [
  "Available",
  "Available",
  "Available",
  "Assigned",
  "On Push",
  "Lunch",
  "Off Shift",
  "Call Out",
  "Unavailable",
];

export const staffStatuses: StaffStatus[] = [
  "Available",
  "Assigned",
  "On Push",
  "Lunch",
  "Off Shift",
  "Call Out",
  "Unavailable",
];

export const staffRoles: StaffRole[] = ["Driver", "Helper"];

export const mockStaffing: StaffMember[] = Array.from({ length: 200 }, (_, index) => {
  const number = index + 1;
  const role: StaffRole = index % 4 === 0 ? "Helper" : "Driver";
  const operationType: OperationType = index % 5 === 0 ? "express" : "mainline";
  const shiftStart = shiftStarts[index % shiftStarts.length];
  const status = statusCycle[index % statusCycle.length];

  return {
    id: `EMP-${String(number).padStart(4, "0")}`,
    name: `${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / firstNames.length) % lastNames.length]} ${number}`,
    role,
    location: locations[index % locations.length],
    operationType,
    shift: {
      start: shiftStart,
      end: addHours(shiftStart, 8),
      lengthHours: 8,
    },
    status,
    assignedPush: status === "Assigned" || status === "On Push" ? `P-${String((index % 45) + 1).padStart(3, "0")}` : null,
    notes: `${operationType === "mainline" ? "Mainline" : "Express"} mock ${role.toLowerCase()} roster record`,
  };
});

function addHours(time: string, hoursToAdd: number) {
  const [hours, minutes] = time.split(":").map(Number);
  return `${String((hours + hoursToAdd) % 24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
