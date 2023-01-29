import { ValueTransformer } from 'typeorm';

const toBoolean = (b: Buffer) => !!b.readUIntBE(0, 1);

export class BooleanTransformer implements ValueTransformer {
  to(data: unknown): unknown {
    return data;
  }

  from(data: Buffer | null): boolean | null {
    if (data) return toBoolean(data);
    return data;
  }
}
