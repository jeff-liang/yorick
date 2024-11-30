import { Item, myDaycount, myPath } from "kolmafia";
import { $effect, $item, $location, $path, have, questStep } from "libram";
import { FC } from "react";

import AdviceTooltipIcon from "../../../components/AdviceTooltipIcon";
import Line from "../../../components/Line";
import MainLink from "../../../components/MainLink";
import QuestTile from "../../../components/QuestTile";
import { currentSnake, SHEN_DAYS } from "../../../questInfo/copperhead";
import { inventoryLink, parentPlaceLink } from "../../../util/links";
import { atStep, questFinished, Step } from "../../../util/quest";
import { commaList } from "../../../util/text";

const Copperhead: FC = () => {
  const step = questStep("questL11Shen");

  if (step === Step.FINISHED) {
    return null;
  }

  const { locations, item } = currentSnake() ?? {};

  const copperhead = $location`The Copperhead Club`;
  const copperheadTurns = copperhead.turnsSpent;

  const shenMeetings =
    atStep(step, [
      [1, 1],
      [3, 2],
      [5, 3],
    ]) ?? 0;
  const turnsUntilMeeting = (shenMeetings + 1) * 5 - copperheadTurns;

  const disguised = have($effect`Crappily Disguised as a Waiter`);
  const couldUseDisguise =
    !disguised &&
    have($item`crappy waiter disguise`) &&
    myPath() !== $path`Two Crazy Random Summer`;

  if (step === Step.FINISHED) return null;

  return (
    <QuestTile
      header="Beat Shen Copperhead"
      minLevel={11}
      imageUrl="/images/itemimages/scharm2.gif"
      imageAlt="Shen Copperhead"
      disabled={!questFinished("questL11Black")}
    >
      {atStep(step, [
        [
          Step.STARTED,
          <>
            <Line href={parentPlaceLink(copperhead)}>
              Go meet Shen in the Copperhead Club.
            </Line>
            <Line>
              If you meet him today, you will have to go to{" "}
              {commaList(
                (SHEN_DAYS[(myDaycount() - 1) % SHEN_DAYS.length] ?? []).map(
                  (snake) => snake.locations[0].identifierString,
                ),
                "and",
              )}
              .
            </Line>
          </>,
        ],
        [
          1,
          <>
            {item && !have(Item.get(item)) ? (
              <Line
                href={locations ? parentPlaceLink(locations[0]) : undefined}
              >
                Adventure in{" "}
                {locations?.map((l) => l.identifierString).join(" or ")} to find{" "}
                {item}.
              </Line>
            ) : (
              <Line href={parentPlaceLink(copperhead)}>
                Return {item} to Shen.
              </Line>
            )}
            {copperheadTurns < 14 && (
              <Line>
                <MainLink href={parentPlaceLink(copperhead)}>
                  Or work on burning {14 - (3 - shenMeetings) - copperheadTurns}{" "}
                  turns of delay in the Copperhead Club.
                </MainLink>{" "}
                <AdviceTooltipIcon advice="This delay count does not include the meetings with Shen." />
              </Line>
            )}
            {copperheadTurns === 14 && shenMeetings === 3 && (
              <Line
                href={
                  couldUseDisguise
                    ? inventoryLink($item`crappy waiter disguise`)
                    : parentPlaceLink(copperhead)
                }
              >
                50% chance of meeting Shen this turn.
                {couldUseDisguise &&
                  "Use a crappy waiter disguise for 25% chance of a turn saved."}
              </Line>
            )}
            {turnsUntilMeeting <= 0 && (!item || have(Item.get(item))) && (
              <Line href={parentPlaceLink(copperhead)}>
                Meet Shen next turn{" "}
                {shenMeetings === 3
                  ? "(last meeting)"
                  : `(meeting ${shenMeetings + 1})`}
                .
              </Line>
            )}
          </>,
        ],
      ])}
    </QuestTile>
  );
};

export default Copperhead;
