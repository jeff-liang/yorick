import { HStack, Progress } from "@chakra-ui/react";
import { $item, get, have } from "libram";

const Flyers: React.FC = () => {
  const flyeredMl = get("flyeredML");
  const flyersActive =
    (have($item`rock band flyers`) || have($item`jam band flyers`)) &&
    flyeredMl < 10000 &&
    get("sidequestArenaCompleted") === "none";

  if (!flyersActive) return null;

  return (
    <Progress.Root min={0} max={10000} value={flyeredMl} maxW="sm" size="lg">
      <HStack gap={5}>
        <Progress.Label>Flyers:</Progress.Label>
        <Progress.Track flex="1">
          <Progress.Range />
        </Progress.Track>
        <Progress.ValueText>{flyeredMl}/10000</Progress.ValueText>
      </HStack>
    </Progress.Root>
  );
};

export default Flyers;
