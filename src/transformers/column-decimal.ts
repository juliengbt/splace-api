import { ValueTransformer } from 'typeorm';

export class ColumnDecimalTransformer implements ValueTransformer {
  to(data: number | null): number | null {
    return data;
  }
  from(data: string | null): number | null {
    if (data) return Number(data);
    return null;
  }
}
