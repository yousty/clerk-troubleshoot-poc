'use client';

import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'
import { isEmailLinkError, EmailLinkErrorCode } from '@clerk/nextjs/errors';
import { useClerk } from '@clerk/nextjs';

type VerificationStatus = 'loading' | 'failed' | 'expired' | 'verified';

export default function Verify() {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('loading');

  const { handleEmailLinkVerification } = useClerk();

  useEffect(() => {
    async function verify() {
      try {
        await handleEmailLinkVerification({
          // redirectUrl: 'https://redirect-to-pending-sign-in-like-2fa',
          redirectUrlComplete: '/',
        });
        // If we're not redirected at this point, it means
        // that the flow has completed on another device.
        setVerificationStatus('verified');
      } catch (err: any) {
        // Verification has failed.
        let status: VerificationStatus = 'failed';
        if (isEmailLinkError(err) && err.code === EmailLinkErrorCode.Expired) {
          status = 'expired';
        }
        setVerificationStatus(status);
      }
    }
    verify();
  }, [])

  if (verificationStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (verificationStatus === 'failed') {
    return <div>Email link verification failed</div>;
  }

  if (verificationStatus === 'expired') {
    return <div>Email link expired</div>;
  }

  return <div>Successfully signed in. Return to the original tab to continue.</div>;
}