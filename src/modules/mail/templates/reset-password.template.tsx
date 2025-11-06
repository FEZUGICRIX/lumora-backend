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

interface ResetPasswordProps {
  domain: string;
  token: string;
}

export const ResetPasswordTemplate = ({
  domain,
  token,
}: ResetPasswordProps) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Сброс пароля — Lumora</Preview>
        <Body className="bg-gray-50 font-sans text-gray-800">
          <Container className="max-w-[480px] mx-auto my-10 p-8 rounded-2xl bg-white shadow-lg border border-gray-200">
            <Section className="text-center">
              <Heading className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Сброс пароля
              </Heading>
              <Text className=" text-lg mb-6">
                Здравствуйте 👋
              </Text>
              <Text className="text-gray-600 text-sm mb-6">
                Вы запросили сброс пароля. Пожалуйста, перейдите по следующей
                ссылке, чтобы создать новый пароль:
              </Text>
              <Link
                href={confirmLink}
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 text-white font-semibold text-sm shadow-md hover:opacity-90 transition-opacity shadow-black/20"
                style={{
                  background:
                    'linear-gradient(to right, #6366f1, #8b5cf6, #ec4899)',
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                }}
              >
                Подтвердите сброс пароля
              </Link>
              <Text className="text-gray-500 text-xs mt-6">
                Ссылка действительна <span className="font-medium">1 час</span>.
                Если вы не запрашивали сброс пароля, просто проигнорируйте это
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
