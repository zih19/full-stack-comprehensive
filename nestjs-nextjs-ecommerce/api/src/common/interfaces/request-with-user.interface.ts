// define a custom HTTP request type that extends the standard express request to include the user property
// indicate that the user exists and has a specific shape
import { Request } from 'express';
export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}
