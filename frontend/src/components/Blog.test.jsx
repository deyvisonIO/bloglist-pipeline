import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import Blog from "./Blog";

test("renders only blog title and author information", () => {
  const blog = {
    title: "This is a test title",
    author: "authorTest",
    url: "http://www.url.com",
    user: {
      token: "fafjdklçDkafDç",
      username: "test"
    }
  };

  const { container } = render(<Blog blog={blog} username={blog.user.username} likeBlog={() => {}} handleBlogRemoval={() => {}} />) 

  const element = screen.getByText('This is a test title authorTest')
  const urlElement = container.querySelector(".blogUrl");
  expect(element).toBeDefined()
  expect(urlElement).toBeNull()
});

test("clicking the view button show all the information", async () => {
  const blog = {
    title: "This is a test title",
    author: "authorTest",
    url: "http://www.url.com",
    user: {
      token: "fafjdklçDkafDç",
      username: "test"
    }
  };

  const { container } = render(<Blog blog={blog} username={blog.user.username} likeBlog={() => {}} handleBlogRemoval={() => {}} />) 

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const element = screen.getByText('This is a test title authorTest')
  const urlElement = container.querySelector(".blogUrl")
  const likesElement = container.querySelector(".blogLikes")
  const userElement = container.querySelector(".blogUser")

  expect(element).toBeDefined()
  expect(urlElement).toBeDefined();
  expect(likesElement).toBeDefined();
  expect(userElement).toBeDefined();
})

test("clicking the like button twice calls the like function twice", async () => {
  const blog = {
    title: "This is a test title",
    author: "authorTest",
    url: "http://www.url.com",
    user: {
      token: "fafjdklçDkafDç",
      username: "test"
    }
  };

  const mockLike = vi.fn()

  render(<Blog blog={blog} username={blog.user.username} likeBlog={mockLike} handleBlogRemoval={() => {}} />) 

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')

  await user.click(viewButton)

  const element = screen.getByText('This is a test title authorTest')
  const likeButton = screen.getByText('like')

  await user.dblClick(likeButton)

  expect(element).toBeDefined()
  expect(mockLike.mock.calls).toHaveLength(2)
})

