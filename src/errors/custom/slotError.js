import { AppError } from "../appError.js";

export class SlotNotExistError extends AppError {
    constructor(message = "Slot does not exist.") {
        super(
            message,
            "SLOT_NOT_EXIST",
            400,
        );
    }
}

export class SlotOccupiedError extends AppError {
    constructor(message = "Slot is occupied.") {
        super(
            message,
            "SLOT_OCCUPIED",
            400,
        );
    }
}