import { List } from "@chakra-ui/react";
import { getProperty } from "kolmafia";
import { $skill, get } from "libram";

import ChevronsListIcon from "../../../components/ChevronsListIcon";
import MainLink from "../../../components/MainLink";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { skillLink } from "../../../util/links";
import { plural } from "../../../util/text";

/**
 * Summarizes availability of buffs & nostalgia; no recommendations, and Hatred is covered in banishes.
 * @returns A tile describing Emotion Chip skills (except Hatred!)
 */

const EmotionChip = () => {
  const playerIsChipped = haveUnrestricted($skill`Emotionally Chipped`);
  const nostalgiaMonster = getProperty("lastCopyableMonster");

  // Associating skills with the # remaining of each of them.
  const emoChipSkills = {
    "Lonely (NC)": 3 - get("_feelLonelyUsed"),
    "Peaceful (res)": 3 - get("_feelPeacefulUsed"),
    "Envy (all drops)": 3 - get("_feelEnvyUsed"),
    "Nostalgic (copy drops)": 3 - get("_feelNostalgicUsed"),
    "Pride (stats)": 3 - get("_feelPrideUsed"),
  };

  // Turning the skills into list items w/ chevron coloring based on # left
  const listItems = Object.entries(emoChipSkills).map(
    ([skillDescription, casts]) => {
      const text = `${plural(casts, "Feel")} ${skillDescription}${
        skillDescription === "Nostalgic (copy drops)"
          ? ` [${nostalgiaMonster}]`
          : ""
      }`;
      const skillName = `Feel ${skillDescription.split(" ")[0]}`;
      return (
        <List.Item
          key={skillDescription}
          pl="1"
          display="flex"
          color={casts === 0 ? "gray.solid" : undefined}
        >
          <ChevronsListIcon
            usesLeft={casts}
            totalUses={3}
            marginInlineEnd={1}
          />
          {casts === 0 ? (
            text
          ) : (
            <MainLink
              href={
                ["Feel Peaceful", "Feel Lonely"].includes(skillName)
                  ? skillLink(skillName)
                  : undefined
              }
            >
              {text}
            </MainLink>
          )}
        </List.Item>
      );
    },
  );

  if (!playerIsChipped) {
    return null;
  }

  // To-Do list for this tile:
  //   - Determine if we actually want Feel Lost visualized. I think not!
  //   - My lean is to not include hatred and leave it for the banish tile I'm making.
  return (
    <Tile header="Emotion Chip" imageUrl="/images/itemimages/emochip1.gif">
      <List.Root>{listItems}</List.Root>
    </Tile>
  );
};

export default EmotionChip;
