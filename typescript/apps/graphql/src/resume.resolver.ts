import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BackendApiService } from './services/backendApi.service';
import { Resume } from './dto/resume.dto';
import { ResumeInput } from './dto/resume-input.dto';

@Resolver('Resume')
export class ResumeResolver {
  private backendApi = new BackendApiService();

  @Query(() => [Resume], { name: 'resumes' })
  async getResumes(@Args('userId', { type: () => Int, nullable: true }) userId?: number) {
    return await this.backendApi.getResumes(userId);
  }

  @Mutation(() => Resume)
  async createResume(
    @Args('input', { type: () => ResumeInput }) input: ResumeInput
  ): Promise<Resume> {
    return await this.backendApi.createResume(input);
  }
}