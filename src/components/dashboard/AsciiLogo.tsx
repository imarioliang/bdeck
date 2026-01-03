'use client';

import React from 'react';

export const AsciiLogo = () => {
  return (
    <pre className="text-[0.4rem] md:text-[0.5rem] leading-[1.1] font-bold text-terminal-main select-none group-hover:text-white transition-colors duration-300">
{`
 ____  ____  _____ ____ _  __
| __ )|  _ \| ____/ ___| |/ /
|  _ \| | | |  _| | |   | ' /
| |_) | |_| | |___| |___| . \
|____/|____/|_____|\____|_|_\\
`}
    </pre>
  );
};
