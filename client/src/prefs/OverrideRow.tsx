import { Td, Text, Tr } from "@chakra-ui/react";
import { ChangeEvent, useCallback } from "react";
import React from "react";

import { validityType, validValue } from "./valid";
import ValidatedInput from "./ValidatedInput";

// override is the key in localStorage
interface OverrideRowProps {
  label?: string;
  override: string;
  current: string;
}

const OverrideRow: React.FC<OverrideRowProps> = ({
  label,
  override,
  current,
}) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(override) ?? "",
  );

  const handleChangeProperty = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValue(value);
      if (value === "") {
        localStorage.removeItem(override);
      } else if (validValue(validityType(override), value)) {
        localStorage.setItem(override, value);
      }
    },
    [override],
  );

  const handleBlur = useCallback(() => {
    // @ts-ignore
    const chatpane: Window = window.parent.frames.chatpane;
    chatpane.postMessage("refresh");
  }, []);

  const validity = validityType(override);
  const valid = validValue(validity, value);

  return (
    <Tr>
      <Td>
        <Text textAlign="right" my="auto">
          {label ?? override}
        </Text>
      </Td>
      <Td>
        <ValidatedInput
          value={value}
          valid={valid}
          onChange={handleChangeProperty}
          onBlur={handleBlur}
          size="sm"
          minW="6rem"
          placeholder={current}
        />
      </Td>
    </Tr>
  );
};

export default OverrideRow;
