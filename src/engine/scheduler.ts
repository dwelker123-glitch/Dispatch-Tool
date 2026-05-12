import type { Driver, Flight, FlightAssignment, Helper, Push, ResourceInputs, ScheduleException, ScheduleResult, ServiceType, Truck } from "../types/dispatch";

const BLOCK_MINUTES = 5;
const PREP_MINUTES = 20;
const DRIVE_OUT_MINUTES = 15;
const SERVICE_MINUTES_PER_FLIGHT = 15;
const RETURN_MINUTES = 15;
const LOAD_WINDOW_BEFORE_ETD = 120;
const LOAD_WINDOW_END_BEFORE_ETD = 35;
const MAX_FLIGHTS_PER_PUSH = 3;
const GROUP_WINDOW_MINUTES = 35;

type ResourcePoolItem = { id: string; availableAt: number };

export function createPlanningSchedule(assignments: FlightAssignment[], drivers: Driver[], helpers: Helper[], trucks: Truck[]): ScheduleResult {
  const flights = toFlights(assignments);
  const candidatePushes = buildCandidatePushes(flights);
  const scheduledPushes = assignUnlimitedResources(candidatePushes, drivers, helpers, trucks);
  return buildResult("planning", scheduledPushes, []);
}

export function createDispatchSchedule(assignments: FlightAssignment[], drivers: Driver[], helpers: Helper[], trucks: Truck[], resources: ResourceInputs): ScheduleResult {
  const flights = toFlights(assignments);
  const candidatePushes = buildCandidatePushes(flights);
  const exceptions: ScheduleException[] = [];
  const scheduledPushes = assignLimitedResources(candidatePushes, drivers.slice(0, resources.availableDrivers), helpers.slice(0, resources.availableHelpers), trucks.slice(0, resources.availableTrucks), exceptions);
  return buildResult("dispatch", scheduledPushes, exceptions);
}

function toFlights(assignments: FlightAssignment[]): Flight[] {
  return assignments
    .filter((flight) => flight.serviceType !== "break")
    .map((flight) => {
      const etdMinutes = timeToMinutes(flight.etd);
      return {
        id: flight.id,
        flightNumber: flight.flightNumber,
        gate: flight.gate,
        etd: flight.etd,
        eta: flight.eta,
        inboundEta: flight.inboundEta,
        aircraft: flight.aircraft,
        serviceType: flight.serviceType,
        loadWindowStart: minutesToTime(etdMinutes - LOAD_WINDOW_BEFORE_ETD),
        loadWindowEnd: minutesToTime(etdMinutes - LOAD_WINDOW_END_BEFORE_ETD),
        workloadUnits: workloadFor(flight.serviceType),
      };
    })
    .sort((a, b) => timeToMinutes(a.etd) - timeToMinutes(b.etd));
}

function buildCandidatePushes(flights: Flight[]): Push[] {
  const pushes: Push[] = [];
  let current: Flight[] = [];

  for (const flight of flights) {
    if (current.length === 0) {
      current = [flight];
      continue;
    }

    const firstEtd = timeToMinutes(current[0].etd);
    const nextEtd = timeToMinutes(flight.etd);
    const currentWorkload = current.reduce((total, item) => total + item.workloadUnits, 0);
    const canGroup = current.length < MAX_FLIGHTS_PER_PUSH && nextEtd - firstEtd <= GROUP_WINDOW_MINUTES && currentWorkload + flight.workloadUnits <= 4;

    if (canGroup) {
      current.push(flight);
    } else {
      pushes.push(createPush(pushes.length + 1, current));
      current = [flight];
    }
  }

  if (current.length > 0) pushes.push(createPush(pushes.length + 1, current));
  return pushes;
}

