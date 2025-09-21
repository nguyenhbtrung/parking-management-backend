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

export class SlotNotCheckedIn extends AppError {
    constructor(message = "Slot is not checked in.") {
        super(
            message,
            "SLOT_NOT_CHECKED_IN",
            400,
        );
    }
}

export class SlotNotBooked extends AppError {
    constructor(message = "Slot is not booked.") {
        super(
            message,
            "SLOT_NOT_BOOKED",
            400,
        );
    }
}