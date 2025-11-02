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

interface TwoFactorAuthProps {
  domain: string;
  token: string;
}

export const TwoFactorAuthTemplate = ({
  token,
  domain,
}: TwoFactorAuthProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Двухфакторная аутентификация — Lumora</Preview>
        <Body className="bg-gray-50 font-sans text-gray-800">
          <Container className="max-w-[480px] mx-auto my-10 p-8 rounded-2xl bg-white shadow-lg border border-gray-200">
            <Section className="text-center">
              <Heading className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Двухфакторная аутентификация
              </Heading>
              <Text className=" text-lg mb-6">Здравствуйте 👋</Text>

              <Text>
                Ваш код двухфакторной аутентификации - <strong>{token}</strong>
              </Text>

              <Text className="text-gray-600 text-sm mb-6">
                Пожалуйста, введите этот код в приложение для завершения
                процесса аутентификации
              </Text>

              <Text className="text-gray-500 text-xs mt-6">
                Если вы не запрашивали этот код, просто проигнорируйте это
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
