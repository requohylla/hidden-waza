import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
const { BackendApiService, setMasterLists } = require('./services/backendApi.service');
import { Resume } from './dto/resume.dto';
import { ResumeInput } from './dto/resume-input.dto';
import { OS } from './dto/os.dto';
import { Tool } from './dto/tool.dto';
import { Language } from './dto/language.dto';

@Resolver('Resume')
export class ResumeResolver {
  private backendApi = new BackendApiService();

  @Query(() => [Resume], { name: 'resumes' })
  async getResumes(@Args('userId', { type: () => Int, nullable: true }) userId?: number) {
    // マスターを取得してid→name変換用にセット
    const osList: OS[] = await this.backendApi.getOSList();
    const toolsList: Tool[] = await this.backendApi.getTools();
    const languagesList: Language[] = await this.backendApi.getLanguages();
    setMasterLists(osList, toolsList, languagesList);
    return await this.backendApi.getResumes(userId);
  }

  @Mutation(() => Resume)
  async createResume(
    @Args('input', { type: () => ResumeInput }) input: ResumeInput
  ): Promise<Resume> {
    return await this.backendApi.createResume(input);
  }
}