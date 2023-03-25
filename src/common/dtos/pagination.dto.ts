import { IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Min(0)
  // Transformar
  limit?: number;

  @IsOptional()
  @Min(0)
  offset?: number;
}
