import { Button, Code, Container, Link, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { FallbackProps } from "react-error-boundary";

import H1 from "./H1";

const ErrorPage: FC<FallbackProps> = ({ error }) => (
  <Container maxW="4xl">
    <Stack
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      h="100vh"
    >
      <H1>Error while rendering YORICK.</H1>
      <Code>{error.message}</Code>
      <Text>
        <Link href="https://github.com/loathers/yorick/issues" target="_blank">
          Please report this on GitHub!
        </Link>
      </Text>
      <Button onClick={() => window.location.reload()}>Reload YORICK</Button>
    </Stack>
  </Container>
);

export default ErrorPage;
