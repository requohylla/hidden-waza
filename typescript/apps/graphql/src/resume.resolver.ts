import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BackendApiService } from './services/backendApi.service';

@Resolver('Resume')
export class ResumeResolver {
  private backendApi = new BackendApiService();

  @Query('resumes')
  async getResumes() {
    return await this.backendApi.getResumes();
  }

  @Mutation('createResume')
  async createResume(
    @Args('input') input: any
  ) {
    return await this.backendApi.createResume(input);
  }
}