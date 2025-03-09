import { List } from "@chakra-ui/react";
import { Item, totalTurnsPlayed } from "kolmafia";
import { $item, clamp, get, Leprecondo as LeprecondoLibram } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { inventoryActionLink } from "../../../util/links";
import { commaOr, plural } from "../../../util/text";

const Leprecondo = () => {
  const leprecondo = $item`Leprecondo`;
  const haveLeprecondo = haveUnrestricted(leprecondo);

  const rearrangesLeft = LeprecondoLibram.rearrangesRemaining();
  const nextNeedCheck =
    clamp(totalTurnsPlayed() - get("leprecondoLastNeedChange"), 0, 4) % 5;
  const needOrder = LeprecondoLibram.needOrder();
  const currentNeed = LeprecondoLibram.currentNeed();
  const needIndex = needOrder.indexOf(currentNeed);
  const unusedNeeds = LeprecondoLibram.NEEDS.filter(
    (need) => !needOrder.includes(need),
  );
  const nextNeedPossibilities =
    needIndex >= 0 && needIndex + 1 < needOrder.length
      ? [needOrder[needIndex + 1]]
      : unusedNeeds;

  const bonuses = LeprecondoLibram.furnitureBonuses();
  const nextBenefits = nextNeedPossibilities.map(
    (need): [LeprecondoLibram.Need, LeprecondoLibram.Result | undefined] => [
      need,
      bonuses[need],
    ],
  );

  useNag(
    () => ({
      id: "leprecondo-setup-nag",
      priority: NagPriority.LOW,
      imageUrl: "/images/itemimages/leprecondo.gif",
      node: haveLeprecondo && rearrangesLeft === 3 && (
        <Tile
          header="Set up Leprecondo"
          imageUrl="/images/itemimages/leprecondo.gif"
          href={inventoryActionLink("leprecondo")}
          linkEntireTile
        >
          Install furniture in your Leprecondo for bonuses.
        </Tile>
      ),
    }),
    [haveLeprecondo, rearrangesLeft],
  );

  if (!haveLeprecondo) return null;

  return (
    <Tile
      header="Leprecondo"
      imageUrl="/images/itemimages/leprecondo.gif"
      href="/inv_use.php?whichitem=11861"
    >
      <Line>
        Next need check in {plural(nextNeedCheck, "turn")}. Possibilities:
      </Line>
      <List.Root>
        {nextBenefits.map(
          ([need, bonus]) =>
            bonus && (
              <List.Item key={need}>
                {bonus instanceof Item
                  ? `${bonus.identifierString}.`
                  : Array.isArray(bonus)
                    ? `${commaOr(bonus)}.`
                    : `${bonus.effect.identifierString} (${bonus.duration} turns).`}
              </List.Item>
            ),
        )}
      </List.Root>

      {rearrangesLeft > 0 && (
        <Line>
          {plural(rearrangesLeft, "furniture rearrangement")} remaining today.
        </Line>
      )}
    </Tile>
  );
};

export default Leprecondo;
