import React from 'react';
import { Heading } from '@chakra-ui/react';

const Title = ({ text }: { text: string }) => {
  return (
    <Heading as="h2" marginTop="5" marginLeft="5">
      {text}
    </Heading>
  )
}

export default Title;