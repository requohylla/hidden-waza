import { Resolver, Query } from '@nestjs/graphql';
import { BackendApiService } from './services/backendApi.service';
import { Tool } from './dto/tool.dto';

@Resolver('Tool')
export class ToolsResolver {
  private backendApi = new BackendApiService();

  @Query(() => [Tool], { name: 'toolsList' })
  async getToolsList() {
    return await this.backendApi.getTools();
  }
}