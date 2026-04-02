import { getServerSession } from 'next-auth';
import jwt from 'jsonwebtoken';
import { authOptions } from '@/lib/auth';

export async function getUser(request) {
  // 1. Try NextAuth session first (for browser/OAuth users)
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return { id: session.user.id, name: session.user.name, email: session.user.email };
  }

  // 2. Try JWT Bearer token (for Postman / API users)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
      return { id: decoded.userId, name: decoded.name, email: decoded.email };
    } catch {
      return null;
    }
  }

  return null;
}
