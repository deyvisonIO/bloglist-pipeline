function BlogForm({submitBlog}) {

  return (
    <form onSubmit={submitBlog}>
      <h2>Create new</h2>
      <div>
        <label htmlFor="title">title:</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Type your title"
        />
      </div>
      <div>
        <label htmlFor="author">author:</label>
        <input
          id="author"
          name="author"
          type="text"
          placeholder="Type your author"
        />
      </div>
      <div>
        <label htmlFor="url">url:</label>
        <input id="url" name="url" type="url" placeholder="Type your url" />
      </div>

      <button type="submit">create</button>
    </form>
  );
}

export default BlogForm;
