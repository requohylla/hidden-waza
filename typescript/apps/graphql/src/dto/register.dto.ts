import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;
}