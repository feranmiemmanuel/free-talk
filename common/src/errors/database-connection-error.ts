import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    constructor() {
        super('DB connection Error')
    }
    generateErrors(){
        return [{
            message: 'DB connection Error'
        }]
    }
}