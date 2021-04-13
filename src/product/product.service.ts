import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto } from './dto/create-product.dto';
import { ReviewModel } from '../review/review.model';
import { FindProductDto } from './dto/find-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: ModelType<ProductModel>,
  ) {}

  async create(dto: CreateProductDto) {
    return await this.productModel.create(dto);
  }

  async findById(id: string) {
    return await this.productModel.findById({ id }).exec();
  }

  async deleteById(id: string) {
    return await this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateProductDto) {
    return await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  async findWithReviews(dto: FindProductDto) {
    return this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $lookup: {
            from: 'Review',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews', // review
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' }, // review
            reviewAvg: { $avg: '$reviews.rating' },
            reviews: {
              // review
              $function: {
                body: `function (reviews) {
                  reviews.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                  );
                  return reviews;
                }`,
                args: ['$reviews'],
                lang: 'js', // пока только js
              },
            },
          },
        },
      ])
      .exec() as (ProductModel & {
      review: ReviewModel[];
      reviewCount: number;
      reviewAvg: number;
    })[];
  }
}

// с монги 4,4 можно писать свои пайпы (функции)
// луяше не сохранять функции

// Stages and Operators

// стабилная и нестаблиная соритировка Mongo !!!!!!!!!!!
// сортировка по id стаблбная ( использовать при linit)

// pipeLine в агригации (последовательно выполняемые действия )

// match - стравнить;
// sort - отсортировать
// emit - ограничить
// group - струпировать
// lookUp - подтянуть даные из другой таблици
// add field - добавить поля

// https://docs.mongodb.com/manual/core/aggregation-pipeline/

// https://docs.mongodb.com/manual/reference/operator/aggregation/match/
