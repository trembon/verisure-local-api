import {
  ArmState,
  Climate,
  DoorWindow,
  VerisureRoot,
} from "./interfaces/verisure";

export interface Updates {
  climates: UpdatedClimate[];
  armStates: ArmState[];
  doorWindows: DoorWindow[];
}

export interface UpdatedClimate {
  id: string;
  value: number;
  type: string;
  timestamp: string;
}

export function detectUpdates(
  oldData: VerisureRoot,
  newData: VerisureRoot
): Updates {
  const updates: Updates = {
    climates: [],
    armStates: [],
    doorWindows: [],
  };

  const oldInstallation = oldData.installation;
  const newInstallation = newData.installation;

  // --- Climates ---
  for (const newClimate of newInstallation.climates) {
    const oldClimate = oldInstallation.climates.find(
      (c) => c.device.deviceLabel === newClimate.device.deviceLabel
    );
    if (!oldClimate) {
      // new device
      updates.climates.push({
        id: newClimate.device.deviceLabel,
        value: newClimate.humidityValue,
        type: "humidity",
        timestamp: newClimate.humidityTimestamp,
      });
      updates.climates.push({
        id: newClimate.device.deviceLabel,
        value: newClimate.temperatureValue,
        type: "temperature",
        timestamp: newClimate.temperatureTimestamp,
      });
      continue;
    }

    // compare timestamps
    if (
      newClimate.humidityEnabled &&
      newClimate.humidityTimestamp !== oldClimate.humidityTimestamp
    ) {
      updates.climates.push({
        id: newClimate.device.deviceLabel,
        value: newClimate.humidityValue,
        type: "humidity",
        timestamp: newClimate.humidityTimestamp,
      });
    }
    if (newClimate.temperatureTimestamp !== oldClimate.temperatureTimestamp) {
      updates.climates.push({
        id: newClimate.device.deviceLabel,
        value: newClimate.temperatureValue,
        type: "temperature",
        timestamp: newClimate.temperatureTimestamp,
      });
    }
  }

  // --- ArmState ---
  if (newInstallation.armState.date !== oldInstallation.armState.date) {
    updates.armStates.push(newInstallation.armState);
  }

  // --- DoorWindows ---
  for (const newDW of newInstallation.doorWindows) {
    const oldDW = oldInstallation.doorWindows.find(
      (dw) => dw.device.deviceLabel === newDW.device.deviceLabel
    );
    if (!oldDW) {
      updates.doorWindows.push(newDW); // new device
      continue;
    }

    if (newDW.reportTime !== oldDW.reportTime) {
      updates.doorWindows.push(newDW);
    }
  }

  return updates;
}
