'use client';

import React from 'react';

export const AsciiLogo = () => {
  return (
    <pre className="text-[0.35rem] md:text-[0.45rem] leading-[1] font-black text-terminal-main select-none group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_8px_rgba(255,176,0,0.3)] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
{`
    ____  ____  __________ __ __
   / __ )/ __ \/ ____/ ___// //_/
  / __  / / / / __/ / /   / ,<   
 / /_/ / /_/ / /___/ /___/ /| |  
/_____/_____/_____/\____/_/ |_|  
`}
    </pre>
  );
};
