import { Table, Text } from "@chakra-ui/react";
import { ChangeEvent, FC, useCallback, useState } from "react";

import { validityType, validValue } from "../util/valid";

import ValidatedInput from "./ValidatedInput";

// override is the key in localStorage
interface OverrideRowProps extends Table.RowProps {
  label?: string;
  override: string;
  current: string;
}

function refresh() {
  const yorickpane: Window | undefined = window.parent.frames.yorickpane;
  yorickpane?.postMessage("refresh");
}

const OverrideRow: FC<OverrideRowProps> = ({
  label,
  override,
  current,
  ...props
}) => {
  const [value, setValue] = useState(localStorage.getItem(override) ?? "");

  const changeValue = useCallback(
    (value: string) => {
      setValue(value);
      if (value === "") {
        localStorage.removeItem(override);
      } else if (validValue(validityType(override), value)) {
        localStorage.setItem(override, value);
      }
    },
    [override],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      changeValue(event.target.value);
    },
    [changeValue],
  );

  const validity = validityType(override);
  const valid = validValue(validity, value);

  return (
    <Table.Row {...props}>
      <Table.Cell p={1}>
        <Text textAlign="right" my="auto">
          {label ?? override}
        </Text>
      </Table.Cell>
      <Table.Cell p={1}>
        <ValidatedInput
          value={value}
          valid={valid}
          onChange={handleChange}
          onBlur={refresh}
          changeValue={changeValue}
          refresh={refresh}
          size="2xs"
          minW="6rem"
          placeholder={current}
          data-lpignore
        />
      </Table.Cell>
    </Table.Row>
  );
};

export default OverrideRow;
