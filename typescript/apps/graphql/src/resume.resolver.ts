import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BackendApiService } from './services/backendApi.service';
import { Resume } from './dto/resume.dto';
import { ResumeInput } from './dto/resume-input.dto';

@Resolver('Resume')
export class ResumeResolver {
  private backendApi = new BackendApiService();

  @Query(() => [Resume], { name: 'resumes' })
  async getResumes() {
    return await this.backendApi.getResumes();
  }

  @Mutation(() => Resume)
  async createResume(
    @Args('input', { type: () => ResumeInput }) input: ResumeInput
  ): Promise<Resume> {
    return await this.backendApi.createResume(input);
  }
}