// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
// Import from your new auth.ts file
import { authOptions } from '@/app/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


