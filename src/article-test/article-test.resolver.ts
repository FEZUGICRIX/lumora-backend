import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ArticleTestService } from './article-test.service';
import { ArticleTest } from './entities/article-test.entity';
import { CreateArticleTestInput } from './dto/create-article-test.input';
import { UpdateArticleTestInput } from './dto/update-article-test.input';

@Resolver(() => ArticleTest)
export class ArticleTestResolver {
  constructor(private readonly articleTestService: ArticleTestService) {}

  @Mutation(() => ArticleTest)
  createArticleTest(
    @Args('createArticleTestInput')
    createArticleTestInput: CreateArticleTestInput,
  ) {
    return this.articleTestService.create(createArticleTestInput);
  }

  @Query(() => [ArticleTest], { name: 'articleTest' })
  findAll() {
    return this.articleTestService.findAll();
  }

  @Query(() => ArticleTest, { name: 'articleTest' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.articleTestService.findOne(id);
  }

  @Mutation(() => ArticleTest)
  updateArticleTest(
    @Args('updateArticleTestInput')
    updateArticleTestInput: UpdateArticleTestInput,
  ) {
    return this.articleTestService.update(
      updateArticleTestInput.id,
      updateArticleTestInput,
    );
  }

  @Mutation(() => ArticleTest)
  removeArticleTest(@Args('id', { type: () => Int }) id: number) {
    return this.articleTestService.remove(id);
  }
}
