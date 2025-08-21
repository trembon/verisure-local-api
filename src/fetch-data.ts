import { Verisure, Installation } from "verisure";
import { VerisureRoot } from "./interfaces/verisure";

export async function fetchInstallation(
  verisure: Verisure
): Promise<Installation> {
  const installations = await verisure.getInstallations();
  return installations[0];
}

export async function queryInstallation(
  verisureInstallation: Installation
): Promise<VerisureRoot> {
  const result = await verisureInstallation.client({
    operationName: "Overview",
    query: `query Overview($giid: String!) {
      installation(giid: $giid) {
        alias
        locale

        climates {
          device {
            deviceLabel
            area
            gui {
              label
              __typename
            }
            __typename
          }
          humidityEnabled
          humidityTimestamp
          humidityValue
          temperatureTimestamp
          temperatureValue
          __typename
        }

        armState {
          type
          statusType
          date
          name
          changedVia
          __typename
        }

        doorWindows {
          device {
            deviceLabel
            area
            gui {
              support
              label
              __typename
            }
            __typename
          }
          type
          state
          wired
          reportTime
          __typename
        }

        __typename
      }
    }`,
  });
  return result as VerisureRoot;
}
