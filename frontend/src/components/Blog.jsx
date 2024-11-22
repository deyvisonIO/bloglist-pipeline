import { useState } from "react";

function Blog({ blog, username, likeBlog, handleBlogRemoval }) {
  const [isAdditionalInformationVisible, setIsAdditionalInformationVisible] = useState(false);

  function toggleAdditionalInformationVisibility() {
    setIsAdditionalInformationVisible(prev => !prev);
  }

  return (
    <div style={{ border: "2px solid black", padding: "5px 1px 5px 1px" }}>
      <div>
        {blog.title} {blog.author} 
        <button onClick={toggleAdditionalInformationVisibility}>{isAdditionalInformationVisible ? "hide" : "view"  }</button>
      </div>
      {isAdditionalInformationVisible && (
        <>
          <div className="blogUrl">
            {blog.url}
          </div>
          <div className="blogLikes">
            likes {blog.likes}
            <button onClick={() => likeBlog(blog.id, blog.likes)}>like</button>
          </div>
          <div className="blogUser">
            {blog.user.username} 
          </div>
          {username === blog.user.username && <button onClick={() => handleBlogRemoval(blog.id, blog.title, blog.author)}>remove</button>}
        </>
      )}
    </div>  
  )
}


export default Blog
