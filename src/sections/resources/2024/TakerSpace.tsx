import { List } from "@chakra-ui/react";
import { getWorkshed } from "kolmafia";
import { $item, get } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inventoryLink } from "../../../util/links";
import { commaAnd, plural } from "../../../util/text";

interface Supplies {
  spice: number;
  rum: number;
  anchor: number;
  mast: number;
  silk: number;
  gold: number;
}

type Supply = keyof Supplies;

const TakerSpace: FC = () => {
  const takerSpace = $item`TakerSpace letter of Marque`;
  const takerSpaceInstalled = getWorkshed() === takerSpace;
  const supplies: Supplies = {
    spice: get("takerSpaceSpice") + +!get("_takerSpaceSuppliesDelivered") * 3,
    rum: get("takerSpaceRum") + +!get("_takerSpaceSuppliesDelivered") * 3,
    anchor: get("takerSpaceAnchor") + +!get("_takerSpaceSuppliesDelivered") * 3,
    mast: get("takerSpaceMast") + +!get("_takerSpaceSuppliesDelivered") * 3,
    silk: get("takerSpaceSilk") + +!get("_takerSpaceSuppliesDelivered") * 1,
    gold: get("takerSpaceGold") + +!get("_takerSpaceSuppliesDelivered") * 1,
  };

  if (
    !haveUnrestricted(takerSpace) ||
    (!takerSpaceInstalled && get("_workshedItemUsed"))
  ) {
    return null;
  }

  const makeableItems: { name: string; ingredients: Partial<Supplies> }[] = [
    { name: "pirate dinghy", ingredients: { anchor: 1, mast: 1, silk: 1 } },
    { name: "deft pirate hook", ingredients: { anchor: 1, mast: 1, gold: 1 } },
    {
      name: "anchor bomb",
      ingredients: { anchor: 3, rum: 1, mast: 1, gold: 1 },
    },
    { name: "groggles", ingredients: { rum: 6 } },
    { name: "silky pirate drawers", ingredients: { silk: 2 } },
    { name: "tankard of spiced rum", ingredients: { spice: 1, rum: 2 } },
    { name: "cursed Aztec tamale", ingredients: { spice: 2 } },
  ].filter((item) => {
    return Object.entries(item.ingredients).every(
      ([key, value]) => supplies[key as Supply] >= value,
    );
  });

  return (
    <Tile
      header="TakerSpace"
      linkedContent={takerSpace}
      href={
        takerSpaceInstalled
          ? "/campground.php?action=workshed"
          : inventoryLink(takerSpace)
      }
    >
      <Line>
        Current Supplies:{" "}
        {commaAnd([
          supplies.spice && plural(supplies.spice, "stolen spice"),
          supplies.rum && `${supplies.rum} robbed rum`,
          supplies.anchor && plural(supplies.anchor, "absconded-with anchor"),
          supplies.mast && plural(supplies.mast, "misappropriated mainmast"),
          supplies.silk && plural(supplies.silk, "snatched silk"),
          supplies.gold && plural(supplies.gold, "gaffled gold"),
        ])}
        .
      </Line>
      {makeableItems.length > 0 && (
        <>
          <Line>Can make:</Line>
          <List.Root>
            {makeableItems.map((item) => (
              <List.Item key={item.name}>{item.name}</List.Item>
            ))}
          </List.Root>
        </>
      )}
    </Tile>
  );
};

export default TakerSpace;
