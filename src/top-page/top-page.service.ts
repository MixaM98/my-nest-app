import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
    return await this.topPageModel.create(dto);
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string) {
    return await this.topPageModel.find({ alias }).exec();
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return await this.topPageModel
      .find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 })
      .exec();
  }
  // find - вторым параметром список поей которые надо отобразить

  async delete(id: string): Promise<DocumentType<TopPageModel> | null> {
    return await this.topPageModel.findByIdAndRemove(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return await this.topPageModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }
}
