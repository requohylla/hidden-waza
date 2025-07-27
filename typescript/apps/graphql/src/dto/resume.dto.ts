import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Skills {
  @Field(() => [String])
  os: string[];

  @Field(() => [String])
  tools: string[];

  @Field(() => [String])
  languages: string[];
}

@ObjectType()
export class Resume {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  date: string;

  @Field(() => Skills)
  skills: Skills;

  @Field()
  verified: boolean;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}