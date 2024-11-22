import { render, screen } from "@testing-library/react"
import BlogForm from "./BlogForm"
import userEvent from "@testing-library/user-event"


test("event handler gets called with the right props", async () => {
  
  const submitFunction = vi.fn((event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const title = formData.get("title")
    const author = formData.get("author")
    const url = formData.get("url")

    return {title, author, url}
  })
  const user = userEvent.setup()

  const expectedReturn = {
    title: "test title",
    author: "test author",
    url: "http://www.url.com",
  }

  render(<BlogForm submitBlog={submitFunction} />)

  const titleInput = screen.getByPlaceholderText("Type your title") 
  const authorInput = screen.getByPlaceholderText("Type your author") 
  const urlInput = screen.getByPlaceholderText("Type your url") 
  const submitButton = screen.getByText("create")

  await user.type(titleInput, "test title")
  await user.type(authorInput, "test author")
  await user.type(urlInput, "http://www.url.com")

  await user.click(submitButton)

  expect(submitFunction.mock.calls).toHaveLength(1)
  expect(submitFunction).toHaveReturned(expectedReturn)

  
})
