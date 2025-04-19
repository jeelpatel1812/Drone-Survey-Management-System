import mongoose, {Schema} from 'mongoose';

const missionSchema = new Schema(
    {
        name: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'scheduled', 'in-progress', 'completed', 'failed'],
            default: 'pending',
        },
        location: {
            type: [Number]
        },
        flightPath: [{ lat: Number, lng: Number, altitude: Number }],
        drone: { type: Schema.Types.ObjectId, ref: 'Drone' },
        scheduledTime: Date,
        // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    }, {timestamps: true}
)

missionSchema.index({ location: '2dsphere' });

export const Mission = mongoose.model("Mission", missionSchema);