import * as React from 'react';
import Background from '../Images/Background.png';

export default function BackgroundContainer ({ children }) {
  return (
    <div style={{
      backgroundImage: `url(${Background})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    }}>{children}
    </div>
  );
}
