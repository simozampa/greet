import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface NewContactReceivedProps {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  message: string
  appName: string
}

export const NewContactReceivedTemplate = ({
  firstName = '',
  lastName = '',
  email = '',
  phoneNumber = '',
  message = '',
  appName = '',
}: NewContactReceivedProps) => {

  const previewText = `New Contact Received - ${appName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-gray-900 text-[32px] text-center p-0 my-[30px] mx-0 font-bold">
              {process.env.NEXT_PUBLIC_NAME}
            </Heading>
            <Heading className="text-gray-900 text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              New Contact Received
            </Heading>
            <Text className="text-gray-900 text-[14px] leading-[24px] capitalize">
              <b>First Name:</b> {firstName}
            </Text>
            <Text className="text-gray-900 text-[14px] leading-[24px] capitalize">
              <b>Last Name:</b> {lastName}
            </Text>
            <Text className="text-gray-900 text-[14px] leading-[24px] capitalize">
              <b>Email:</b> {email}
            </Text>
            <Text className="text-gray-900 text-[14px] leading-[24px] capitalize">
              <b>Phone Number:</b> {phoneNumber}
            </Text>
            <Text className="text-gray-900 text-[14px] leading-[24px] capitalize">
              <b>Message:</b> {message}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewContactReceivedTemplate;