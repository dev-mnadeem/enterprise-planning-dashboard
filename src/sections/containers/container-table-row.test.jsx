import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, signIn } from 'src/test/render';
import ContainerTableRow from './container-table-row';

it('shows container dimensions and deletes through the list callback', async () => {
  signIn({
    name: 'Admin',
    user_role: { name: 'admin' },
    permissions: [{ name: 'Container', properties: { remove: true } }],
  });
  const onDeleteContainer = jest.fn();
  jest.spyOn(window, 'confirm').mockReturnValue(true);
  const user = userEvent.setup();

  renderWithProviders(
    <table>
      <tbody>
        <ContainerTableRow
          id="c1"
          trackingNumber="CNT-0001"
          fromCountry={{ name: 'Ghana' }}
          toCountry={{ name: 'Netherlands' }}
          volume="33.20"
          width="2.35"
          height="2.39"
          depth="5.90"
          onDeleteContainer={onDeleteContainer}
        />
      </tbody>
    </table>
  );

  expect(screen.getByText('33.20 cbm')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /actions for CNT-0001/i }));
  await user.click(screen.getByRole('menuitem', { name: /delete/i }));
  expect(onDeleteContainer).toHaveBeenCalledWith('c1');
});
