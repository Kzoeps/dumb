import { ChakraProvider } from "@chakra-ui/react";
import Image from "next/image";
import SplitScreen from "./_components/landing";
import Nav from "./_components/nav";

export default function Home() {
  return (
    <ChakraProvider>
      <Nav/>
      <SplitScreen/>
    </ChakraProvider>
  );
}
