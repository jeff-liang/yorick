import { ButtonProps } from "@chakra-ui/react";
import { Familiar, Item, Skill } from "kolmafia";
import { have } from "libram";
import { FC } from "react";

import FamiliarButtons from "./FamiliarButtons";
import ItemButtons from "./ItemButtons";
import DynamicSkillLinks from "./SkillButtons";

interface ContentButtonsProps extends ButtonProps {
  linkedContent: Item | Familiar | Skill;
}

const ContentButtons: FC<ContentButtonsProps> = ({
  linkedContent,
  ...props
}) => {
  if (!have(linkedContent)) return <></>;

  switch (linkedContent.objectType) {
    case "Item":
      return <ItemButtons linkedContent={linkedContent} {...props} />;
    case "Familiar": {
      return <FamiliarButtons linkedContent={linkedContent} {...props} />;
    }
    case "Skill":
      return <DynamicSkillLinks linkedContent={linkedContent} {...props} />;
  }
};

export default ContentButtons;
