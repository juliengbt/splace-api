/* eslint-disable class-methods-use-this */
import {
  PipeTransform, Injectable, NotAcceptableException
} from '@nestjs/common';

export function isUUID(value: string): boolean {
  return new RegExp('^[0-9A-Za-z-]{22}$').test(value);
}

@Injectable()
class ParseUUIDPipe implements PipeTransform<string, Buffer> {
  transform(value: string): Buffer {
    if (!value) throw new NotAcceptableException(`${value} is not a string`);
    return Buffer.from(value, 'base64url');
  }
}

export default ParseUUIDPipe;
