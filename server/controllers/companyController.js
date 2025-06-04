import Company from '../models/Company.js';
import { StatusCodes } from 'http-status-codes';
import { geocodeAddress } from '../utils/geocode.js';

// Register a new company
export const registerCompany = async (req, res, next) => {
  try {
    const { firstName, lastName, email, companyName, address, openingHours, closingHours, location } = req.body;

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Company already exists'
      });
    }

    // Use coordinates from frontend if provided, otherwise geocode
    let coordinates = location?.coordinates;
    if (!coordinates && address) {
      const geo = await geocodeAddress(address);
      coordinates = [geo.lng, geo.lat];
    }

    const company = await Company.create({
      firstName,
      lastName,
      email,
      companyName,
      address,
      openingHours,
      closingHours,
      location: {
        type: 'Point',
        coordinates: coordinates
      }
    });

    res.status(StatusCodes.CREATED).json(company); // Return the created company object
  } catch (error) {
    next(error);
  }
};

// Get all companies (return as array)
export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find();
    res.status(StatusCodes.OK).json(companies); // Return array only!
  } catch (error) {
    next(error);
  }
};