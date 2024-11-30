import { ChakraProvider } from "@chakra-ui/react";
import { ErrorBoundary } from "react-error-boundary";
import { RefreshContextProvider } from "tome-kolmafia-react";

import ErrorPage from "./components/ErrorPage";
import NagContextProvider from "./contexts/NagContextProvider";
import Layout from "./Layout";
import { system } from "./theme";

const App = () => (
  <ChakraProvider value={system}>
    <ErrorBoundary fallbackRender={ErrorPage}>
      <RefreshContextProvider>
        <NagContextProvider>
          <Layout />
        </NagContextProvider>
      </RefreshContextProvider>
    </ErrorBoundary>
  </ChakraProvider>
);

export default App;
