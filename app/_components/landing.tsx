"use client";
import {
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

export default function SplitScreen() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSchemaSet, setIsSchemaSet] = useState(false);
  const [schemaUrl, setSchemaUrl] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showIFrame, setShowIFrame] = useState(false);

  // Move useBreakpointValue to top level to avoid conditional hook calls
  const breakpointHeight = useBreakpointValue({ base: "20%", md: "30%" });

  // Poll the sessions table for updates on a set interval
  useEffect(() => {
    if (!sessionId) return;

    console.log("Setting up polling for session:", sessionId);
    const intervalId = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("verified, user_details")
          .eq("id", sessionId)
          .single();
        if (error) {
          console.error("Polling error:", error);
          return;
        }
        if (data?.verified) {
          setIsVerified(true);
          setUserDetails(data.user_details);
          setIsLoading(false);
          console.log("Session verified with details:", data.user_details);
        }
      } catch (err) {
        console.error("Polling exception:", err);
      }
    }, 2000); // Poll every 2 seconds

    return () => {
      console.log("Cleaning up polling interval");
      clearInterval(intervalId);
    };
  }, [sessionId]);

  const createSession = async (uuid: string) => {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .insert({
          id: uuid,
          verified: false,
          user_details: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating session:", error);
        return false;
      }

      console.log("Session created with ID:", data.id);
      setSessionId(data.id);
      return true;
    } catch (error) {
      console.error("Failed to create session:", error);
      return false;
    }
  };

  const handleVerifyClick = async () => {
    setIsLoading(true);

    // Generate a valid UUID first
    const generatedUuid = uuidv4();
    console.log("Generated UUID:", generatedUuid);

    // Create the session with the generated UUID before opening URL
    const sessionCreated = await createSession(generatedUuid);

    if (!sessionCreated) {
      setIsLoading(false);
      console.error("Failed to create session");
      return;
    }
    setShowIFrame(true);

    // Now open the verification URL with the UUID
    // const verificationUrl = `http://localhost:3000/proof-request/63?sessionId=${generatedUuid}`;
    // window.open(verificationUrl, "_blank");
  };

  const resetVerification = () => {
    setIsVerified(false);
    setUserDetails(null);
    setSessionId(null);
    setIsLoading(false);
  };

  // If verified, show the user details
  if (isVerified && userDetails) {
    return (
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={6} w={"full"} maxW={"lg"}>
            <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
              <Text color={"green.400"} as={"span"}>
                Verification Successful!
              </Text>
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              Your credentials have been verified successfully. Here are your
              details:
            </Text>
            <Stack
              spacing={4}
              p={4}
              bg={"gray.50"}
              borderRadius={"lg"}
              border={"1px solid"}
              borderColor={"gray.200"}
            >
              <Text fontWeight={"bold"} fontSize={"lg"}>
                User Details:
              </Text>
              <Text
                as={"pre"}
                fontSize={"sm"}
                whiteSpace={"pre-wrap"}
                fontFamily={"monospace"}
                bg={"white"}
                p={3}
                borderRadius={"md"}
                border={"1px solid"}
                borderColor={"gray.200"}
              >
                {JSON.stringify(userDetails, null, 2)}
              </Text>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={"Success Image"}
            objectFit={"cover"}
            src={
              "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
          />
        </Flex>
      </Stack>
    );
  }

  return (
    <>
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={6} w={"full"} maxW={"lg"}>
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: breakpointHeight,
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "blue.400",
                  zIndex: -1,
                }}
              >
                Bhutan Job Portal
              </Text>
              <br />{" "}
              <Text color={"blue.400"} as={"span"}>
                Easily Find a Job
              </Text>{" "}
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              The project board is an exclusive resource for contract work.
              It&apos;s perfect for freelancers, agencies, and moonlighters.
            </Text>
            <Flex align={'center'} justify={'center'} gap={4}>

            <Input name="schemaId" value={schemaUrl || ""} readOnly={isSchemaSet} onChange={(e) => setSchemaUrl(e.target.value)} />
            <Button disabled={isSchemaSet} padding={4} onClick={() => setIsSchemaSet(true)} ><p style={{padding: '12px'}}>Set Schema ID</p></Button>
            </Flex>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <Button
                rounded={"full"}
                bg={"blue.500"}
                color={"white"}
                _hover={{ bg: "blue.600" }}
                onClick={handleVerifyClick}
                isLoading={isLoading}
                loadingText="Waiting for verification..."
              >
                Verify Creds
              </Button>
              <Button rounded={"full"}>How It Works</Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            src={
              "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
          />
        </Flex>
        <Modal
          isOpen={showIFrame}
          size={"3xl"}
          onClose={() => setShowIFrame(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>QR Code</ModalHeader>
            <ModalCloseButton />
            <ModalBody className="flex justify-center items-center">
              <iframe
                src={`https://gooey-psi.vercel.app/proof-request/${schemaUrl}?sessionId=${sessionId}`}
                className="w-[45rem] h-[45rem] rounded-lg"
              />
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => setShowIFrame(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Stack>
    </>
  );
}
