/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UnsplashService } from '../unsplash.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UnsplashService', () => {
  let service: UnsplashService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnsplashService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked-client-id'), // Mock para la clave de Unsplash
          },
        },
      ],
    }).compile();

    service = module.get<UnsplashService>(UnsplashService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return image results from Unsplash API', async () => {
    const query = 'nature';
    const page = 1;
    const perPage = 10;

    const mockResponse = {
      data: {
        results: [{ id: 1, description: 'Test image' }],
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await service.searchImages(query, page, perPage);

    expect(result).toEqual(mockResponse.data.results);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.unsplash.com/search/photos',
      {
        params: {
          query: query,
          page: page,
          per_page: perPage,
          client_id: configService.get<string>('KEY_PUBLIC_UNSPLASH'),
        },
      },
    );
  });

  it('should throw BadRequestException if there is an error fetching images', async () => {
    const query = 'nature';
    const page = 1;
    const perPage = 10;

    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    try {
      await service.searchImages(query, page, perPage);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(
        'Error fetching images from Unsplash Network Error',
      );
    }
  });
});
