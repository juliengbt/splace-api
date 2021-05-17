/* eslint-disable class-methods-use-this */
import {
  PipeTransform, Injectable, NotAcceptableException
} from '@nestjs/common';

@Injectable()
class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const regex = new RegExp('^[0-9A-Fa-f]{32}$');
    const idValue = value.replace(/-/g, '');
    if (!regex.test(idValue)) throw new NotAcceptableException(`${value} is not a valid uuid`);
    return idValue;
  }
}

export default ParseUUIDPipe;
