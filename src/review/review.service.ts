import { Injectable } from '@nestjs/common';
import { ReviewModel } from './review.model';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { CreateReviewDto } from './dto/create-review.dto';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';

class Leak {}

const leaks = [];

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel)
    private readonly reviewModel: ModelType<ReviewModel>,
  ) {}

  async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
    return await this.reviewModel.create(dto);
  }

  async delete(id: string): Promise<DocumentType<ReviewModel> | null> {
    return await this.reviewModel.findByIdAndDelete(id).exec();
  }

  async findByProductId(
    productId: string,
  ): Promise<DocumentType<ReviewModel>[]> {
    leaks.push(new Leak()); // утечка памяти
    return await this.reviewModel
      .find({ productId: Types.ObjectId(productId) })
      .exec();
  }

  async deleteByProductId(
    productId: string,
  ): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
    return await this.reviewModel
      .deleteMany({ productId: Types.ObjectId(productId) })
      .exec();
  }
}