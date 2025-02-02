/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UnsplashController } from '../unsplash.controller';
import { UnsplashService } from '../unsplash.service';
import { BadRequestException } from '@nestjs/common';
import { LoggerService } from '../../../shared/logger/logger.service';

jest.mock('../unsplash.service');

describe('UnsplashController', () => {
  let controller: UnsplashController;
  let service: UnsplashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnsplashController],
      providers: [UnsplashService, LoggerService],
    }).compile();

    controller = module.get<UnsplashController>(UnsplashController);
    service = module.get<UnsplashService>(UnsplashService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchImages', () => {
    it('should return images when query is valid', async () => {
      const query = 'nature';
      const page = 1;
      const perPage = 10;
      const mockImages = { results: ['image1', 'image2'], total: 2 };

      service.searchImages = jest.fn().mockResolvedValue(mockImages);

      const result = await controller.searchImages(query, page, perPage);

      expect(result).toEqual(mockImages);
      expect(service.searchImages).toHaveBeenCalledWith(query, page, perPage);
    });

    it('should throw BadRequestException when query is not provided', async () => {
      const query = '';

      await expect(controller.searchImages(query)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call UnsplashService.searchImages with default page and perPage values', async () => {
      const query = 'nature';
      const mockImages = { results: ['image1', 'image2'], total: 2 };

      service.searchImages = jest.fn().mockResolvedValue(mockImages);

      const result = await controller.searchImages(query);

      expect(result).toEqual(mockImages);
      expect(service.searchImages).toHaveBeenCalledWith(query, 1, 10);
    });
  });
});
