import { AbstractControl } from '@angular/forms';
export class ValidatorErrorMessages {

    constructor() { }


    private static validationMessages = {

    };

    public static signUpValidationMessage = {
        'passwordNotMatched': 'Password Not Matched. Please Check the password.',
        'mobileNumberValidation': 'Enter valid mobile number: eg. 9876543210',
        'emailValidation': 'Please enter your email in this format: yourname@email.com',
        'userNameMsg': 'User Name should not contain any space and special character except `.`',
        'passwordCharactersValidation': 'Atleast one special symbol: - . ( ) _ @ ! *,'
    }

    public static loginValidationMessage = {
        'userNameMsg': 'User Name should not contain any space and special character except `.`',
        'emailValidation': 'Please enter your User Name in this format: yourname@email.com.',
        'passwordCharactersValidation': 'Atleast one special symbol: - . ( ) _ @ ! *,'
    }

    public static roleMasterValidationMessage = {
        'recordAlreadyExists': 'Record already exists',
    }

    public static permissionsValidationMessage = {
        'recordAlreadyExists': 'Record already exists',
        'alphabetWithUnderscoreValidate': 'This field only accepts alphabet characters and underscore(_) characters.',
    }

    public static employeeValidationMessage = {
        'alphabetValidate': 'This field only accepts alphabet characters.',
        'emailValidation': 'Please enter your email in this format: yourname@email.com',
        'emailAlreadyRegistered': 'E-Mail already registered.'

    }

    public static userValidationMessage = {
        'userNameMsg': 'User Name should not contain any space and special character except `.`',
        'passwordCharactersValidation': 'Atleast one special symbol: - . ( ) _ @ ! *,'
    }

    static getErrorMessage(control: AbstractControl, componentName?: string, fieldName?: string, fieldValue?: string) {
        let message = undefined;
        let errorMessagesMap: any = ValidatorErrorMessages.validationMessages;
        switch (componentName) {
            case 'login':
                errorMessagesMap = ValidatorErrorMessages.loginValidationMessage;
                break;
            case 'roleMaster':
                errorMessagesMap = ValidatorErrorMessages.roleMasterValidationMessage;
                break;
            case 'employee':
                errorMessagesMap = ValidatorErrorMessages.employeeValidationMessage;
                break;
            case 'user':
                errorMessagesMap = ValidatorErrorMessages.userValidationMessage;
                break;
            case 'permissions':
                errorMessagesMap = ValidatorErrorMessages.permissionsValidationMessage;
                break;
        }
        if (control)
            for (let key in control.errors) {
                if (fieldValue) {
                    message = ValidatorErrorMessages.getMessageForFieldValue(key + fieldName, fieldValue);
                    //console.log("getMessageForFieldValue",key,fieldName, errorMessagesMap, control,message);
                }
                if (componentName && fieldName && !message) {
                    message = ValidatorErrorMessages.getMessage(key + fieldName, errorMessagesMap, control);
                    // console.log("getMessage",key,fieldName, errorMessagesMap, control,message);
                }
                if (message) {
                    return message;
                }
                message = ValidatorErrorMessages.getMessage(key, errorMessagesMap, control);
                if (message) {
                    return message;
                }
                message = ValidatorErrorMessages.getMessage(key, ValidatorErrorMessages.validationMessages, control);
                if (message) {
                    return message;
                }
            }
        return 'This field is required.';
    };

    static getMessage(key, errorMessagesMap, control) {
        let message = undefined;
        switch (key) {
            case 'minlength':
                message = control.errors[key]['requiredLength'] + ' characters minimum';
                break;
            case 'maxlength':
                message = control.errors[key]['requiredLength'] + ' characters maximum';
                break;
            case 'max':
                message = errorMessagesMap[key] + control.errors[key]['max'];
                break;
            case 'min':
                message = errorMessagesMap[key] + control.errors[key]['min'];
                break;

            default:
                message = errorMessagesMap[key];
        }
        return message;
    }

    static getMessageForFieldValue(key, fieldValue) {
        let message = undefined;
        switch (key) {
            case 'requiredvalue2':
                message = "Please provide the " + fieldValue + " value. This field is mandatory.";
                break;
            case 'requiredvalue1':
                message = "Please provide the " + fieldValue + " value. This field is mandatory.";
                break;
            case 'maxvalue2':
            case 'minvalue2':
                message = "This field only accepts numbers (0-9)";
                break;
            case 'requiredresult':
                message = "Please select result for " + fieldValue + ". This field is mandatory.";
                break;
            case 'requiredtestResult':
                message = "Please select a status for the " + fieldValue + " test. This field is mandatory.";
                break;
            default:
            //message = "Please select result for " + fieldValue + ". This field is mandatory.";
        }
        return message;
    }
}