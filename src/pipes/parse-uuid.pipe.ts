/* eslint-disable class-methods-use-this */
import {
  PipeTransform, Injectable, NotAcceptableException
} from '@nestjs/common';

export function isUUID(value: string): boolean {
  const idValue = value.replace(/-/g, '');
  return new RegExp('^[0-9A-Fa-f]{32}$').test(idValue);
}

@Injectable()
class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isUUID(value)) throw new NotAcceptableException(`${value} is not a valid uuid`);
    return value.replace(/-/g, '');
  }
}

export default ParseUUIDPipe;
