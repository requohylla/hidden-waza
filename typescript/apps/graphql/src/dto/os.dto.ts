import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class OS {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}