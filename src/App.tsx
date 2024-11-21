import { ChakraProvider } from "@chakra-ui/react";
import { RefreshContextProvider } from "tome-kolmafia-react";

import NagContextProvider from "./contexts/NagContextProvider";
import Layout from "./Layout";
import { system } from "./theme";

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
