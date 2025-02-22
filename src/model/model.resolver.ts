import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ModelService } from './model.service';
import { Model } from './entities/model.entity';
import { CreateModelInput } from './dto/create-model.input';

@Resolver(() => Model)
export class ModelResolver {
  constructor(private readonly modelService: ModelService) {}

  @Mutation(() => Model)
  createModel(@Args('createModelInput') createModelInput: CreateModelInput) {
    return this.modelService.create(createModelInput);
  }

  @Query(() => Model, { nullable: true })
  findModel(@Args('id') id: number) {
    return this.modelService.findOne(id);
  }

  @Query(() => [Model])
  async findAllModels(): Promise<Model[]> {
    return await this.modelService.findAll();
  }

}
