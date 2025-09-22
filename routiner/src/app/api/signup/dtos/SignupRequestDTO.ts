export interface SignupRequest extends Request {
    name: string;
    email: string;
    password: string;
};