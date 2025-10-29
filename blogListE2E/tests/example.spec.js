import { describe, test, expect, beforeEach, afterEach } from '@playwright/test';

describe('Blog List', () => {
  beforeEach(async ({page, request}) => {
    await request.post('/api/test/reset')
    await request.post('/api/users', {
      data: {
        name: 'testUser name',
        username: 'testUsername',
        password: 'testPass'
      }
    })
    await request.post('/api/users',{
      data: {
        name: 'testUser name2',
        username: 'testUsername2',
        password: 'testPass2'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({page}) => {
    const locator = page.getByText('Login to the Blog List')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct creds', async({page}) => {
      await page.getByLabel('Username').fill('testUsername')
      await page.getByLabel('Password').fill('testPass')
      await page.getByRole('button').click()
      await expect(page.getByText('testUser name is logged in')).toBeVisible()
    })

    test('fails with worng creds', async({page}) => {
      await page.getByLabel('Username').fill('testUsername')
      await page.getByLabel('Password').fill('wrong')
      await page.getByRole('button').click()
      await expect(page.getByText('Wrong Credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({page}) => {
      await page.getByLabel('Username').fill('testUsername')
      await page.getByLabel('Password').fill('testPass')
      await page.getByRole('button').click()
    })

    test('a new blog can be created', async ({page}) => {
      await page.getByRole('button', {name: 'Add a blog'}).click()
      await page.getByLabel('Title').fill('xxx playwright')
      await page.getByLabel('Author').fill('test author')
      await page.getByLabel('URL').fill('testsite.com')
      await page.getByRole('button', {name: 'Post'}).click()
      await expect(page.getByText('a new blog "xxx playwright" added successfully!')).toBeVisible()
      await expect(page.getByText('xxx playwright test author')).toBeVisible()
    })

    describe('when logged in and created a blog', () => {
      beforeEach(async ({page}) => {
        await page.getByRole('button', {name: 'Add a blog'}).click()
        await page.getByLabel('Title').fill('yyy playwright')
        await page.getByLabel('Author').fill('test author2')
        await page.getByLabel('URL').fill('testsite.com')
        await page.getByRole('button', {name: 'Post'}).click()
      })

      test('a blog can be liked', async ({page}) => {
        await page.getByRole('button', {name: 'view'}).click()
        await page.getByRole('button', {name: 'Like'}).click()
        await expect(page.getByText('1 people like this')).toBeVisible()
        await expect(page.getByText('Unlike')).toBeVisible()
      })

      test('a blog can be unliked', async ({page}) => {
        await page.getByRole('button', {name: 'view'}).click()
        await page.getByRole('button', {name: 'Like'}).click()
        await page.getByRole('button', {name: 'Unlike'}).click()
        await expect(page.getByText('0 people like this')).toBeVisible()
        await expect(page.getByText('Like')).toBeVisible()
      })

      test('the user can delete his own blog', async ({page}) => {
        await page.getByRole('button', {name: 'view'}).click()
        page.on('dialogue', dialogue => dialogue.accept())
        await page.getByRole('button', {name: 'Remove'}).click()
        await expect(page.getByText('yyy playwright test author2')).not.toBeVisible()
      })

      test('remove button not visible for other users', async({page}) => {
        await page.getByText('Log out').click()
        await page.getByLabel('Username').fill('testUsername2')
        await page.getByLabel('Password').fill('testPass2')
        await page.getByRole('button').click()
        await page.getByRole('button', {name: 'view'}).click()
        await expect(page.getByRole('button', {name: 'Remove'})).not.toBeVisible()

      })
    })

    describe('when multiple blogs', () => {
      beforeEach(async ({page}) => {
        //user1 posts blog1 and likes it
        await page.getByRole('button', {name: 'Add a blog'}).click()
        await page.getByLabel('Title').fill('blog1 here')
        await page.getByLabel('Author').fill('author1')
        await page.getByLabel('URL').fill('testsite.com')
        await page.getByRole('button', {name: 'Post'}).click()
        await page.getByRole('button', {name: 'view'}).click()
        await page.getByRole('button', {name: 'Like'}).click()
        // user1 posts blog2
        await page.getByRole('button', {name: 'Add a blog'}).click()
        await page.getByLabel('Title').fill('blog2 here')
        await page.getByLabel('Author').fill('author2')
        await page.getByLabel('URL').fill('testsite.com')
        await page.getByRole('button', {name: 'Post'}).click()
        //user1 logs out
        await page.getByText('Log out').click()
        //user2 logs in
        await page.getByLabel('Username').fill('testUsername2')
        await page.getByLabel('Password').fill('testPass2')
        await page.getByRole('button').click()
        //user2 likes blog1
        const blog1 =  page.getByText('blog1 here author1')
        await blog1.getByRole('button', {name: 'view'}).click()
        await page.getByRole('button', {name: 'Like'}).click()
        await page.getByRole('button', {name: 'hide'}).click()
        //user2 creates blog3
        await page.getByRole('button', {name: 'Add a blog'}).click()
        await page.getByLabel('Title').fill('blog3 here')
        await page.getByLabel('Author').fill('author3')
        await page.getByLabel('URL').fill('testsite.com')
        await page.getByRole('button', {name: 'Post'}).click()
        //user2 likes blog3
        const blog3 =  page.getByText('blog3 here author3')
        await blog3.getByRole('button', {name: 'view'}).click()
        await page.getByRole('button', {name: 'Like'}).click()
        await page.getByRole('button', {name: 'hide'}).click()
        //await page.reload({ waitUntil: 'networkidle' })
        //await page.getByRole('button', {name: 'Log out'}).click()
        //await page.getByLabel('Username').fill('testUsername')
        //await page.getByLabel('Password').fill('testPass')
        //await page.getByRole('button').click()
        await page.goto('/')
        await page.waitForSelector('.blog')
      })

      test('blogs are arranged by most liked', async({page}) => {
        await page.waitForFunction(() => {
          const blogs = Array.from(document.querySelectorAll('.blog')).map(e => e.textContent)
          // Make sure enough blogs are loaded, AND the first one is the correct one
          return blogs.length >= 3 && blogs[0].includes('blog1 here')
        })
        //extracting the text of each blog
        const blogArray = await page.locator('.blog').all()
        const blogTexts = await Promise.all(
          blogArray.map(async (b) => await b.textContent())
        )
        console.log('DEBUG blogTexts:', blogTexts);
        //comparing blogs order with expected
        expect(blogTexts[0]).toContain('blog1 here')
        expect(blogTexts[1]).toContain('blog3 here')
        expect(blogTexts[2]).toContain('blog2 here') 
      })
    })
  })
})