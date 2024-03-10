import { ChakraProvider } from "@chakra-ui/react"
import Success from "../_components/proof-success"
import Nav from "../_components/nav"

export default function ProofDisplay({ params, searchParams }: any) {
    const mappedParams = Object.entries(searchParams).map(([key, value]) => {
        return { display: key, value }
    })
    console.log(mappedParams)
    return (
        <>
            <ChakraProvider>
                <Nav />
                <Success params={mappedParams}/>
            </ChakraProvider>

        </>
    )
}