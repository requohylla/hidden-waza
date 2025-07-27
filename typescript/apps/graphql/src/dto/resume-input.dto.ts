import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SkillsInput {
  @Field(() => [String])
  os: string[];

  @Field(() => [String])
  tools: string[];

  @Field(() => [String])
  languages: string[];
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