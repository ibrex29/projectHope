import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function MinDate(minDate: Date, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'MinDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const date = new Date(value).valueOf();
          return minDate.valueOf() <= date;
        },
        defaultMessage(args: ValidationArguments) {
          return `minimal allowed date for ${
            args.property
          } is ${minDate.toUTCString()}`;
        },
      },
    });
  };
}
