import { IconButton } from "@chakra-ui/react";
import { EditIcon } from "lucide-react";
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
      size="2xs"
      p={1}
      variant="outline"
    >
      <EditIcon />
    </IconButton>
  );
};

export default PrefsButton;
