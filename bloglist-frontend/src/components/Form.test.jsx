import Form from './Form'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'

test('New blog form calls its handler with the right details', async () => {
  const user = userEvent.setup()
  const mockHandlePosting = vi.fn()

  render(<Form handlePosting={mockHandlePosting}/>)
  const addButton = screen.getByText('Add a blog')
  await user.click(addButton)
  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], 'xxx')
  await user.type(inputs[1], 'yyy')
  await user.type(inputs[2], 'www.xxx.com')

  const button = screen.getByText('Post')
  await user.click(button)

  expect(mockHandlePosting.mock.calls).toHaveLength(1)
  expect(mockHandlePosting).toHaveBeenCalledWith({
    title: 'xxx', author: 'yyy', url: 'www.xxx.com'
  })
})