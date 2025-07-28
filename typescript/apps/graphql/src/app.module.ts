import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HelloResolver } from './hello/hello.resolver';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    HelloResolver,
    require('./auth.resolver').AuthResolver,
    require('./resume.resolver').ResumeResolver,
    require('./os.resolver').OSResolver,
    require('./tools.resolver').ToolsResolver,
    require('./languages.resolver').LanguagesResolver
  ],
})
export class AppModule {}