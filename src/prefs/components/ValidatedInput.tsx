import { Group, Input, InputAddon, InputProps, Stack } from "@chakra-ui/react";
import { Check, CircleAlert } from "lucide-react";

import { CloseButton } from "../../components/ui/close-button";
import { Field } from "../../components/ui/field";

interface ValidatedInputProps extends InputProps {
  valid: boolean;
  setValue?: (value: string) => void;
}

const ValidatedInput = ({
  valid,
  value,
  setValue,
  ...props
}: ValidatedInputProps) => {
  const nonEmpty = !!(value && value !== "");
  const iconProps = props.size === "sm" ? { w: 8, h: 8 } : {};
  return (
    <Stack direction="row" alignItems="center">
      <Group attached>
        <Field invalid={!valid && nonEmpty}>
          <Input
            value={value}
            borderColor={valid && nonEmpty ? "green.solid" : undefined}
            _focus={
              valid && nonEmpty
                ? { borderColor: "green.solid" }
                : !valid && nonEmpty
                  ? { borderColor: "red.solid" }
                  : undefined
            }
            _hover={
              valid && nonEmpty
                ? { borderColor: "green.solid" }
                : !valid && nonEmpty
                  ? { borderColor: "red.solid" }
                  : undefined
            }
            {...props}
          />
        </Field>
        {valid && nonEmpty && (
          <InputAddon pointerEvents="none" {...iconProps}>
            <Check color="green.solid" />
          </InputAddon>
        )}
        {!valid && nonEmpty && (
          <InputAddon pointerEvents="none" {...iconProps}>
            <CircleAlert color="red.solid" />
          </InputAddon>
        )}
      </Group>
      {setValue && <CloseButton onClick={() => setValue("")} />}
    </Stack>
  );
};

export default ValidatedInput;
