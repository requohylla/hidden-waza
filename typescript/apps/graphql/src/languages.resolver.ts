import { Resolver, Query } from '@nestjs/graphql';
import { BackendApiService } from './services/backendApi.service';

@Resolver('Language')
export class LanguagesResolver {
  private backendApi = new BackendApiService();

  @Query('languages')
  async getLanguages() {
    return await this.backendApi.getLanguages();
  }
}