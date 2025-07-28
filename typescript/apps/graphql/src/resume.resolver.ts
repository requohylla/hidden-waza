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
    const resumes = await this.backendApi.getResumes(userId);

    // マスターデータ参照用
    const masterName = (type: string, master_id: number) => {
      if (type === 'os') {
        const found = osList.find((m: any) => m.id === master_id);
        return found ? found.name : String(master_id);
      }
      if (type === 'tools') {
        const found = toolsList.find((m: any) => m.id === master_id);
        return found ? found.name : String(master_id);
      }
      if (type === 'languages') {
        const found = languagesList.find((m: any) => m.id === master_id);
        return found ? found.name : String(master_id);
      }
      return String(master_id);
    };

    // skills構造をitems配列に変換
    return resumes.map((resume: any) => {
      let items: any[] = [];
      if (resume.skills) {
        // Go APIのSkillDTO[]配列
        if (Array.isArray(resume.skills)) {
          items = resume.skills.map((s: any) => ({
            type: s.type,
            master_id: s.master_id,
            name: masterName(s.type, s.master_id)
          }));
        } else if (Array.isArray(resume.skills.items)) {
          items = resume.skills.items;
        } else {
          // 旧型（os/tools/languages配列）をitems配列に変換
          if (Array.isArray(resume.skills.os)) {
            items = items.concat(resume.skills.os.map((s: any) => ({
              type: 'os',
              master_id: s.master_id ?? s.id ?? 0,
              name: s.name ?? s.label ?? s
            })));
          }
          if (Array.isArray(resume.skills.tools)) {
            items = items.concat(resume.skills.tools.map((s: any) => ({
              type: 'tools',
              master_id: s.master_id ?? s.id ?? 0,
              name: s.name ?? s.label ?? s
            })));
          }
          if (Array.isArray(resume.skills.languages)) {
            items = items.concat(resume.skills.languages.map((s: any) => ({
              type: 'languages',
              master_id: s.master_id ?? s.id ?? 0,
              name: s.name ?? s.label ?? s
            })));
          }
        }
      }
      return {
        ...resume,
        skills: { items }
      };
    });
  }

  @Mutation(() => Resume)
  async createResume(
    @Args('input', { type: () => ResumeInput }) input: ResumeInput
  ): Promise<Resume> {
    return await this.backendApi.createResume(input);
  }
}