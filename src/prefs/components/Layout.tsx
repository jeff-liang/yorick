import { Button, Container, Heading, Stack } from "@chakra-ui/react";
import { Effect, Item, Location } from "kolmafia";
import { KnownProperty } from "libram";
import { ChangeEvent, FC, useCallback, useContext, useState } from "react";
import { makePlaceholder, remoteCall } from "tome-kolmafia-lib";
import { RefreshContext } from "tome-kolmafia-react";

import { fireStorageListeners } from "../../hooks/useLocalStorage";
import effects from "../data/effects.json";
import items from "../data/items.json";
import locationsNoncombatQueue from "../data/noncombatQueue.json";
import preferences from "../data/preferences.json";
import locationsTurnsSpent from "../data/turnsSpent.json";
import { overrideName } from "../util/overrides";

import OverrideTable from "./OverrideTable";
import ValidatedInput from "./ValidatedInput";

interface GenericTableProps {
  filterRegex: RegExp | null;
}

const PreferencesTable: FC<GenericTableProps> = ({ filterRegex }) => (
  <OverrideTable
    heading="Preferences"
    filterRegex={filterRegex}
    data={preferences as KnownProperty[]}
    getOverride={(property) => overrideName("getProperty", [property])}
    getCurrent={(property) => remoteCall("getProperty", [property], "", true)}
  />
);

const TurnsSpentTable: FC<GenericTableProps> = ({ filterRegex }) => (
  <OverrideTable
    heading="Turns Spent"
    filterRegex={filterRegex}
    data={locationsTurnsSpent}
    getOverride={(location) =>
      `override:Location.get(${JSON.stringify(location)}).turnsSpent`
    }
    getCurrent={(location) =>
      remoteCall<Location>(
        "toLocation",
        [location],
        {} as Location,
        true,
      )?.turnsSpent?.toString() ?? ""
    }
  />
);

const NoncombatQueueTable: FC<GenericTableProps> = ({ filterRegex }) => (
  <OverrideTable
    heading="Noncombat Queue"
    filterRegex={filterRegex}
    data={locationsNoncombatQueue}
    getOverride={(location) =>
      `override:Location.get(${JSON.stringify(location)}).noncombatQueue`
    }
    getCurrent={(location) =>
      remoteCall<Location>(
        "toLocation",
        [location],
        {} as Location,
        true,
      )?.noncombatQueue?.toString() ?? ""
    }
  />
);

const ItemsTable: FC<GenericTableProps> = ({ filterRegex }) => (
  <OverrideTable
    heading="Items"
    filterRegex={filterRegex}
    data={items.filter((item) => Item.get(item))}
    getOverride={(item) =>
      `override:availableAmount(Item.get(${JSON.stringify(item)}))`
    }
    getCurrent={(item) =>
      remoteCall<number>(
        "availableAmount",
        [makePlaceholder("Item", item)],
        0,
        true,
      )?.toString?.()
    }
  />
);

const EffectsTable: FC<GenericTableProps> = ({ filterRegex }) => (
  <OverrideTable
    heading="Effects"
    filterRegex={filterRegex}
    data={effects.filter((effect) => Effect.get(effect))}
    getOverride={(effect) =>
      `override:haveEffect(Effect.get(${JSON.stringify(effect)}))`
    }
    getCurrent={(effect) =>
      remoteCall<number>(
        "haveEffect",
        [makePlaceholder("Effect", effect)],
        0,
        true,
      )?.toString?.()
    }
  />
);

function resetAll() {
  const overrideKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("override:")) {
      overrideKeys.push(key);
    }
  }
  for (const key of overrideKeys) {
    localStorage.removeItem(key);
    fireStorageListeners(key, null);
  }
}

const Layout = () => {
  useContext(RefreshContext);
  const [filter, setFilter] = useState("");
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setFilter(event.target.value),
    [],
  );
  let filterRegex: RegExp | null = null,
    filterValid = true;
  try {
    filterRegex = new RegExp(filter, "i");
  } catch {
    filterValid = false;
  }
  return (
    <Container centerContent maxW={1000}>
      <Stack gap={4} w="full" align="center">
        <Heading textAlign="center">YORICK Development Overrides</Heading>
        <ValidatedInput
          value={filter}
          changeValue={setFilter}
          valid={filterValid}
          onChange={handleChange}
          placeholder="Filter (regex)"
          size="sm"
          minW="20rem"
        />
        <Button variant="outline" onClick={resetAll}>
          Reset All
        </Button>
        <Stack direction="row" align="flex-start" justify="center">
          <Stack>
            <PreferencesTable filterRegex={filterRegex} />
            <TurnsSpentTable filterRegex={filterRegex} />
            <NoncombatQueueTable filterRegex={filterRegex} />
          </Stack>
          <Stack>
            <ItemsTable filterRegex={filterRegex} />
            <EffectsTable filterRegex={filterRegex} />
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Layout;