function createPush(pushNumber: number, flights: Flight[]): Push {
  const earliestLoadEnd = Math.min(...flights.map((flight) => timeToMinutes(flight.loadWindowEnd)));
  const serviceMinutes = flights.length * SERVICE_MINUTES_PER_FLIGHT;
  const totalDuration = PREP_MINUTES + DRIVE_OUT_MINUTES + serviceMinutes + RETURN_MINUTES;
  const departure = snapDown(earliestLoadEnd - DRIVE_OUT_MINUTES - serviceMinutes);
  const gateService = departure + PREP_MINUTES + DRIVE_OUT_MINUTES;
  const returnTime = departure + totalDuration;
  const needsHelper = flights.length >= 3 || flights.reduce((total, flight) => total + flight.workloadUnits, 0) >= 4;

  return { id: `P${String(pushNumber).padStart(3, "0")}`, driverId: null, helperId: needsHelper ? "needed" : null, truckId: null, flights, kitchenDepartureTime: minutesToTime(departure), gateServiceTime: minutesToTime(gateService), returnTime: minutesToTime(returnTime), totalDurationMinutes: totalDuration, exceptionFlags: [] };
}

function assignUnlimitedResources(pushes: Push[], drivers: Driver[], helpers: Helper[], trucks: Truck[]) {
  return assignPushes(pushes, createDriverPool(drivers), createHelperPool(helpers), createTruckPool(trucks), []);
}

function assignLimitedResources(pushes: Push[], drivers: Driver[], helpers: Helper[], trucks: Truck[], exceptions: ScheduleException[]) {
  return assignPushes(pushes, createDriverPool(drivers), createHelperPool(helpers), createTruckPool(trucks), exceptions);
}

function assignPushes(pushes: Push[], driverPool: ResourcePoolItem[], helperPool: ResourcePoolItem[], truckPool: ResourcePoolItem[], exceptions: ScheduleException[]) {
  return pushes.map((push) => assignResourcesToPush(push, driverPool, helperPool, truckPool, exceptions));
}

function assignResourcesToPush(push: Push, driverPool: ResourcePoolItem[], helperPool: ResourcePoolItem[], truckPool: ResourcePoolItem[], exceptions: ScheduleException[]): Push {
  const originalDeparture = timeToMinutes(push.kitchenDepartureTime);
  const driver = earliestAvailable(driverPool);
  const truck = earliestAvailable(truckPool);
  const helperNeeded = push.helperId === "needed";
  const helper = helperNeeded ? earliestAvailable(helperPool) : undefined;
  const assignedPush = { ...push, exceptionFlags: [...push.exceptionFlags] };

  if (!driver) markException(assignedPush, exceptions, "No driver available", "driver-shortage", "Add a driver or split later flights to another bank.");
  if (!truck) markException(assignedPush, exceptions, "No truck available", "truck-shortage", "Add a truck or delay a lower-priority push.");
  if (helperNeeded && !helper) markException(assignedPush, exceptions, "Helper needed but unavailable", "helper-shortage", "Assign a helper or split this push into smaller work.");

  const resourceReadyTime = Math.max(driver?.availableAt ?? originalDeparture, truck?.availableAt ?? originalDeparture, helperNeeded ? helper?.availableAt ?? originalDeparture : originalDeparture);
  const actualDeparture = snapUp(Math.max(originalDeparture, resourceReadyTime));
  const delay = actualDeparture - originalDeparture;
  if (delay > 0) shiftPush(assignedPush, delay);

  const latestLoadEnd = Math.min(...assignedPush.flights.map((flight) => timeToMinutes(flight.loadWindowEnd)));
  const serviceEnd = timeToMinutes(assignedPush.gateServiceTime) + assignedPush.flights.length * SERVICE_MINUTES_PER_FLIGHT;
  if (serviceEnd > latestLoadEnd) markException(assignedPush, exceptions, "Food safety/load window risk", "food-safety-window", "Move one flight to another push or add resources.");

  if (driver) { assignedPush.driverId = driver.id; driver.availableAt = timeToMinutes(assignedPush.returnTime); }
  if (truck) { assignedPush.truckId = truck.id; truck.availableAt = timeToMinutes(assignedPush.returnTime); }
  if (helperNeeded && helper) { assignedPush.helperId = helper.id; helper.availableAt = timeToMinutes(assignedPush.returnTime); } else if (!helperNeeded) { assignedPush.helperId = null; }
  return assignedPush;
}

