import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = mongoose.Schema({
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
  age: {
    type: Number,
    required: [true, 'Please add an age']
  },
  gender: {
    type: String,
    required: [true, 'Please add a gender']
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
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add a date of birth']
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema); 