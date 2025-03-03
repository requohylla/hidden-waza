import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }
}