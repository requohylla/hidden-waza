import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@ObjectType()
export class SkillItem {
  @Field()
  type: string;

  @Field()
  master_id: number;

  @Field()
  name: string;
}

@ObjectType()
export class Skills {
  @Field(() => [SkillItem])
  items: SkillItem[];
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