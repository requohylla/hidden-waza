import { InputType, Field } from '@nestjs/graphql';

@InputType()
@InputType()
export class SkillItemInput {
  @Field()
  type: string;

  @Field()
  master_id: number;

  @Field()
  name: string;
}

@InputType()
export class SkillsInput {
  @Field(() => [SkillItemInput])
  items: SkillItemInput[];
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
}