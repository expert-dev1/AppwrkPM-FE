import { ValidatorFn, AbstractControl, FormArray, ValidationErrors } from "@angular/forms";

export class CustomValidator {

    // min length
    public static minLength(min: number): ValidatorFn | any {
        return (control: AbstractControl[]) => {
            if (!(control instanceof FormArray)) return;
            return control.length < min ? { minLength: true } : null;
        }
    }

    static phoneNumberValidation(control: AbstractControl): ValidationErrors {
        var reg = /[+]{0,1}[0-9]{0,3}[-]{0,1}[0-9]{9,16}$/;
        if (!control.value) {
            return null;
        }
        var isValid = control.value && reg.test(control.value.toString());
        const message = {
            'phoneNumberValidation': {
                'message': 'This field only accepts numbers and the following symbols: - +'
            }
        };
        return isValid ? null : message;
    }

    static emailValidation(control: AbstractControl): ValidationErrors {
        var reg = /^.+@.+\..{2,5}$/;
        if (!control.value) {
            return null;
        }
        var isValid = control.value && reg.test(control.value.toString());
        const message = {
            'emailValidation': {
                'message': 'Please enter your email in this format: yourname@email.com'
            }
        };
        return isValid ? null : message;
    }

    static passwordCharactersValidation(control: AbstractControl): ValidationErrors {
        var reg = /(?=[-_.@#!*()]+)/;
        if (!control.value) {
            return null;
        }
        var isValid = control.value && reg.test(control.value.toString());
        const message = {
            'passwordCharactersValidation': {
                'message': 'Atleast one special symbol: - . ( ) _ @ ! *'
            }
        };
        return isValid ? null : message;
    }

    static alphabetAndNameValidationAcceptEnter(control: AbstractControl): ValidationErrors {
        var reg = /^[a-zA-Z-_. ]+$/;
        if (!control.value) {
            return null;
        }
        var isValid = control.value && reg.test(control.value.toString());
        const message = {
            'alphabetAndNameValidationAcceptEnter': {
                'message': 'This field only accepts letters and the following symbols: - .'
            }
        };
        return isValid ? null : message;
    }

    static userNameValidation(control: AbstractControl): ValidationErrors {
        var reg = /^[0-9a-zA-Z-.]+$/;
        if (!control.value) {
            return null;
        }
        var isValid = control.value && reg.test(control.value.toString());
        const message = {
            'userNameMsg': {
                'message': 'User Name should not contain any space and special character except `.`',
            }
        };
        return isValid ? null : message;
    }

    static alphabetValidate(control: AbstractControl): ValidationErrors {
        var reg = /^[a-zA-Z ]+$/;
        if (!control.value) {
            return null;
        }
        var isValid = control.value && reg.test(control.value.toString());
        const message = {
            'alphabetValidate': {
                'message': 'This field only accepts alphabet characters .'
            }
        };
        return isValid ? null : message;
    }

    static alphabetWithUnderscoreValidate(control: AbstractControl): ValidationErrors {
        console.log("control : ",control);
        var reg = /^[a-zA-Z_]+$/;
        if (!control.value) {
            return null;
        }
        var isValid = control.value && reg.test(control.value.toString());
        const message = {
            'alphabetWithUnderscoreValidate': {
                'message': 'This field only accepts alphabet characters and underscore(_) characters.'
            }
        };
        return isValid ? null : message;
    }

    static mobileNumberValidation(control: AbstractControl): ValidationErrors {
        var reg = /^((\\+91-?)|0)?[0-9]{10}$/;
        if (!control.value) {
            return null;
        }
        var isValid = control.value && reg.test(control.value.toString());
        const message = {
            'mobileNumberValidation': {
                'message': 'This field only accepts numbers and the following symbols: - + ( )'
            }
        };
        return isValid ? null : message;
    }

    static emailIdValidation(control: AbstractControl): ValidationErrors {
        var reg = /^.+@.+\..{2,5}$/;
        if (!control.value) {
            return null;
        }
        var isValid = control.value && reg.test(control.value.toString());
        const message = {
            'emailValidation': {
                'message': 'Please enter your email in this format: yourname@email.com.'
            }
        };
        return isValid ? null : message;
    }
}