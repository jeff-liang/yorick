import { Icon, Input, InputProps, Stack } from "@chakra-ui/react";
import { Check, CircleAlert } from "lucide-react";
import { useCallback } from "react";

import { CloseButton } from "../../components/ui/close-button";
import { InputGroup } from "../../components/ui/input-group";

interface ValidatedInputProps extends InputProps {
  valid: boolean;
  changeValue: (value: string) => void;
  refresh?: () => void;
}

const ValidatedInput = ({
  valid,
  value,
  changeValue,
  refresh,
  ...props
}: ValidatedInputProps) => {
  const nonEmpty = !!(value && value !== "");
  const colorProps =
    valid && nonEmpty
      ? { borderColor: "fg.success" }
      : !valid && nonEmpty
        ? { borderColor: "fg.error" }
        : undefined;

  const handleClear = useCallback(() => {
    changeValue("");
    if (refresh) refresh();
  }, [changeValue, refresh]);

  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <InputGroup
        endElement={
          !nonEmpty ? undefined : valid ? (
            <Icon asChild color="fg.success">
              <Check />
            </Icon>
          ) : (
            <Icon asChild color="fg.error">
              <CircleAlert />
            </Icon>
          )
        }
      >
        <Input
          value={value}
          {...colorProps}
          _focus={colorProps}
          _hover={colorProps}
          {...props}
        />
      </InputGroup>
      <CloseButton size={props.size} onClick={handleClear} />
    </Stack>
  );
};

export default ValidatedInput;
