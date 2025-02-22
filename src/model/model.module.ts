import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelResolver } from './model.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Model])],
  providers: [ModelResolver, ModelService],
  exports: [ModelService], // 👈 Exportar si es necesario en otros módulos

})
export class ModelModule {}
