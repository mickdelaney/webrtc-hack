'use client';

import adapter from 'webrtc-adapter';
import { FC, PropsWithChildren } from "react";
import { RecoilRoot } from "recoil";

export const AppClient: FC<PropsWithChildren> =({ children })=> {
  return (
    <RecoilRoot>
      <div>
        {children}
      </div>
    </RecoilRoot>
  );
}
