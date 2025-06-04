import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: 100
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  openingHours: {
    type: String,
    required: [true, 'Opening hours are required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Use HH:MM format']
  },
  closingHours: {
    type: String,
    required: [true, 'Closing hours are required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Use HH:MM format']
  }
}, { timestamps: true });

companySchema.index({ location: '2dsphere' });

const Company = mongoose.model('Company', companySchema);
export default Company;