export type AppTab =
  | "timeline"
  | "exceptions"
  | "tour-sheet"
  | "dashboard"
  | "thumb-rules";

export type ServiceType =
  | "load-ua"
  | "load-other"
  | "positioning"
  | "other-work"
  | "break"
  | "unplanned";

export type Driver = {
  id: string;
  name: string;
  truck: string;
  radio: string;
  shiftStart: string;
  shiftEnd: string;
};

export type FlightAssignment = {
  id: string;
  driverId: string | null;
  flightNumber: string;
  gate: string;
  start: string;
  end: string;
  etd: string;
  eta: string;
  inboundEta: string;
  aircraft: string;
  serviceType: ServiceType;
  notes: string;
  edited?: boolean;
  overtime?: boolean;
};

export type ExceptionItem = {
  id: string;
  type: string;
  severity: "High" | "Medium" | "Low";
  owner: string;
  detail: string;
  time: string;
};

export type RuleItem = {
  id: string;
  category: string;
  setting: string;
  value: string;
};
