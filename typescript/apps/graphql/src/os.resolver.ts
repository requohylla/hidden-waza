import { Resolver, Query } from '@nestjs/graphql';
import { BackendApiService } from './services/backendApi.service';

@Resolver('OS')
export class OSResolver {
  private backendApi = new BackendApiService();

  @Query('osList')
  async getOSList() {
    return await this.backendApi.getOSList();
  }
}