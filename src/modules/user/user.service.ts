import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { HashService } from '@/modules/auth/services/hash.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hash: HashService,
  ) {}

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { accounts: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    return user;
  }

  async createUser(createUserInput: CreateUserInput) {
    const { password, ...rest } = createUserInput;
    const passwordHash = await this.hash.hashPassword(password);

    const user = this.prisma.user.create({
      data: {
        ...rest,
        passwordHash,
      },
      include: { accounts: true },
    });

    return user;
  }

  // Check username available
  async checkUser(username: string, email: string) {
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

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isValid = await this.hash.verifyPassword(user.passwordHash, password);
    return isValid ? user : null;
  }

  getAllUsers() {
    return this.prisma.user.findMany();
  }

  getUser(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  updateUser(id: string, updateUserInput: UpdateUserInput) {
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
