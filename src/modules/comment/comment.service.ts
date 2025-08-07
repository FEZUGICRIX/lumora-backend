import { Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  create(createCommentInput: CreateCommentInput) {
    return this.prisma.comment.create({ data: createCommentInput });
  }

  findAll() {
    return this.prisma.comment.findMany();
  }

  findOne(id: string) {
    return this.prisma.comment.findUnique({
      where: { id },
    });
  }

  update(id: string, updateCommentInput: UpdateCommentInput) {
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentInput,
    });
  }

  remove(id: string) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
