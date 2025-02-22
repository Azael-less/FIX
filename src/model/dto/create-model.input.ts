import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateModelInput {
  @Field()
    name: string;
}
