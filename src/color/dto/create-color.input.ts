import { InputType, Field } from '@nestjs/graphql';


@InputType()
export class CreateColorInput {
  
  @Field()
  name: string;
}
