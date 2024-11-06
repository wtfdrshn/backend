import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const organizerSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  organization: {
    type: String,
    required: [true, 'Please add an organization']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please add a street']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please add a zip code']
    },
    country: {
      type: String,
      required: [true, 'Please add a country']
    }
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  otp: {
    code: String,
    expiresAt: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
organizerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
organizerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
      
export default mongoose.model('Organizer', organizerSchema); 