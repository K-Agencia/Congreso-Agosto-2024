import mongoose, { Schema } from "mongoose";

const odontologos = new Schema({
  cedula: {
    type: String,
    require: true
  },
  nombres: {
    type: String,
    trim: true,
    lowercase: true
  },
  apellidos: {
    type: String,
    trim: true,
    lowercase: true
  },
  ciudad: {
    type: String,
    trim: true,
    lowercase: true
  },
  direccion: {
    type: String,
    trim: true,
    lowercase: true
  },
  celular: {
    type: String,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  especialidad: {
    type: String,
    trim: true,
    lowercase: true
  },
});

export default mongoose.model("odontologos", odontologos);