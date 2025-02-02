import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class UnsplashService {
  private readonly accessKey: string;
  private readonly baseUrl = 'https://api.unsplash.com/search/photos';

  constructor(private readonly configService: ConfigService) {}

  async searchImages(query: string, page: number = 1, perPage: number = 10) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          query: query,
          page: page,
          per_page: perPage,
          client_id: this.configService.get<string>(
            'KEY_PUBLIC_UNSPLASH',
          ) as string,
        },
      });
      return response?.data?.results as Array<object>;
    } catch (error) {
      throw new BadRequestException(
        'Error fetching images from Unsplash ' + error.message,
      );
    }
  }
}
