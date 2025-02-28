import { HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";
import { Info } from "lucide-react";
import { FC } from "react";

import AdviceTooltip from "./AdviceTooltip";

interface AdviceTooltipIconProps {
  advice: string;
  icon?: typeof Info;
}
/**
 * A tooltip generated on an icon hoverover with a skull that states whatever text you want for the player.
 * @param props.text The text you want displayed in this tooltip.
 * @param props.icon (optional) Defaults to a filled-in ? info icon. Can be any icon within chakra-ui/icon.
 * @returns A FC Tooltip object where the displayed icon generates the tooltip on hoverover.
 */

const AdviceTooltipIcon: FC<AdviceTooltipIconProps> = ({
  advice,
  icon: TooltipIcon = Info,
}) => {
  const toolTip = (
    <HStack px={2}>
      <Image
        src={"/images/itemimages/yorick.gif"}
        alt={"Yorick, the Skeleton"}
        boxSize="30px"
        fit="contain"
      />
      <VStack align="stretch" gap={0.3}>
        <Text bg="bg.muted" p={4} color="fg.muted" rounded="md" fontSize="xs">
          {advice}
        </Text>
      </VStack>
    </HStack>
  );

  return (
    <AdviceTooltip content={toolTip}>
      <Icon color="gray.solid" h={3.5} w={3.5}>
        <TooltipIcon />
      </Icon>
    </AdviceTooltip>
  );
};

export default AdviceTooltipIcon;
