import mongoose from 'mongoose';
import dns from 'dns';

/* Set public DNS servers to resolve MongoDB Atlas SRV records if local DNS fails */
dns.setServers(['8.8.8.8', '1.1.1.1']);

/* asynchronous arrow function -> allows to use await keyword inside function */
/* await -> pauses execution of an async function until a Promise is settled (resolved or rejected). */
const connectDB = async () => {
    try {
        /* mongoose.connection -> object that represents the connection of Mongoose to a MongoDB database */
        /* on('connected') -> event listener that is triggered when the database connection is successfully established */
        mongoose.connection.on('connected', () => console.log("Database Connected !!"));
        
        /*await -> pauses execution of connectDB() until the promise returned by mongoose.connect() is settled */
        await mongoose.connect(`${process.env.MONGODB_URI}/checkinpass`);
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
    }
}


export default connectDB;