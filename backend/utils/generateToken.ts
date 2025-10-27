import jwt from 'jsonwebtoken'

export const generateToken = (userId: string): string => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
    return token;
}