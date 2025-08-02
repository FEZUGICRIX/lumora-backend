import { Injectable } from '@nestjs/common';
import { CreateArticleTestInput } from './dto/create-article-test.input';
import { UpdateArticleTestInput } from './dto/update-article-test.input';

@Injectable()
export class ArticleTestService {
  create(createArticleTestInput: CreateArticleTestInput) {
    return 'This action adds a new articleTest';
  }

  findAll() {
    return `This action returns all articleTest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleTest`;
  }

  update(id: number, updateArticleTestInput: UpdateArticleTestInput) {
    return `This action updates a #${id} articleTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleTest`;
  }
}
