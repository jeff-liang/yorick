import { ButtonProps } from "@chakra-ui/react";
import { mpCost, myHash, myMp, Skill } from "kolmafia";
import { FC } from "react";

import HeaderButton from "./HeaderButton";

interface SkillButtonsProps extends ButtonProps {
  linkedContent: Skill;
}

const SkillButtons: FC<SkillButtonsProps> = ({
  linkedContent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick,
  ...props
}) => {
  const linkID = linkedContent.id;

  return (
    <HeaderButton
      href={`/runskillz.php?action=Skillz&whichskill=${linkID}&targetplayer=0&pwd=${myHash()}&quantity=1`}
      disabled={myMp() < mpCost(linkedContent)}
      {...props}
    >
      cast
    </HeaderButton>
  );
};

export default SkillButtons;
