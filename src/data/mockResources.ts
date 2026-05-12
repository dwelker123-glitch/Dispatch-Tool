import type { Helper, Truck } from "../types/dispatch";

export const mockHelpers: Helper[] = [
  { id: "h1", name: "Helper 1", shiftStart: "06:00", shiftEnd: "14:00" },
  { id: "h2", name: "Helper 2", shiftStart: "06:00", shiftEnd: "14:00" },
  { id: "h3", name: "Helper 3", shiftStart: "07:00", shiftEnd: "15:00" },
  { id: "h4", name: "Helper 4", shiftStart: "07:00", shiftEnd: "15:00" },
];

export const mockTrucks: Truck[] = [
  { id: "t1", truckNumber: "304" },
  { id: "t2", truckNumber: "235" },
  { id: "t3", truckNumber: "227" },
  { id: "t4", truckNumber: "1169" },
  { id: "t5", truckNumber: "109" },
  { id: "t6", truckNumber: "043" },
  { id: "t7", truckNumber: "039" },
  { id: "t8", truckNumber: "046" },
];
