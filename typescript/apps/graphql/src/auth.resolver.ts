import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BackendApiService } from './services/backendApi.service';
import { RegisterInput, RegisterResponse } from './dto/register.dto';
import { LoginInput, LoginResponse, UserType } from './dto/login.dto';

@Resolver()
export class AuthResolver {
  private backendApi = new BackendApiService();

  @Mutation(() => LoginResponse)
  async login(
    @Args('input', { type: () => LoginInput }) input: LoginInput
  ): Promise<LoginResponse> {
    const result = await this.backendApi.login(input.email, input.password);
    return {
      user: {
        id: result.ID ?? result.id,
        username: result.Username ?? result.username,
        email: result.Email ?? result.email,
      },
      token: result.Token ?? result.token ?? '', // バックエンドのtokenを返す
    };
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Args('input', { type: () => RegisterInput }) input: RegisterInput
  ): Promise<RegisterResponse> {
    return await this.backendApi.register(input.username, input.email, input.password);
  }
}