 

import { getSession } from '@/lib/auth/session';

import { NavMobileClient } from "./mobile-nav-client";

export async function NavMobile() {

  const session = await getSession();

  return (
    <>
      <NavMobileClient session={session} />
    </>
  );
}
