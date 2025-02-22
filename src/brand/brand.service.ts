import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandInput } from './dto/create-brand.input';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandInput: CreateBrandInput): Promise<Brand> {
    const newBrand = this.brandRepository.create(createBrandInput);
    return await this.brandRepository.save(newBrand);
  }

  async findOne(id: number): Promise<Brand | null> {
    return await this.brandRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Brand[]> {
    return await this.brandRepository.find();
  }
  
}
