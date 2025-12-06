import { Router } from "express";
import { verify } from "../../middleware/verify.js";
import { vehicleController } from "./vehicles.controller.js";

const router = Router();

router.post("/", verify("admin"), vehicleController.createVehicle)

router.get("/", vehicleController.getAllVehicles)

router.get("/:id", vehicleController.getSignelVehicle)

router.put("/:id", verify("admin"), vehicleController.updateVehicle)

router.delete("/:id", verify("admin"), vehicleController.deleteVehicle)

export const vehicleRouter = router;