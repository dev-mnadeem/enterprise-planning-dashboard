import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import PasswordField from './PasswordField';

test('password visibility toggles without changing its value', () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    act(() => root.render(<PasswordField title="Password" value="sample-password" onChange={() => {}} />));
    const input = container.querySelector('input');
    const button = container.querySelector('button');
    expect(input.type).toBe('password');
    act(() => button.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(input.type).toBe('text');
    expect(input.value).toBe('sample-password');
    act(() => button.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(input.type).toBe('password');
  } finally {
    act(() => root.unmount());
    container.remove();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});
