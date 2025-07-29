import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SkillItemInput {
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

@InputType()
export class SkillsInput {
  @Field(() => [SkillItemInput])
  items: SkillItemInput[];
}

@InputType()
export class ExperienceInput {
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

@InputType()
export class ResumeInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  date: string;

  @Field(() => SkillsInput)
  skills: SkillsInput;

  @Field(() => [ExperienceInput])
  experiences: ExperienceInput[];
}