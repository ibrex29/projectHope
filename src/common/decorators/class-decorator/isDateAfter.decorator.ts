import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsDateAfter(
  constraints: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsDateAfter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const endDate = new Date(value).valueOf();
          return constraints.every((dateProperty) => {
            const date = new Date(args.object[dateProperty]).valueOf();
            return date <= endDate;
          });
        },
        defaultMessage(args: ValidationArguments) {
          return `${
            args.property
          } must be later than or equal to these properties: ${constraints.join(
            ', ',
          )}`;
        },
      },
    });
  };
}
