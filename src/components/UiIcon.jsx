import React from 'react';
export function Icon({name,size=18}) {return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><use href={`/icons.svg#${name}`}/></svg>}
