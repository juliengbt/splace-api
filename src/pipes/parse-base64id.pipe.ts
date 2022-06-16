/* eslint-disable class-methods-use-this */
import { PipeTransform, Injectable, NotAcceptableException } from '@nestjs/common';

@Injectable()
/** Parse a base64url string to a buffer */
class ParseBase64IDPipe implements PipeTransform<string, Buffer> {
  transform(value: string): Buffer {
    if (!value) throw new NotAcceptableException(`${value} is not a string`);
    return Buffer.from(value, 'base64url');
  }
}

export default ParseBase64IDPipe;
