import { Resolver, Query } from '@nestjs/graphql';
import { BackendApiService } from './services/backendApi.service';
import { OS } from './dto/os.dto';

@Resolver('OS')
export class OSResolver {
  private backendApi = new BackendApiService();

  @Query(() => [OS], { name: 'osList' })
  async getOSList() {
    return await this.backendApi.getOSList();
  }
}