import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from 'generated/prisma';
import { RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, OrderPaginationDto } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('DataBase conected')
  }

  create(createOrderDto: CreateOrderDto) {

    return{
      service: 'Order Microservice',
      createOrderDto
    }

    // const {status = "PENDING", ...resto} = createOrderDto
    // return this.order.create({
    //   data: {
    //     status,
    //     ...resto
    //   }
    // });
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {

    const {limit = 10, page = 1} = orderPaginationDto;
    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status
      }
    });
    const currentPage = page;
    const perPage = limit;
    return {
        data: await this.order.findMany({
          skip: ( currentPage - 1) * perPage,
          take: perPage,
          where:{
            status: orderPaginationDto.status
          },
        }),
        meta: {
          total: totalPages,
          page: currentPage,
          lastPage: Math.ceil( totalPages / perPage)
        }
      }

  }

  async findOne(id: string) {

    const order = await this.order.findFirst({
      where: {id}
    });

    if(!order) throw new RpcException({ 
      status: HttpStatus.NOT_FOUND,
      message: `Order with id: ${id} not found`
     });

    return order
  }

  async changeStatus( changeOrderStatusDto: ChangeOrderStatusDto){
    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);

    if( order.status === status ){
      return order;
    }

    return this.order.update({
      where: {id},
      data: {
        status: status
      }
    })
  }
}
