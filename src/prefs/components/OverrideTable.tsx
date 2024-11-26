import { Table } from "@chakra-ui/react";
import { FC } from "react";

import H3 from "../../components/H3";

import OverrideRow from "./OverrideRow";

interface OverrideTableProps {
  filterRegex: RegExp | null;
  heading: string;
  data: string[];
  getOverride: (row: string) => string;
  getCurrent: (row: string) => string;
}

const OverrideTable: FC<OverrideTableProps> = ({
  heading,
  filterRegex,
  data,
  getOverride,
  getCurrent,
}) => (
  <>
    <H3 textAlign="center">{heading}</H3>
    <Table.Root size="sm">
      <Table.Body>
        {data.map((item) => {
          const override = getOverride(item);
          return (
            !filterRegex ||
            (filterRegex.test(override) && (
              <OverrideRow
                key={override}
                override={override}
                label={item}
                current={getCurrent(item)}
              />
            ))
          );
        })}
      </Table.Body>
    </Table.Root>
  </>
);

export default OverrideTable;
