import { EditIcon } from "lucide-react";
import { IconButton } from "@chakra-ui/react";
import { FC } from "react";

const PrefsButton: FC = () => {
  return (
    <IconButton
      onClick={() => {
        const mainpane = window.parent.parent.frames.mainpane;
        if (mainpane) {
          mainpane.location.href = "http://localhost:3000/yorick/prefs";
        }
      }}
      asChild
      aria-label="Open Overrides"
      size="xs"
      fontSize="15px"
      variant="outline"
      backgroundColor="white"
    >
      <EditIcon />
    </IconButton>
  );
};

export default PrefsButton;
