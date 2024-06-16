import validator from "validator";

export class Validator {
	static async checkEmail(email: string): Promise<string | null>{
        let message: string | null = null;
        if(validator.isEmpty(email)){
            message = 'Email is required';
            return message;
        } else if(!validator.isEmail(email)){
            message = 'Invalid email';
            return message;
        }
		return message;
	}

    static async checkPassword(password: string, register: boolean): Promise<string | null>{
        let message: string | null = null;
        if(validator.isEmpty(password)){
            message = 'Password is required';
            return message;
        } else if(register && !validator.isStrongPassword(password)){
            message = 'Weak password';
            return message;
        }
        return message;
    }

    static async checkRepeatPassword(password: string, repeatPassword: string): Promise<string | null>{
        let message: string | null = null;
        if(validator.isEmpty(repeatPassword)){
            message = 'This field is required';
            return message;
        } else if(password !== repeatPassword){
            message = 'Passwords are not equal';
            return message;
        }
        return message;
    }

    static async checkRequiredString(data: any): Promise<string | null>{
        let message: string | null = null;
        if(validator.isEmpty(data)){
            message = 'This field is required';
            return message;
        } else if (validator.isNumeric(data)){
            message = 'This field have to contain letters'
        }
        return message;
    }

    static async checkPhoneNumber(phoneNumber: any): Promise<string | null>{
        let message: string | null = null;
        if(validator.isEmpty(phoneNumber.toString())){
            message = 'This field is required';
            return message;
        } else if (!validator.isMobilePhone(phoneNumber.toString(), 'pl-PL')){
            message = 'Invalid phone number';
            return message;
        } 
        return message;
    }

    static async checkHouseNumber(houseNumber: string): Promise<string | null>{
        let message: string | null = null;
        const pattern = /^[1-9]\d*(\s*[-/]\s*[1-9]\d*)?(\s?[a-zA-Z])?$/;
        if(validator.isEmpty(houseNumber)){
            message = 'This field is required';
            return message;
        } else if (!validator.matches(houseNumber, pattern)){
            message = 'Invalid house number';
            return message;
        } 
        return message;
    }

    static async checkPostalCode(postalCode: string): Promise<string | null>{
        let message: string | null = null;
        if(validator.isEmpty(postalCode)){
            message = 'This field is required';
            return message;
        } else if (!validator.isPostalCode(postalCode, 'PL')){
            message = 'Invalid postal code';
            return message;
        } 
        return message;
    }

    static async checkDate(date: string): Promise<string | null>{
        let message: string | null = null;
        if(validator.isEmpty(date)){
            message = 'This field is required';
            return message;
        }
        return message;
    }

    static async checkRequiredNumber(data: any, eventType: string): Promise<string | null>{
        let message: string | null = null;
        const maxNumber = eventType==='public' ? 1000 : 100;
        const minNumber = eventType==='public' ? 100 : 10
        if(validator.isEmpty(data)){
            message = 'This field is required';
            return message;
        } else if(!validator.isNumeric(data)){
            message = 'This field must be a number';
            return message;
        } else if(!validator.isInt(data)){
            message = 'Integers only';
            return message;
        } else if(data > maxNumber){
            message = `Maximum number is ${maxNumber}`;
            return message;
        } else if(data < minNumber){
            message = `Minimum number is ${minNumber}`;
            return message;
        }
        return message;
    }

    static async checkAge(age: any): Promise<string | null>{
        let message: string | null = null;
        if(!validator.isNumeric(age)){
            message = 'Age must be a number';
            return message;
        } else if(age < 18 || age > 30){
            message = 'Age is too high or low';
            return message;
        } else if(!validator.isInt(age)){
            message = 'Integers only';
            return message;
        }
        return message;
    }

    static async checkPrice(price: any): Promise<string | null>{
        let message: string | null = null;
        if(!validator.isNumeric(price)){
            message = 'Price must be a number';
            return message;
        } else if(price < 1){
            message = 'Price is too low';
            return message;
        } else if(!validator.isInt(price)){
            message = 'Integers only';
            return message;
        }
        return message;
    }

    static async checkCount(count: any): Promise<string | null>{
        let message: string | null = null;
        if(!validator.isNumeric(count)){
            message = 'Count must be a number';
            return message;
        } else if(count < 1){
            message = 'Count is too low';
            return message;
        } else if(!validator.isInt(count)){
            message = 'Integers only';
            return message;
        }
        return message;
    }

    static async checkNip(nip: any): Promise<string | null>{
        let message: string | null = null;
        if(!validator.isNumeric(nip)){
            message = 'Nip must be a number';
            return message;
        } else if(!validator.isInt(nip)){
            message = 'Integers only';
            return message;
        }
        return message;
    }
}
