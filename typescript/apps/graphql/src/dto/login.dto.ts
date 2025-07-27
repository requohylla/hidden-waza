import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class UserType {
  @Field()
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;
}

@ObjectType()
export class LoginResponse {
  @Field(() => UserType)
  user: UserType;

  @Field()
  token: string;
}