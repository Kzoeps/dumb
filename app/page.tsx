import { ChakraProvider } from "@chakra-ui/react";
import SplitScreen from "./_components/landing";

export default function Home() {
  return (
    <ChakraProvider>
      <SplitScreen/>
    </ChakraProvider>
  );
}
