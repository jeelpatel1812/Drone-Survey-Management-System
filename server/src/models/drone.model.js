import mongoose, {Schema} from 'mongoose';

const droneSchema = new Schema(
    {
        name: { type: String, required: true },
        model: { type: String, required: true },
        status: {
            type: String,
            enum: ['available', 'in-mission', 'maintenance', 'offline'],
            required: true,
        },
        batteryLevel: {
            type: Number,
            min: 0,
            max: 100,
        },
        location: {
            lat: Number,
            lng: Number
        },
        path: [
            {
                lat: Number,
                lng: Number,
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    }, {timestamps: true}
)

export const Drone = mongoose.model("Drone", droneSchema);