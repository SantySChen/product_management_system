import { JwtPayload } from 'jsonwebtoken'; 

declare global {
  namespace Express {
    interface User {
      _id: string;
      email: string;
      isManager: boolean;
      token?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {}; 
