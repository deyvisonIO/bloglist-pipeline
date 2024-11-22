function dummy(blogs) {
  console.log(blogs)
  return 1;
}

function totalLikes(blogs) {
  if(blogs.length === 0) return 0; 

  const total = blogs.reduce((totalLikes, currentItem) => totalLikes + currentItem.likes, 0);
  return total;
}

function favoriteBlog(blogs) {
  if(blogs.length === 0) return {}; 

  const favorite = blogs.reduce((prevItem, currItem) => prevItem.likes < currItem.likes ? currItem : prevItem, { likes: -1 })

  return favorite
} 

function mostBlogs(blogs) {
  if(blogs.length === 0) return {};
  if(blogs.length === 1) {
    return {
      author: blogs[0].author,
      blogs: 1,
    }
  } 
  
  const authors = {};
  const authorWithMostBlogs = {
    author: "",
    blogs: -1
  };
  blogs.forEach(blog => authors[blog.author] === undefined ? authors[blog.author] = 1 : authors[blog.author]++);

  for(const [author, blogs] of Object.entries(authors)) {
    if(authorWithMostBlogs.blogs < blogs) {
      authorWithMostBlogs.author = author;
      authorWithMostBlogs.blogs= blogs;
    }
  }

  return authorWithMostBlogs
}

function mostLikes(blogs) {
  if(blogs.length === 0) return {};
  if(blogs.length === 1) {
    return {
      author: blogs[0].author,
      likes: blogs[0].likes,
    }
  } 
  
  const authors = {};
  const authorWithMostLikes = {
    author: "",
    likes: -1
  };
  blogs.forEach(blog => authors[blog.author] === undefined ? authors[blog.author] = blog.likes : authors[blog.author] += blog.likes);

  for(const [author, likes] of Object.entries(authors)) {
    if(authorWithMostLikes.likes < likes) {
      authorWithMostLikes.author = author;
      authorWithMostLikes.likes = likes;
    }
  }

  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
