import { Router } from "express";
import { bookingsController } from "./bookings.controller.js";
import { verify } from "../../middleware/verify.js";
const router = Router();
router.post("/", bookingsController.createBooking);
router.post("/:bookingId", verify("admin", "customer"), bookingsController.updateBooking);
router.get("/", verify("admin", "customer"), bookingsController.getAllBookings);
export const bookingsRouter = router;
