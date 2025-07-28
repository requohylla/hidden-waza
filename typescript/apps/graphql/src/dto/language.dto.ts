import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Language {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}