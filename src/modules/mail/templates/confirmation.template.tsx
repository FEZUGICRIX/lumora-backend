import {
  Body,
  Head,
  Container,
  Hr,
  Heading,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export const ConfirmationTemplate = ({
  domain,
  token,
}: ConfirmationTemplateProps) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Подтверждение вашей почты — Lumora</Preview>
        <Body className="bg-gray-50 font-sans text-gray-800">
          <Container className="max-w-[480px] mx-auto my-10 p-8 rounded-2xl bg-white shadow-lg border border-gray-200">
            <Section className="text-center">
              <Heading className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Подтверждение почты
              </Heading>
              <Text className="text-gray-600 text-sm mb-6">
                Здравствуйте 👋 <br />
                Чтобы подтвердить адрес вашей электронной почты, пожалуйста,
                перейдите по кнопке ниже.
              </Text>

              <Link
                href={confirmLink}
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:opacity-90 transition-opacity"
              >
                Подтвердить почту
              </Link>

              <Text className="text-gray-500 text-xs mt-6">
                Ссылка действительна <span className="font-medium">1 час</span>.
                Если вы не запрашивали подтверждение, просто проигнорируйте это
                письмо.
              </Text>
            </Section>

            <Hr className="my-8 border-gray-200" />

            <Section className="text-center">
              <Text className="text-xs text-gray-400">
                Спасибо за использование{' '}
                <span className="font-semibold">Lumora</span> 🌙
                <br />
                Мы делаем технологии красивыми.
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                <Link
                  href={domain}
                  className="text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  {domain.replace(/^https?:\/\//, '')}
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
