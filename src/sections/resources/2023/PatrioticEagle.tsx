import { Heading, List, Text } from "@chakra-ui/react";
import {
  canAdventure,
  canEquip,
  myFamiliar,
  myLocation,
  myPath,
  Phylum,
} from "kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $location,
  $monster,
  $path,
  get,
  getMonsterLocations,
  have,
  questStep,
} from "libram";
import { ReactNode } from "react";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { questFinished } from "../../../util/quest";
import { plural } from "../../../util/text";

const PLEDGE_ZONES: readonly {
  effect: string;
  locations: Record<string, string>;
}[] = [
  {
    effect: "+30% item",
    locations: {
      "The Haunted Library": "Haunted Library",
      "The Haunted Laundry Room": "Haunted Laundry Room",
      "Whitey's Grove": "Whitey's Grove",
    },
  },
  {
    effect: "+50% meat",
    locations: {
      "Lair of the Ninja Snowmen": "Ninja Snowmen Lair",
      "The Hidden Hospital": "Hidden Hospital",
      "The Haunted Bathroom": "Haunted Bathroom",
      "The Oasis": "the Oasis",
    },
  },
  {
    effect: "+100% init",
    locations: {
      "The Haunted Kitchen": "Haunted Kitchen",
      "Oil Peak": "Oil Peak",
      "An Unusually Quiet Barroom Brawl": "Oliver's Tavern",
    },
  },
];

const PLEDGE_ZONES_ALL: Record<string, [string, string]> = {};
for (const { effect, locations } of PLEDGE_ZONES) {
  for (const [longName, shortName] of Object.entries(locations)) {
    PLEDGE_ZONES_ALL[longName] = [effect, shortName];
  }
}

const generatePledgeZones = (
  locations: [string, string][],
  effect: string,
): ReactNode => {
  const available = locations.filter(([loc]) =>
    canAdventure($location`${loc}`),
  );
  return (
    available.length > 0 && (
      <Line key={effect}>
        <Text as="b">{effect}:</Text>{" "}
        {available.map(([name]) => name).join(", ")}
      </Line>
    )
  );
};

const generatePhylumOptions = (
  phylum: string,
  options: [string, string, boolean][],
): ReactNode => {
  const available = options.filter(
    ([, loc, useful]) => canAdventure($location`${loc}`) && useful,
  );
  return (
    available.length > 0 && (
      <List.Item key={phylum}>
        <Text as="b">{phylum}:</Text>{" "}
        {available.map(([name]) => name).join(", ")}
      </List.Item>
    )
  );
};

