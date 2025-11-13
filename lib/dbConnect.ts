import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URL;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local"
	);
}

type MongooseCache = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

declare global {
	var __mongoose_cache: MongooseCache | undefined;
}

const cached = global.__mongoose_cache ?? { conn: null, promise: null };

async function dbConnect(): Promise<typeof mongoose> {
	if (cached.conn) {
		return cached.conn;
	}

		if (!cached.promise) {
			cached.promise = mongoose.connect(MONGODB_URI!);
		}

	cached.conn = await cached.promise;
	global.__mongoose_cache = cached;
	return cached.conn;
}

export default dbConnect;