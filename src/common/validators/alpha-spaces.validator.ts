import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isAlpha,
} from 'class-validator';

@ValidatorConstraint({ name: 'alphaSpaces', async: false })
export class AlphaSpacesValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    return text.split(' ').every(function (str) {
      return isAlpha(str, 'sl-SI');
    }); // for async validations you must return a Promise<boolean> here
  }

  defaultMessage() {
    // here you can provide default error message if validation failed
    return '$property can contain only letters and spaces';
  }
}
