import { Resolver, Query } from '@nestjs/graphql';
import { BackendApiService } from './services/backendApi.service';

@Resolver('Tool')
export class ToolsResolver {
  private backendApi = new BackendApiService();

  @Query('tools')
  async getTools() {
    return await this.backendApi.getTools();
  }
}