import { test, expect } from "@playwright/test"

test.describe('blog app', () => {
  test.beforeEach(async ({ page, request }) => { 
    const user = {
      name:     'test',
      username: 'test',
      password: 'test'
    }
    const r1 = await request.post('/api/testing/reset')
    expect(r1.status()).toBe(204)

    const r2 = await request.post('/api/users/', {
      data: user,
    })
    expect(r2.status()).toBe(201)

    await page.goto('/')
  })

  test('frontend loads', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })


  test('login is loaded', async ({page}) => {
    const username = page.locator('input[type="text"]')
    const password = page.locator('input[type="password"]')

    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
  })

  test.describe("login", () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const username = page.locator('input[type="text"]')
      const password = page.locator('input[type="password"]')
      const loginButton = page.locator('button[type="submit"]')

      await username.fill('test')
      await password.fill('test')
      await loginButton.click()

      await expect(page.getByText('test logged in')).toBeVisible()
    })


    test('fails with wrong credentials', async ({ page }) => {
      const username = page.locator('input[type="text"]')
      const password = page.locator('input[type="password"]')
      const loginButton = page.locator('button[type="submit"]')

      await username.fill('wrong')
      await password.fill('wrong')
      await loginButton.click()

      await expect(page.getByText('invalid username or password')).toBeVisible()
    })

  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('input[type="text"]').fill('test')
      await page.locator('input[type="password"]').fill('test')
      await page.locator('button[type="submit"]').click()
    })


    test('logout works', async ({ page }) => {
      await page.getByText('logout').click()

      await expect(page.getByText('Log in to application')).toBeVisible()
    })


    test('a blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create' }).click()

      await page.locator('#title').fill('playwright test :)')
      await page.locator('#author').fill('playwright author :)')
      await page.locator('#url').fill('http://www.playwright.com')
      await page.locator('button[type="submit"]').click()

      await expect(page.getByText('playwright test :) playwright author :)')).toBeVisible()
    })

    test.describe("test a blog created by the user", () => {
      test.beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create' }).click()
        await page.locator('#title').fill('playwright test :)')
        await page.locator('#author').fill('playwright author :)')
        await page.locator('#url').fill('http://www.playwright.com')
        await page.locator('button[type="submit"]').click()
      })

      test('a blog can be liked', async ({ page }) => {
        await expect(page.getByText('playwright test :) playwright author :)')).toBeVisible()
        await page.getByText('view').click()
        await page.getByText('like').click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted by creator', async ({ page }) => {
        await expect(page.getByText('playwright test :) playwright author :)')).toBeVisible()
        await page.getByText('view').click()

        page.on('dialog', async (dialog) => {
          const dialogText = `Remove blog playwright test :) by playwright author :)`
          if (dialog.message() === dialogText) {
            await dialog.accept()
          }
        })

        await page.getByText('remove').click()
        await expect(page.getByText('No blogs to show')).toBeVisible()
      })
    })


    test.describe("test a blog not created by the user", () => {
      test.beforeEach(async ({ page, request }) => {
        const newBlog = {
          title: 'test2Blog',
          author: 'test2Author',
          url: 'http://www.test2.com'
        }

        const user = {
          name: "test2",
          username: "test2",
          password: "test2"
        }

        await request.post('/api/users/', {
          data: user,
        })

        await page.getByRole('button', { name: 'create' }).click()

        await page.locator('#title').fill(newBlog.title)
        await page.locator('#author').fill(newBlog.author)
        await page.locator('#url').fill(newBlog.url)
        await page.locator('button[type="submit"]').click()


        await page.getByText('logout').click()

        await page.locator('input[type="text"]').fill('test2')
        await page.locator('input[type="password"]').fill('test2')
        await page.locator('button[type="submit"]').click()

        // await request.post('/api/testing/create-blog', {
        //   data: newBlog
        // })

        // await page.goto('/')
      })

      test('a blog can be liked', async ({ page }) => {
        await expect(page.getByText('test2Blog test2Author')).toBeVisible()
        await page.getByText('view').click()
        await page.getByText('like').click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can\'t be deleted by another user', async ({ page }) => {

        await expect(page.getByText('test2Blog test2Author')).toBeVisible()

        await page.getByText('view').click()
        await expect(page.getByText('remove')).toBeHidden()
      })
    })

    test.describe("test multiple blogs", () => {
      test.beforeEach(async ({ request }) => {
        await request.post('/api/testing/create-multiple-blogs')
      })

      test('blogs are ordered in descending order', async ({ page }) => {
        await page.goto('/')
        
        const blogContainer = page.locator('.blogs')
        
        await expect(blogContainer.locator(':scope > *').nth(0)).toContainText("Type wars Robert C. Martin")
        await expect(blogContainer.locator(':scope > *').nth(1)).toContainText("TDD harms architecture Robert C. Martinview")
        await expect(blogContainer.locator(':scope > *').nth(2)).toContainText("First class tests Robert C. Martinview")
        await expect(blogContainer.locator(':scope > *').nth(3)).toContainText("Canonical string reduction Edsger W. Dijkstraview")
        await expect(blogContainer.locator(':scope > *').nth(4)).toContainText("Go To Statement Considered Harmful Edsger W. Dijkstraview")
        await expect(blogContainer.locator(':scope > *').nth(5)).toContainText("React patterns Michael Chanview")
      })
    })

  })
})
