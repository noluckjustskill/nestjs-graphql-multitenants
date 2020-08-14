import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthUserType {
  @Field(type => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  lastLogin?: Date;

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  tokenExpires?: Date;

  @Field({ nullable: true })
  refreshToken?: string;
}
