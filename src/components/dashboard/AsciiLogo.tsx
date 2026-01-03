'use client';

import React from 'react';

export const AsciiLogo = () => {
  return (
    <pre className="text-[0.35rem] md:text-[0.45rem] leading-[1.1] font-black text-terminal-main select-none group-hover:text-white transition-colors duration-300">
{`
   ___  ___  ____ ____ _  __
  / _ )/ _ \/ __/ __/| |/ /
 / _  / // / _// /__ | ' < 
/____/____/___/\___/|_|_\\
`}
    </pre>
  );
};