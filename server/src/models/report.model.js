import mongoose, {Schema} from 'mongoose';

const reportSchema = new Schema(
    {
        missionId:{ type: Schema.Types.ObjectId, ref: 'Mission' },
        mission: String,
        droneId: { type: Schema.Types.ObjectId, ref: 'Drone' },
        startTime: { type: Date, default: Date.now },
        endTime: { type: Date, default: Date.now },
        duration: Number,
        distance: Number,
        coverageArea: String,
        summary: String,
        batteryConsumption : Number,
        status: {
            type: String,
            enum: ['pending', 'scheduled', 'in-progress', 'completed', 'failed'],
            default: 'pending',
        },
    }, {timestamps: true}
)

export const Report = mongoose.model("Report", reportSchema);