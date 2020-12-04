/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PipeTransform, Injectable, ArgumentMetadata, NotAcceptableException
} from '@nestjs/common';

@Injectable()
export default class UUIDValidationPipe implements PipeTransform {
  transform(value: string, _metadata: ArgumentMetadata) {
    if (!value.match('^[0-9A-Fa-f]{8}[-]?(?:[0-9A-Fa-f]{4}[-]?){3}[0-9A-Fa-f]{12}$')) {
      throw new NotAcceptableException(`${value} is not a uuid`);
    }
    return value;
  }
}
