import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import mongoose from 'mongoose';
export const auth = betterAuth({
    database: mongodbAdapter(mongoose.connection.db),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                defaultValue: 'student'
            },
            name: {
                type: 'string',
                required: true
            },
            avatar: {
                type: 'string',
                required: false
            },
            isActive: {
                type: 'boolean',
                defaultValue: true
            }
        }
    }
});
//# sourceMappingURL=auth.js.map