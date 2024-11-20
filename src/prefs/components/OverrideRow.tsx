import { Table, Text } from "@chakra-ui/react";
import { ChangeEvent, FC, useCallback, useState } from "react";

import { validityType, validValue } from "../util/valid";

import ValidatedInput from "./ValidatedInput";

// override is the key in localStorage
interface OverrideRowProps {
  label?: string;
  override: string;
  current: string;
}

const OverrideRow: FC<OverrideRowProps> = ({ label, override, current }) => {
  const [value, setValue] = useState(localStorage.getItem(override) ?? "");

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
    const yorickpane: Window | undefined = window.parent.frames.yorickpane;
    yorickpane?.postMessage("refresh");
  }, []);

  const validity = validityType(override);
  const valid = validValue(validity, value);

  return (
    <Table.Row>
      <Table.Cell>
        <Text textAlign="right" my="auto">
          {label ?? override}
        </Text>
      </Table.Cell>
      <Table.Cell>
        <ValidatedInput
          value={value}
          valid={valid}
          onChange={handleChangeProperty}
          onBlur={handleBlur}
          size="sm"
          minW="6rem"
          placeholder={current}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export default OverrideRow;
