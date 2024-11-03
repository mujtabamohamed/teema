import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

import SignUpForm from '@/components/SignUpForm';

const page = async() => {

  const session = await getServerSession(authOptions);
  if (session) redirect("/teams");
  return (
    <div>
        <SignUpForm />
    </div>
  )
}

export default page