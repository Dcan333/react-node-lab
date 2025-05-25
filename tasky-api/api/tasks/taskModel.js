import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  deadline: { type: Date, required: true },
  done: { type: Boolean, default: false },
  priority: { 
    type: String, 
    enum: ["Low", "Medium", "High"], 
    required: true 
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Remove or modify the date validator - it's preventing past dates
// If you want to allow past dates, remove this validator entirely
// const dateValidator = (date) => {
//   return date > new Date();
// }
// TaskSchema.path("deadline").validate(dateValidator);

// Or modify it to allow today's date:
const dateValidator = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today
  return date >= today;
}
TaskSchema.path("deadline").validate(dateValidator, "Deadline cannot be in the past");

export default mongoose.model('Task', TaskSchema);