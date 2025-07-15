import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const mongoUri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/lms';
        await mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        });
        console.log('MongoDB connected successfully');
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=database.js.map