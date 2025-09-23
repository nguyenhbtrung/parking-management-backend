import { AppError } from "../appError.js";

export class UserNotFoundError extends AppError {
    constructor(message = "User not found.") {
        super(
            message,
            'USER_NOT_FOUND',
            404
        );
    }
}