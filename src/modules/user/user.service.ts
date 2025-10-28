import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthMethod, User } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';
import { UsernameService } from './services/username.service';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usernameService: UsernameService,
  ) {}

  async findUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { accounts: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (!user) throw new NotFoundException('User with this email not found');

    return user;
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const username =
      createUserInput.username ??
      (await this.usernameService.generateUniqueUsername(
        createUserInput.email,
        (username) => this.isUsernameAvailable(username),
      ));

    // 🔧 Логика: для OAUTH → passwordHash = null
    const passwordHash =
      createUserInput.method === AuthMethod.CREDENTIALS
        ? createUserInput.passwordHash
        : null;

    const user = await this.prisma.user.create({
      data: {
        ...createUserInput,
        username,
        passwordHash,
      },
      include: { accounts: true },
    });

    return user;
  }

  async checkUser(username: string, email?: string): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      if (existingUser.email === email)
        throw new ConflictException('User with this email already exists');
      if (existingUser.username === username)
        throw new ConflictException('User with this username already exists');
    }
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { username },
    });

    return user ? true : false;
  }

  async findUserForAuth(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    }); // Don't throws error
  }

  getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  getUser(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  updateUser(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserInput,
    });
  }

  removeUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
