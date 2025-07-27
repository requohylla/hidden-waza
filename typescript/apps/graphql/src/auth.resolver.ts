import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BackendApiService } from './services/backendApi.service';

@Resolver()
export class AuthResolver {
  private backendApi = new BackendApiService();

  @Mutation('login')
  async login(
    @Args('input') input: { email: string; password: string }
  ) {
    return await this.backendApi.login(input.email, input.password);
  }

  @Mutation('register')
  async register(
    @Args('input') input: { username: string; email: string; password: string }
  ) {
    return await this.backendApi.register(input.username, input.email, input.password);
  }
}