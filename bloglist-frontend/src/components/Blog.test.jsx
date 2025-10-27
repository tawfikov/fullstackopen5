import Blog from './Blog'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'


test('Blog normally only renders title and author', () => {
  const blog = {
    title: 'xxx',
    author: 'yyy',
    url: 'xxx.com',
    likes: [],
    user: {
      id: '0123456789'
    }
  }

  const user = { id: '21436587' }

  render(<Blog blog={blog} currentUser={user}/>)
  const element = screen.getByText('xxx yyy')
  const url = screen.queryByText('xxx.com')
  expect(element).toBeDefined()
  expect(url).not.toBeVisible()
})


test('detailed version is show after the button is clicked', async () => {
  const blog = {
    title: 'xxx',
    author: 'yyy',
    url: 'xxx.com',
    likes: [],
    user: {
      id: '0123456789'
    }
  }

  const currentUser = { id: '21436587' }
  render( <Blog blog={blog} currentUser={currentUser}/>)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const url = screen.getByText('xxx.com')
  const likes = screen.getByText('0 people like this')

  expect(url).toBeVisible()
  expect(likes).toBeVisible()

})

test('like button clicked twice, results in calling the event handler twice', async () => {
  const blog = {
    title: 'xxx',
    author: 'yyy',
    url: 'xxx.com',
    likes: [],
    user: {
      id: '0123456789'
    }
  }
  const currentUser = { id: '21436587' }
  const likeMockHandler = vi.fn()

  render( <Blog blog={blog} currentUser={currentUser} handleLikes={likeMockHandler}/>)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(likeMockHandler.mock.calls).toHaveLength(2)

})
