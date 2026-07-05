import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

/**
 * 1. Create Transport Route (Admin Only)
 */
export async function createRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, startLocation, endLocation, stops, transportFee } = req.body;
    const schoolId = req.schoolId;

    if (!schoolId) {
      return res.status(400).json({ message: 'schoolId context required for multi-tenant mapping.' });
    }
    if (!name || !startLocation || !endLocation || !stops) {
      return res.status(400).json({ message: 'name, startLocation, endLocation, and stops are required.' });
    }

    const route = await prisma.route.create({
      data: {
        name,
        startLocation,
        endLocation,
        stops,
        transportFee: transportFee ? parseFloat(transportFee) : 0.0,
        schoolId,
      }
    });

    return res.status(201).json(route);
  } catch (error) {
    next(error);
  }
}

/**
 * 2. Get All Transport Routes
 */
export async function getAllRoutes(req: Request, res: Response, next: NextFunction) {
  try {
    const schoolId = req.schoolId;
    if (!schoolId) {
      return res.status(400).json({ message: 'schoolId context required.' });
    }

    const routes = await prisma.route.findMany({
      where: { schoolId },
      include: {
        vehicles: true,
      }
    });

    return res.status(200).json(routes);
  } catch (error) {
    next(error);
  }
}

/**
 * 3. Create Transport Vehicle (Admin Only)
 */
export async function createVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const { regNumber, model, capacity, driverName, driverPhone, routeId } = req.body;
    const schoolId = req.schoolId;

    if (!schoolId) {
      return res.status(400).json({ message: 'schoolId context required.' });
    }
    if (!regNumber || !model || !capacity || !driverName) {
      return res.status(400).json({ message: 'regNumber, model, capacity, and driverName are required.' });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        regNumber,
        model,
        capacity: parseInt(capacity),
        driverName,
        driverPhone: driverPhone || '',
        schoolId,
        routeId: routeId || undefined,
      }
    });

    return res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
}

/**
 * 4. Get All Transport Vehicles
 */
export async function getAllVehicles(req: Request, res: Response, next: NextFunction) {
  try {
    const schoolId = req.schoolId;
    if (!schoolId) {
      return res.status(400).json({ message: 'schoolId context required.' });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { schoolId },
      include: {
        route: true
      }
    });

    return res.status(200).json(vehicles);
  } catch (error) {
    next(error);
  }
}

/**
 * 5. Assign Student Transport Route & Vehicle (Admin Only)
 */
export async function assignStudentTransport(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId, routeId, vehicleId } = req.body;

    if (!studentId || !routeId) {
      return res.status(400).json({ message: 'studentId and routeId are required.' });
    }

    const assignment = await prisma.studentTransport.upsert({
      where: { studentId },
      update: {
        routeId,
        vehicleId: vehicleId || undefined,
      },
      create: {
        studentId,
        routeId,
        vehicleId: vehicleId || undefined,
      },
      include: {
        route: true,
        vehicle: true,
      }
    });

    return res.status(200).json({
      message: 'Student transport route mapped successfully.',
      assignment
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 6. Get Student Transport Assignment details
 */
export async function getStudentTransport(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;

    const assignment = await prisma.studentTransport.findUnique({
      where: { studentId },
      include: {
        route: true,
        vehicle: true,
      }
    });

    if (!assignment) {
      return res.status(404).json({ message: 'No transport route assignment logged for this student.' });
    }

    return res.status(200).json(assignment);
  } catch (error) {
    next(error);
  }
}
