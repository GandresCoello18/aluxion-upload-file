import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { UnsplashService } from './unsplash.service';
import { LoggerService } from '../../shared/logger/logger.service';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  UNSPLASH_RESPONSE_INVALID_TOKEN,
  UNSPLASH_RESPONSE_SUCCESS,
} from './unsplash.swagger';

@Controller('unsplash')
export class UnsplashController {
  private readonly logger = new LoggerService();
  constructor(private readonly unsplashService: UnsplashService) {}

  @Get('search')
  @ApiOperation({ summary: 'Buscar imágenes' })
  @ApiOkResponse({
    description: 'Imágenes encontradas',
    schema: {
      example: UNSPLASH_RESPONSE_SUCCESS,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Bad request',
    schema: {
      example: UNSPLASH_RESPONSE_INVALID_TOKEN,
    },
  })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Palabra clave para buscar imágenes',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Página de resultados',
    type: Number,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    description: 'Número de resultados por página',
    type: Number,
  })
  @ApiConsumes('application/json')
  async searchImages(
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ) {
    if (!query) {
      throw new BadRequestException('Query is required');
    }

    const images = await this.unsplashService.searchImages(
      query,
      page,
      perPage,
    );
    return images;
  }
}
