import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface NewUserRegisteredProps {
  userType?: string
  email?: string
  phoneNumber?: string
  name?: string
  location?: string
  instagram?: string,
  tiktok?: string | null,
  appName?: string
  appLogo?: string
  actionUrl?: string
}

export const NewUserRegistered = ({
  userType = 'Creator',
  email = 'test@test.com',
  phoneNumber = '+1 424 537 9317',
  name = 'Pierlorenzo Peruzzo',
  location = 'Los Angeles, CA, United States 90034',
  instagram = 'none',
  tiktok = 'none',
  appName = 'Creators App',
  appLogo = 'https://tailwindui.com/img/logos/mark.svg?color=gray&shade=900',
  actionUrl = 'http://localhost:3000/'
}: NewUserRegisteredProps) => {

  const previewText = `New user registered (${userType}) - ${appName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={appLogo}
                width="40"
                height="37"
                alt={appName}
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              New user registered ({userType})
            </Heading>
            <Text className="text-black text-[14px] leading-[24px] capitalize">
              Hello,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              A new user registered to <strong>{appName}</strong>. Please log into the dashboard to review the application for approval.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Info:
              <ul className="text-sm">
                <li>
                  <strong>User Type</strong>: {userType}
                </li>
                <li>
                  <strong>Name</strong>: {name}
                </li>
                <li>
                  <strong>Email</strong>: {email}
                </li>
                <li>
                  <strong>Phone</strong>: {phoneNumber}
                </li>
                <li>
                  <strong>Location</strong>: {location}
                </li>
                <li>
                  <strong>Instagram</strong>: @{instagram}
                </li>
                <li>
                  <strong>TikTok</strong>: @{tiktok}
                </li>
              </ul>
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-gray-900 rounded text-white text-[12px] font-semibold no-underline text-center"
                href={actionUrl}
              >
                Manage Request
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewUserRegistered;