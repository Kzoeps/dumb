'use client'

import { Box, Heading, Text } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

export default function Success(props: any) {
  return (
    <Box textAlign="center" py={10} px={6}>
      <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Credentials Verified
      </Heading>
      <Text color={'gray.500'}>
        {props.params.map(({display, value}: any) => {
            return (
                <li key={value}>
                    <strong>{display}</strong>: {value}
                </li>
            )
        } )}
      </Text>
    </Box>
  )
}