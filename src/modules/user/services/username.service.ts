import { Injectable } from '@nestjs/common';

// username.service.ts
@Injectable()
export class UsernameService {
  async generateUniqueUsername(
    email: string,
    checkExists: (username: string) => Promise<boolean>,
  ): Promise<string> {
    const baseUsername = this.generateBaseUsername(email);

    // Пробуем базовый вариант
    if (!(await checkExists(baseUsername))) {
      return baseUsername;
    }

    // Добавляем числа
    for (let i = 1; i <= 999; i++) {
      const candidate = `${baseUsername}${i}`;
      if (!(await checkExists(candidate))) {
        return candidate;
      }
    }

    // Fallback
    return `user_${Date.now().toString().slice(-6)}`;
  }

  // username.service.ts
  private generateBaseUsername(email: string): string {
    return (
      email
        .split('@')[0]
        .toLowerCase()
        .normalize('NFD') // разбивает диакритические знаки é → e
        .replace(/[\u0300-\u036f]/g, '') // удаляет диакритические знаки
        .replace(/[^a-z0-9]/g, '_') // все не-буквенно-цифровые в _
        .replace(/_+/g, '_') // множественные _ в один
        .replace(/^_+|_+$/g, '') // убираем _ с начала и конца
        .substring(0, 20) || 'user'
    ); // fallback если пусто
  }
}
