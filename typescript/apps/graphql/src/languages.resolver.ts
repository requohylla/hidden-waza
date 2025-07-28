import { Resolver, Query } from '@nestjs/graphql';
import { BackendApiService } from './services/backendApi.service';
import { Language } from './dto/language.dto';

@Resolver('Language')
export class LanguagesResolver {
  private backendApi = new BackendApiService();

  @Query(() => [Language], { name: 'languagesList' })
  async getLanguagesList() {
    return await this.backendApi.getLanguages();
  }
}