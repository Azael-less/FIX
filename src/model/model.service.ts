import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from './entities/model.entity';
import { CreateModelInput } from './dto/create-model.input';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
  ) {}

  async create(createModelInput: CreateModelInput): Promise<Model> {
    const newModel = this.modelRepository.create(createModelInput);
    return await this.modelRepository.save(newModel);
  }

  async findOne(id: number): Promise<Model | null> {
    return await this.modelRepository.findOne({ where: { id } });
  }


  async findAll(): Promise<Model[]> {
    return await this.modelRepository.find();
  }
}