function createDriverPool(drivers: Driver[]) { return drivers.map((driver) => ({ id: driver.id, availableAt: timeToMinutes(driver.shiftStart) })); }
function createHelperPool(helpers: Helper[]) { return helpers.map((helper) => ({ id: helper.id, availableAt: timeToMinutes(helper.shiftStart) })); }
function createTruckPool(trucks: Truck[]) { return trucks.map((truck) => ({ id: truck.id, availableAt: 0 })); }
function earliestAvailable(pool: ResourcePoolItem[]) { return pool.length === 0 ? undefined : pool.reduce((earliest, item) => (item.availableAt < earliest.availableAt ? item : earliest)); }

function markException(push: Push, exceptions: ScheduleException[], issue: string, cause: ScheduleException["cause"], recommendedAction: string) {
  push.exceptionFlags.push(issue);
  for (const flight of push.flights) {
    exceptions.push({ id: `${push.id}-${flight.id}-${cause}`, flightId: flight.id, flightNumber: flight.flightNumber, pushId: push.id, issue, cause, recommendedAction });
  }
}

function shiftPush(push: Push, delayMinutes: number) {
  push.kitchenDepartureTime = minutesToTime(timeToMinutes(push.kitchenDepartureTime) + delayMinutes);
  push.gateServiceTime = minutesToTime(timeToMinutes(push.gateServiceTime) + delayMinutes);
  push.returnTime = minutesToTime(timeToMinutes(push.returnTime) + delayMinutes);
}

function buildResult(mode: "planning" | "dispatch", pushes: Push[], exceptions: ScheduleException[]): ScheduleResult {
  const exceptionFlightIds = new Set(exceptions.map((item) => item.flightId).filter(Boolean));
  const allFlights = pushes.flatMap((push) => push.flights);
  const driverIds = new Set(pushes.map((push) => push.driverId).filter(Boolean));
  const helperIds = new Set(pushes.map((push) => push.helperId).filter(Boolean));
  const bottlenecks = [...new Set(exceptions.map((item) => humanCause(item.cause)))];

  return { mode, pushes, exceptions, summary: { totalFlights: allFlights.length, totalPushes: pushes.length, driversRequired: driverIds.size, helpersRequired: helperIds.size, maxTrucksRequired: maxConcurrentPushes(pushes), flightsScheduledNormally: allFlights.length - exceptionFlightIds.size, flightsWithExceptions: exceptionFlightIds.size, unscheduledFlights: pushes.filter((push) => !push.driverId || !push.truckId).flatMap((push) => push.flights).length }, resourceBottlenecks: bottlenecks };
}

function maxConcurrentPushes(pushes: Push[]) {
  let max = 0;
  for (const push of pushes) {
    const active = pushes.filter((other) => timeToMinutes(other.kitchenDepartureTime) < timeToMinutes(push.returnTime) && timeToMinutes(other.returnTime) > timeToMinutes(push.kitchenDepartureTime)).length;
    max = Math.max(max, active);
  }
  return max;
}

function workloadFor(serviceType: ServiceType) {
  if (serviceType === "load-ua") return 1.5;
  if (serviceType === "load-other") return 1.25;
  if (serviceType === "unplanned") return 1.5;
  return 1;
}

function humanCause(cause: ScheduleException["cause"]) {
  return { "driver-shortage": "Driver shortage", "helper-shortage": "Helper shortage", "truck-shortage": "Truck shortage", "timing-conflict": "Timing conflict", "food-safety-window": "Food safety window issue" }[cause];
}

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const normalized = Math.max(0, totalMinutes);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function snapDown(minutes: number) { return Math.floor(minutes / BLOCK_MINUTES) * BLOCK_MINUTES; }
function snapUp(minutes: number) { return Math.ceil(minutes / BLOCK_MINUTES) * BLOCK_MINUTES; }
