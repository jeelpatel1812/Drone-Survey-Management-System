import mongoose, {Schema} from 'mongoose';

const notificationSchema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        type: {
            type: String,
            enum: ['mission_start', 'mission_fail', 'report_ready'],
        },
        message: String,
        isRead: { type: Boolean, default: false }
  }, {timestamps: true}
)
  
export const Notification = mongoose.model("Notification", notificationSchema);