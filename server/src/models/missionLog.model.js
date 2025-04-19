import mongoose, {Schema} from 'mongoose';

const missionLogSchema = new Schema(
    {
        missionId: { type: Schema.Types.ObjectId, ref: 'Mission' },
        droneId: { type: Schema.Types.ObjectId, ref: 'Mission' },
        batteryLevel: Number,
        altitude: Number,
        latitude: Number,
        longitude: Number,
        processedData: String

    }, {timestamps: true}
)

export const MissionLog = mongoose.model("MissionLog", missionLogSchema);