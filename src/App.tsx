import { ChakraProvider } from "@chakra-ui/react";
import { RefreshContextProvider } from "tome-kolmafia-react";

import NagContextProvider from "./contexts/NagContextProvider";
import Layout from "./Layout";
import { system } from "./theme";

// const bulleted = {
//   container: {
//     paddingTop: "0.125rem",
//     paddingLeft: "1.25rem",
//   },
//   item: {
//     textIndent: "-0.375rem",
//     _before: {
//       content: '"●"',
//       verticalAlign: "middle",
//       fontFamily: "Arial, Helvetica, sans-serif",
//       fontSize: "0.75rem",
//       lineHeight: 0,
//       display: "inline-block",
//       width: "0.375rem",
//       // This is a hackish tweak...
//       marginTop: "-3px",
//     },
//   },
// };

const App = () => (
  <ChakraProvider value={system}>
    <RefreshContextProvider>
      <NagContextProvider>
        <Layout />
      </NagContextProvider>
    </RefreshContextProvider>
  </ChakraProvider>
);

export default App;
