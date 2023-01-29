import { FindOperator, ValueTransformer } from 'typeorm';

const toBuffer = (s: string) => Buffer.from(s, 'base64url');
const toBase64 = (b: Buffer) => b.toString('base64url');

export class UUIDTransformer implements ValueTransformer {
  to(
    data: string | null | FindOperator<unknown>
  ): Buffer | null | FindOperator<Buffer | Buffer[] | unknown> {
    if (data == null) return data;
    else if (data instanceof FindOperator) {
      if (!data.value) return data;
      let val = data.value;
      if (typeof val === 'string') val = toBuffer(val);
      else if (Array.isArray(data.value))
        val = data.value.filter((s) => typeof s === 'string').map((s) => toBuffer(s));

      return new FindOperator(
        data.type,
        val,
        data.useParameter,
        data.multipleParameters,
        data.getSql,
        data.objectLiteralParameters
      );
    }
    return toBuffer(data);
  }

  from(data: Buffer | null): string | null {
    if (data) return toBase64(data);
    return data;
  }
}
