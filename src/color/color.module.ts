import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorResolver } from './color.resolver';
import { Color } from './entities/color.entity';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports: [TypeOrmModule.forFeature([Color])], 
  providers: [ColorService, ColorResolver],
  exports: [ColorService], })
export class ColorModule {}
