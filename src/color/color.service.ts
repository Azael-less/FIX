import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from './entities/color.entity';
import { CreateColorInput } from './dto/create-color.input';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
  ) {}

  async create(createColorInput: CreateColorInput): Promise<Color> {
    const newColor = this.colorRepository.create(createColorInput);
    return await this.colorRepository.save(newColor);
  }

  async findOne(id: number): Promise<Color | null> {
    return await this.colorRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Color[]> {
    return await this.colorRepository.find();
  }
  
}
