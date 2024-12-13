import { User } from "../models/User";
import { RoleTypes } from "../types/common.types";
import { getEnvVariable } from "../utils/getEnvVariable";
import { authUtils } from "../utils/auth.utils";

class BootstrapService {


    initializeAdmin = async (): Promise<boolean> => {
        try {


            const adminEmail = getEnvVariable("INIT_ADMIN_EMAIL") || null;
            const adminPassword = getEnvVariable("INIT_ADMIN_PASSWORD") || null;

            if (!adminEmail || !adminPassword) {
                throw new Error('Admin credentials not found in environment variables');
            }


            // Check if any admin exists
            const adminExists = await User.findOne({ role: RoleTypes.ADMIN, email: adminEmail });

            if (adminExists) {
                console.log('Admin account already exists. Skipping initialization.');
                return true;
            }

            const hashedPassword = await authUtils.hashPassword(adminPassword);

            const adminUser = new User({
                email: adminEmail,
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: RoleTypes.ADMIN,
                active: true
            });

            await adminUser.save();

            console.log('Admin account created successfully');
            console.log(`Email: ${adminEmail}`);
            console.log('Please change the password upon first login');
            return true

        } catch (error) {
            // you can inspect the exact error here.
            return false
        }
    };



}

export default new BootstrapService();