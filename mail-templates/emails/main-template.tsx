import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface CreatorRegisteredThankYouProps {
  title?: string
  content?: string
  firstName?: string
  lastName?: string
  appName?: string
  baseUrl?: string
  actionUrl?: string
  actionTitle?: string
}

export const MainEmailTemplate = ({
  title = '',
  content = '',
  firstName = '',
  lastName = '',
  appName = '',
  baseUrl = '',
  actionUrl = "",
  actionTitle = "",
}: CreatorRegisteredThankYouProps) => {


  const previewText = `Thank you for your request - ${appName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <span className='text-xl font-logo uppercase'>{process.env.NEXT_PUBLIC_NAME}</span>
            </Section>
            <Heading className="text-gray-900 text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              {title}
            </Heading>
            <Text className="text-gray-900 text-[14px] leading-[24px] capitalize">
              Hello {firstName},
            </Text>
            <Text className="text-gray-900 text-[14px] leading-[24px]">
              {content}
            </Text>

            {(actionTitle && actionUrl) &&
              <Button href={actionUrl} className="w-auto text-center rounded-md border border-transparent bg-gray-900 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-gray-50 my-[26px]">
                {actionTitle}
              </Button>
            }

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This email was intended for{' '}
              <span className="text-gray-900"><span className="capitalize">{firstName + ' ' + lastName}</span></span>. This email was sent from{' '}
              <Link href={baseUrl}><span className="text-gray-900">{appName}</span></Link>.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MainEmailTemplate;