const PatrioticEagle = () => {
  const patrioticEagle = $familiar`Patriotic Eagle`;
  const haveEagle = haveUnrestricted(patrioticEagle);
  const withEagle = myFamiliar() === patrioticEagle;
  const rwbMonster = get("rwbMonster");
  const fightsLeft = Math.max(0, Math.min(get("rwbMonsterCount"), 2));
  const screechRecharge = get("screechCombats");
  const eaglePhylumBanished = Phylum.get(get("banishedPhyla").split(":")[0]);
  const citizenOfAZone = $effect`Citizen of a Zone`;
  const haveCitizen = have(citizenOfAZone);
  const canUseCitizen =
    !haveCitizen && canEquip(patrioticEagle) && myPath() !== $path`Avant Guard`;
  const location = myLocation();
  const pledgeZone = PLEDGE_ZONES_ALL[location.identifierString] ?? [];
  const [pledgeZoneEffect, pledgeZoneName] = pledgeZone;

  useNag(
    () => ({
      id: "patriotic-eagle-pledge-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl: "/images/itemimages/flag1.gif",
      node: haveEagle &&
        canUseCitizen &&
        pledgeZoneEffect &&
        pledgeZoneName && (
          <Tile
            header="Pledge to a zone!"
            imageUrl="/images/itemimages/flag1.gif"
            linkedContent={patrioticEagle}
          >
            {!withEagle && <Line>Take your Patriotic Eagle with you.</Line>}
            <Line>
              Pledge allegiance to <Text as="b">{pledgeZoneName}</Text> for{" "}
              {pledgeZoneEffect}.
            </Line>
          </Tile>
        ),
    }),
    [
      canUseCitizen,
      haveEagle,
      patrioticEagle,
      pledgeZoneEffect,
      pledgeZoneName,
      withEagle,
    ],
  );

  if (!haveEagle) return null;

  const possibleAppearanceLocations = rwbMonster
    ? getMonsterLocations(rwbMonster).filter((location) =>
        canAdventure(location),
      )
    : [];

  const pledgeZones = PLEDGE_ZONES.map(({ effect, locations }) =>
    generatePledgeZones(Object.entries(locations), effect),
  );

  const phylumOptions = [
    generatePhylumOptions("Dude", [
      [
        "Black Forest (2/5)",
        "The Black Forest",
        questStep("questL11Black") < 2,
      ],
      ["Twin Peak (5/8)", "Twin Peak", get("twinPeakProgress") < 15],
      ["Whitey's Grove (1/4)", "Whitey's Grove", true],
    ]),
    generatePhylumOptions("Beast", [
      [
        "Hidden Park (1/4)",
        "The Hidden Park",
        !have($item`antique machete`) && !have($item`muculent machete`),
      ],
      [
        "Palindome (3/7)",
        "Inside the Palindome",
        get("palindomeDudesDefeated") < 5,
      ],
      [
        "Airship (2/7)",
        "The Penultimate Fantasy Airship",
        questStep("questL10Garbage") < 7,
      ],
    ]),
    generatePhylumOptions("Construct", [
      ["Whitey's Grove (1/4)", "Whitey's Grove", true],
      [
        "Airship (1/7)",
        "The Penultimate Fantasy Airship",
        questStep("questL10Garbage") < 7,
      ],
    ]),
    generatePhylumOptions("Undead", [
      [
        "Haunted Library (1/3)",
        "The Haunted Library",
        get("writingDesksDefeated") < 5,
      ],
      ["Red Zeppelin (1/5)", "The Red Zeppelin", questStep("questL11Ron") < 4],
      [
        "Haunted Wine Cellar (1/3)",
        "The Haunted Wine Cellar",
        questStep("questL11Manor") < 3,
      ],
      [
        "Haunted Boiler (1/3)",
        "The Haunted Boiler Room",
        questStep("questL11Manor") < 3,
      ],
      [
        "Pyramid Middle (1/3)",
        "The Middle Chamber",
        !questFinished("questL11Pyramid"),
      ],
    ]),
  ];

  const showRwb = rwbMonster && rwbMonster !== $monster`none` && fightsLeft > 0;
  const showPhylum = phylumOptions.some((node) => node);
  const showPledge = !have(citizenOfAZone) && pledgeZones.some((node) => node);

  if (!showRwb && !showPhylum && !showPledge) return null;

  return (
    <Tile linkedContent={patrioticEagle}>
      {showRwb && (
        <>
          <Heading as="h4" size="xs">
            Fight {plural(fightsLeft, `more ${rwbMonster}`)}
          </Heading>
          <Line>
            Copied by your eagle's blast. Will appear when you adventure in{" "}
            {possibleAppearanceLocations.join(", ")}.
          </Line>
          {rwbMonster?.phylum === eaglePhylumBanished && (
            <Line color="red.500">
              <Text as="b">WARNING!</Text> This monster will not appear, it's
              banished by your eagle screech!
            </Line>
          )}
        </>
      )}
      {showPhylum && (
        <>
          <Heading as="h4" size="xs">
            {screechRecharge > 0 ? (
              `${screechRecharge} combats (or freeruns) until your Patriotic Eagle can screech again.`
            ) : (
              <>
                Patriotic Eagle can screech and banish an entire phylum!{" "}
                {screechRecharge === 0 && (
                  <>
                    <Text as="span" color="red.500">
                      SCREEEE
                    </Text>
                    <Text as="span" color="gray.500">
                      EEEEE
                    </Text>
                    <Text as="span" color="blue.500">
                      EEEEE!
                    </Text>
                  </>
                )}
              </>
            )}
          </Heading>
          <List.Root>{phylumOptions}</List.Root>
        </>
      )}
      {showPledge && (
        <>
          <Line>
            <Text as="span" color="red.500">
              Pledge
            </Text>{" "}
            <Text as="span" color="gray.500">
              allegiance
            </Text>{" "}
            <Text as="span" color="blue.500">
              to a zone!
            </Text>
          </Line>
          {pledgeZones}
        </>
      )}
    </Tile>
  );
};

export default PatrioticEagle;
