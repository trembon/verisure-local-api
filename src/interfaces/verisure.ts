export interface VerisureRoot {
  installation: Installation;
}

export interface Installation {
  alias: string;
  locale: string;
  climates: Climate[];
  armState: ArmState;
  doorWindows: DoorWindow[];
  __typename: string;
}

export interface Climate {
  device: Device;
  humidityEnabled: boolean;
  humidityTimestamp: string;
  humidityValue: number;
  temperatureTimestamp: string;
  temperatureValue: number;
  __typename: string;
}

export interface Device {
  deviceLabel: string;
  area: string;
  gui: Gui;
  __typename: string;
}

export interface Gui {
  label: string;
  __typename: string;
  support?: string; // only present for doorWindows.gui
}

export interface ArmState {
  type: string | null;
  statusType: string;
  date: string;
  name: string | null;
  changedVia: string;
  __typename: string;
}

export interface DoorWindow {
  device: Device;
  type: string | null;
  state: string;
  wired: boolean;
  reportTime: string;
  __typename: string;
}
