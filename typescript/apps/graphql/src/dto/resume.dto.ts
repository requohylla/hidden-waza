import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SkillItem {
  @Field()
  type: string;

  @Field()
  master_id: number;

  @Field()
  name: string;

  @Field()
  level: string;

  @Field()
  years: number;
}

@ObjectType()
export class Skills {
  @Field(() => [SkillItem])
  items: SkillItem[];
}

@ObjectType()
export class Experience {
  @Field()
  company: string;

  @Field()
  position: string;

  @Field()
  start_date: string;

  @Field()
  end_date: string;

  @Field()
  description: string;

  @Field()
  portfolio_url: string;
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

  @Field(() => [Experience])
  experiences: Experience[];

  @Field()
  verified: boolean;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}